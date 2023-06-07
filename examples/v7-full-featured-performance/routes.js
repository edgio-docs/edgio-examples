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
  // The default configuration to apply on all routes
  .match('/:path*', {
    ...cachingFeature,
    ...headersFeature,
    origin: {
      set_origin: 'origin',
    },
  })
  // Caching pages, be specific as possible
  .match('/wiki/Main_Page', ({ proxy }) => {
    proxy('origin', {
      transformResponse: (res) => {
        injectBrowserScript(res)
        const $ = load(responseBodyToString(res))
        res.body = $.html().replace(/\/\/upload.wikimedia.org\//g, '/uploads/')
      },
    })
  })
  // Caching pages, be specific as possible
  .match('/wiki/Talk:Main_Page', ({ proxy }) => {
    proxy('origin', {
      transformResponse: (res) => {
        injectBrowserScript(res)
        const $ = load(responseBodyToString(res))
        res.body = $.html().replace(/\/\/upload.wikimedia.org\//g, '/uploads/')
      },
    })
  })
  // URL Rewrite from /uploads/X to /X
  .match('/uploads/:path*', {
    ...cachingFeature,
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
          destination: '/:path*',
        },
      ],
    },
  })
  // Image Optimization all jpeg & jpg to webp
  .match('/static/:path*', {
    ...cachingFeature,
    origin: {
      set_origin: 'origin',
    },
    response: {
      optimize_images: true,
    },
    url: {
      url_rewrite: [
        {
          source: '/(.*)\\.(jpeg|jpg)',
          syntax: 'regexp',
          destination: '/%{request_uri:1}%{is_amp:=?}auto=webp',
        },
      ],
    },
  })
  .use(starterRoutes)
