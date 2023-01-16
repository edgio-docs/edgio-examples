import React from 'react'
import './src/styles/global.css'
import { PageComponent } from './src/wrapPageComponent'

export const wrapPageElement = ({ element }) => {
  return <PageComponent>{element}</PageComponent>
}
