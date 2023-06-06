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
  .match('/:path*/:file.:ext(js|css|mjs|png|ico|svg|jpg|jpeg|gif|ttf|woff|otf)', {
    ...cachingFeature,
    origin: {
      set_origin: 'origin',
    },
  })
  .match('/edgio-assets/:path*', {
    ...cachingFeature,
    origin: {
      set_origin: 'assets',
    },
    url: {
      url_rewrite: [
        {
          source: '/edgio-a/:path*',
          syntax: 'path-to-regexp',
          destination: '/:path*',
        },
      ],
    },
  })
  .match('/', {
    ...cachingFeature,
    ...headersFeature,
  })
  .match('/', ({ proxy }) => {
    proxy('origin', {
      transformResponse: (res) => {
        injectBrowserScript(res)
        const $ = load(responseBodyToString(res))
        res.body = $.html().replace(/https?:\/\/files.smashing.media\//g, '/edgio-assets/')
      },
    })
  })
  .match('/articles', {
    ...cachingFeature,
    ...headersFeature,
  })
  .match('/articles', ({ proxy }) => {
    proxy('origin', {
      transformResponse: (res) => {
        injectBrowserScript(res)
        const $ = load(responseBodyToString(res))
        res.body = $.html().replace(/https?:\/\/files.smashing.media\//g, '/edgio-assets/')
      },
    })
  })
  .match('/2023/06/:path*', {
    ...cachingFeature,
    ...headersFeature,
  })
  .match('/2023/06/:path', ({ proxy }) => {
    proxy('origin', {
      transformResponse: (res) => {
        injectBrowserScript(res)
        const $ = load(responseBodyToString(res))
        res.body = $.html().replace(/https?:\/\/files.smashing.media\//g, '/edgio-assets/')
      },
    })
  })
  .use(starterRoutes)
