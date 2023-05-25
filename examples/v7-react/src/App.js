import Navbar from './components/Navbar'
import { Outlet } from 'react-router-dom'
// import Router from '@edgio/rum/Router.js'
// import Metrics from '@edgio/rum/Metrics.js'
import { Fragment, useEffect } from 'react'
import { install } from '@edgio/prefetch/window'
import installDevtools from '@edgio/devtools/install'

const App = () => {
  useEffect(() => {
    install().then(() => {
      installDevtools()
    })
    // Implementing Real Time User Monitoring (Core Web Vitals)
    // https://docs.edg.io/guides/core_web_vitals#npm-or-yarn
    // new Metrics({
    //   // Set this TOKEN as an environment variable at Edgio Console
    //   // More on creating env variables: https://docs.edg.io/guides/environments#creating-environment-variables
    //   token: '677853de-d66e-47ed-aa83-40f8e38922d5',
    //   router: new Router()
    //     .match('/', ({ setPageLabel }) => setPageLabel('home'))
    //     .match('/commerce', ({ setPageLabel }) => setPageLabel('commerce'))
    //     .match('/product/:id', ({ setPageLabel }) => setPageLabel('product/:id')),
    // }).collect()
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
