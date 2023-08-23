// This file was automatically added by edgio init.
// You should commit this file to source control.

import { Router } from '@edgio/core'
import type { Features } from '@edgio/core/types'
import { vueRoutes } from '@edgio/vue-cva'

const defaultFeatures: Features = {
  caching: {
    max_age: '1d',
    stale_while_revalidate: '1d',
    service_worker_max_age: '1h'
  }
}

export default new Router().match('/(.*)', defaultFeatures).use(vueRoutes)
