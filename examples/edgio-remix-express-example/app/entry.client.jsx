import { RemixBrowser } from '@remix-run/react'
import { hydrateRoot } from 'react-dom/client'

hydrateRoot(document, <RemixBrowser />)

import { Metrics } from '@layer0/rum'
import Router from '@layer0/rum/Router'
import install from '@layer0/prefetch/window/install'
import installDevtools from '@layer0/devtools/install'

new Metrics({
  token: 'ee4f7a19-1484-4481-ba64-1173586fa120',
  router: new Router()
    .match('/', ({ setPageLabel }) => setPageLabel('home'))
    .match('/commerce', ({ setPageLabel }) => setPageLabel('commerce'))
    .match('/product/:id', ({ setPageLabel }) => setPageLabel('product/:id')),
}).collect()

install()

installDevtools()
