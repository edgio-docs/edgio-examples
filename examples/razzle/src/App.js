import Home from './components/Home'
import { Helmet } from 'react-helmet'
import Header from './components/Header'
import { useEffect, useState } from 'react'
import ProductPage from './components/ProductPage'
import { Route, Switch, Redirect } from 'react-router-dom'
import { prefetch } from '@edgio/prefetch/window/prefetch'
import ProductListingPage from './components/ProductListingPage'

const App = () => {
  const [mounted, setMounted] = useState('print')
  useEffect(() => {
    setMounted('all')
    // register a listener for SW messages to prefetch images from the PLP API responses
    const { serviceWorker } = navigator
    if (serviceWorker) {
      serviceWorker.addEventListener('message', (event) => {
        if (event.data.action === 'prefetch') {
          prefetch(event.data.url, event.data.as, event.data.options)
        }
      })
    }
  }, [])

  return (
    <>
      <Helmet>
        <link
          media={mounted}
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
        />
      </Helmet>
      <Header />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/category/:slug" component={ProductListingPage} />
        <Route path="/product/:slug" component={ProductPage} />
        <Redirect to="/" />
      </Switch>
    </>
  )
}

export default App
