// This file was added by edgio init.
// You should commit this file to source control.

import { Router } from '@edgio/core/router'

export default new Router()
  .static('_site')
  .fallback(({ appShell }) => {
    appShell('_site/index.html')
  })
