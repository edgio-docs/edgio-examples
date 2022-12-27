import { enableProdMode } from '@angular/core'
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'

import { AppModule } from './app/app.module'
import { environment } from './environments/environment'

import installDevtools from '@edgio/devtools/install'
import { install as installSW } from '@edgio/prefetch/window'

if (environment.production) {
  enableProdMode()
}

function bootstrap() {
  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch((err) => console.error(err))
  installDevtools()
  installSW()
}

if (document.readyState === 'complete') {
  bootstrap()
} else {
  document.addEventListener('DOMContentLoaded', bootstrap)
}
