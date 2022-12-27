import { lazy } from 'solid-js'
import { Route, Routes } from '@solidjs/router'

// Components
const Navbar = lazy(() => import('./components/Navbar.jsx'))

// Data
import AboutData from './data/About'
import ProductData from './data/Product'
import CommerceData from './data/Commerce'

// Pages
const Home = lazy(() => import('./pages/index.jsx'))
const About = lazy(() => import('./pages/about.jsx'))
const Product = lazy(() => import('./pages/product.jsx'))
const Commerce = lazy(() => import('./pages/commerce.jsx'))

const App = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#9a1ab1] via-[#004966] to-[#01B18D]">
      <Navbar />
      <Routes>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} data={AboutData} />
        <Route path="/commerce" component={Commerce} data={CommerceData} />
        <Route path="/commerce/:name" component={Commerce} data={CommerceData} />
        <Route path="/product/:name" component={Product} data={ProductData} />
      </Routes>
    </div>
  )
}

export default App
