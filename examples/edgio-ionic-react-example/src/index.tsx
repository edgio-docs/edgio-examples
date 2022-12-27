import App from './App'
import React from 'react'
import ReactDOM from 'react-dom'
import installDevtools from '@layer0/devtools/install'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)

serviceWorkerRegistration.register()

installDevtools()
