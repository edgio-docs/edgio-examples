import { RemixBrowser } from '@remix-run/react'
import { hydrateRoot } from 'react-dom/client'

hydrateRoot(document, <RemixBrowser />)

import { Metrics } from '@edgio/rum'
import Router from '@edgio/rum/Router'
import install from '@edgio/prefetch/window/install'
import installDevtools from '@edgio/devtools/install'

new Metrics({
  token: 'ee4f7a19-1484-4481-ba64-1173586fa120',
  router: new Router()
    .match('/', ({ setPageLabel }) => setPageLabel('home'))
    .match('/commerce', ({ setPageLabel }) => setPageLabel('commerce'))
    .match('/product/:id', ({ setPageLabel }) => setPageLabel('product/:id')),
}).collect()

install()

installDevtools()
