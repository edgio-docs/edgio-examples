// This file was added by edgio init.
// You should commit this file to source control.
import { Router } from '@edgio/core'
import { connectorRoutes } from '@edgio/connectors'

export default new Router()
  .use(connectorRoutes)
  
  // Handle JWT traffic.
  .post('/jwt', {
    edge_function: './edge-functions/validate.js'
  })
