import './index.css'
import App from './App'
import Layer0RUM from './rum'
import { render } from 'solid-js/web'
import { Router } from '@solidjs/router'
import install from '@edgio/prefetch/window/install'
import installDevtools from '@edgio/devtools/install'

render(
  () => (
    <Router>
      <App />
    </Router>
  ),
  document.getElementById('root')
)

if (process.env.NODE_ENV === 'production') {
  install()
  installDevtools()
  Layer0RUM('e9590c01-168f-4352-8b77-a2bc7efb4f78')
}
