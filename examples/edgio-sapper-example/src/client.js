import * as sapper from '@sapper/app'
import installDevtools from '@edgio/devtools/install'
import { install as installSW } from '@edgio/prefetch/window'

sapper.start({
  target: document.querySelector('#sapper'),
})

installDevtools()
installSW()
