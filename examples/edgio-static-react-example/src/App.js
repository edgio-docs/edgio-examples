import { Metrics } from '@edgio/rum'
import Router from '@edgio/rum/Router'
import Navbar from './components/Navbar'
import { Outlet } from 'react-router-dom'
import { Fragment, useEffect } from 'react'
import { install } from '@edgio/prefetch/window'
import installDevtools from '@edgio/devtools/install'

const App = () => {
  useEffect(() => {
    // As the whole output will be static folder, let's include cache misses, coming from S3
    install({ includeCacheMisses: true })
    // Enable devtools manually, instead of relying on defaults by Layer0
    installDevtools()
    // Implementing Real Time User Monitoring (Core Web Vitals)
    // https://docs.layer0.co/guides/core_web_vitals#npm-or-yarn
    new Metrics({
      // Set this TOKEN as an environment variable at Layer0 Console
      // More on creating env variables: https://docs.layer0.co/guides/environments#creating-environment-variables
      token: '677853de-d66e-47ed-aa83-40f8e38922d5',
      router: new Router()
        .match('/', ({ setPageLabel }) => setPageLabel('home'))
        .match('/commerce', ({ setPageLabel }) => setPageLabel('commerce'))
        .match('/product/:id', ({ setPageLabel }) => setPageLabel('product/:id')),
    }).collect()
  }, [])
  return (
    <Fragment>
      <Navbar />
      <Outlet />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" />
    </Fragment>
  )
}

export default App
