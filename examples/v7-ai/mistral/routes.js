import { Router } from '@edgio/core'
import { connectorRoutes } from '@edgio/connectors'

export default new Router().use(connectorRoutes)