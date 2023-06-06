import { load } from 'cheerio'
import { Router } from '@edgio/core'
import { injectBrowserScript, starterRoutes } from '@edgio/starter'
import responseBodyToString from '@edgio/core/utils/responseBodyToString'

const cachingFeature = {
  caching: {
    max_age: '1h',
    service_worker_max_age: '60s',
    stale_while_revalidate: '1d',
    ignore_origin_no_cache: [200],
    bypass_client_cache: true,
    cache_key_query_string: {
      include_all_except: ['edgio_dt_pf', 'edgio_prefetch'],
    },
  },
}

const headersFeature = {
  headers: {
    remove_origin_response_headers: ['cache-control'],
  },
}

export default new Router()
  .match('/wiki/:path*', {
    ...cachingFeature,
    ...headersFeature,
    origin: {
      set_origin: 'origin',
    },
  })
  .match('/wiki/:path*', ({ proxy }) => {
    proxy('origin', {
      transformResponse: (res) => {
        console.log('transform')
        injectBrowserScript(res)
        const $ = load(responseBodyToString(res))
        res.body = $.html().replace(/\/\/upload.wikimedia.org\//g, '/uploads/')
      },
    })
  })
  .match('/uploads/:path*', {
    origin: {
      set_origin: 'upload',
    },
    response: {
      optimize_images: true,
    },
    url: {
      url_rewrite: [
        {
          source: '/uploads/:path*',
          syntax: 'path-to-regexp',
          destination: '/:path*?format=webp',
        },
      ],
    },
  })
  .use(starterRoutes)
