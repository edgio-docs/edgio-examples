export const ASSET_CACHE_HANDLER = {
  headers: {
    remove_origin_response_headers: ['set-cookie', 'cache-control'],
    set_response_headers: {
      'x-sw-cache-control': 'max-age=86400',
    },
  },
  caching: {
    max_age: '31536000s',
    stale_while_revalidate: '86400s',
    service_worker_max_age: '86400s',
    bypass_client_cache: true,
  },
}
