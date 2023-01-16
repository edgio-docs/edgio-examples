import React from 'react'
import './src/styles/global.css'
import './edgio/registerServiceWorker'
import { PageComponent } from './src/wrapPageComponent'

export const wrapPageElement = ({ element }) => {
  return <PageComponent>{element}</PageComponent>
}
