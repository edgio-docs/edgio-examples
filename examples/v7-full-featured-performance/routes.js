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
    // set_response_headers: {
    //   'Accept-CH': 'DPR, Viewport-Width, Width, ECT, Downlink',
    //   'Accept-CH-Lifetime': '86400',
    // },
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
  // Proxy /wiki to origin, transforming the response to inject the browser script and
  // rewrite the image URLs to use the /uploads origin for image optimization
  .match('/wiki/:path*', ({ proxy }) => {
    proxy('origin', {
      transformResponse: (res) => {
        injectBrowserScript(res)
        const $ = load(responseBodyToString(res))

        // Replace the domain and append ?auto=webp in img tags src attribute
        // for image optimization
        $('img').each((index, element) => {
          const $img = $(element)
          const src = $img.removeAttr('srcset').attr('src')
          if (src && src.startsWith('//upload.wikimedia.org/')) {
            const modifiedSrc = src.replace(/\/\/upload\.wikimedia\.org\//, '/uploads/')
            console.log('modifiedSrc', modifiedSrc)
            $img.attr('src', modifiedSrc + '?auto=webp')
          }
        })

        res.body = $.html()
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
