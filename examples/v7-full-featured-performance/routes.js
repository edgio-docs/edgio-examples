import { load } from 'cheerio'
import { Router } from '@edgio/core'
import CustomCacheKey from '@edgio/core/router/CustomCacheKey'
import { injectBrowserScript, starterRoutes } from '@edgio/starter'
import responseBodyToString from '@edgio/core/utils/responseBodyToString'

export default new Router()
  .match('/:path*/:file.:ext(js|css|mjs|png|ico|svg|jpg|jpeg|gif|ttf|woff|otf)', {
    caching: {
      max_age: '86400s',
      service_worker_max_age: '60s',
      ignore_origin_no_cache: [200],
      bypass_client_cache: true,
      cache_key_query_string: {
        include_all_except: ['edgio_dt_pf', 'edgio_prefetch'],
      },
    },
    origin: {
      set_origin: 'origin',
    },
  })
  .match('/edgio-assets/:path*', {
    caching: {
      max_age: '86400s',
      service_worker_max_age: '60s',
      ignore_origin_no_cache: [200],
      bypass_client_cache: true,
      cache_key_query_string: {
        include_all_except: ['edgio_dt_pf', 'edgio_prefetch'],
      },
    },
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
    caching: {
      max_age: '1h',
      service_worker_max_age: '60s',
      stale_while_revalidate: '1d',
      bypass_client_cache: true,
      cache_key_query_string: {
        include_all_except: ['edgio_dt_pf', 'edgio_prefetch'],
      },
    },
    headers: {
      remove_origin_response_headers: ['cache-control'],
    },
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
    caching: {
      max_age: '1h',
      service_worker_max_age: '60s',
      stale_while_revalidate: '1d',
      bypass_client_cache: true,
      cache_key_query_string: {
        include_all_except: ['edgio_dt_pf', 'edgio_prefetch'],
      },
    },
    headers: {
      remove_origin_response_headers: ['cache-control'],
    },
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
  .match('//2023/06/:path', {
    caching: {
      max_age: '1h',
      service_worker_max_age: '60s',
      stale_while_revalidate: '1d',
      bypass_client_cache: true,
      cache_key_query_string: {
        include_all_except: ['edgio_dt_pf', 'edgio_prefetch'],
      },
    },
    headers: {
      remove_origin_response_headers: ['cache-control'],
    },
  })
  .match('/2023/06/:path', ({ proxy }) => {
    proxy('origin', {
      transformResponse: (res, req) => {
        injectBrowserScript(res)
        const $ = load(responseBodyToString(res))
        res.body = $.html().replace(/https?:\/\/files.smashing.media\//g, '/edgio-assets/')
      },
    })
  })
  .use(starterRoutes)
