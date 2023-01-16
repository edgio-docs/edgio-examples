import EdgioRUM from './rum'
import Navbar from './components/Navbar'
import React, { useEffect } from 'react'
import { install } from '@edgio/prefetch/window'
import installDevtools from '@edgio/devtools/install'

export const PageComponent = ({ children }) => {
  useEffect(() => {
    installDevtools()
    // As all the pages are static assets, all come from S3, we can afford to have includeCacheMisses: true
    install({ includeCacheMisses: true })
    EdgioRUM('21cdc468-0104-44f0-95d3-8f523e8083d8')
  }, [])
  return (
    <>
      <Navbar />
      {children}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" />
    </>
  )
}
