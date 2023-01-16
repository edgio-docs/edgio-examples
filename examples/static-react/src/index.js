import './index.css'
import App from './App'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './components/Home'
import About from './components/About'
import Product from './components/Product'
import Commerce from './components/Commerce'

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="commerce" element={<Commerce />} />
        <Route path="commerce/:name" element={<Commerce />} />
        <Route path="product/:name" element={<Product />} />
      </Route>
    </Routes>
  </BrowserRouter>
)
