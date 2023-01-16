import App from './App.vue'
import './compiled/output.css'
import { createApp } from 'vue'
import { router } from './router'

const app = createApp(App).use(router)
app.mount('#app')

import EdgioRUM from '../edgio/rum'
import { install } from '@edgio/prefetch/window'
import installDevtools from '@edgio/devtools/install'

installDevtools()
install({ includeCacheMisses: true })
EdgioRUM('789a5742-3d8d-4894-90ec-6ca44b91f914')
