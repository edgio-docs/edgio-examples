import express from 'express'
import render from './entry.ssr'
import { qwikCity } from '@builder.io/qwik-city/middleware/node'

// Create the Qwik City express middleware
const { router, notFound } = qwikCity(render)

const app = express()

// Use Qwik City's page and endpoint request handler
app.use(router)

// Use Qwik City's 404 handler
app.use(notFound)

// Start the express server
app.listen(process.env.PORT || 3000, () => {
  /* eslint-disable */
  console.log(`http://localhost:${process.env.PORT || 3000}/`)
})
