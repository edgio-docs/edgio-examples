'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useMemo, useState, useEffect } from 'react'

const TokenAwareLink = ({ href, children, ...props }) => {
  const searchParams = useSearchParams()
  const [currentQuery, setCurrentQuery] = useState({})

  useEffect(() => {
    const params = {}
    searchParams.forEach((value, key) => {
      params[key] = value
    })
    setCurrentQuery(params)
  }, [searchParams])

  const newHref = useMemo(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(typeof href === 'string' ? href : href.pathname, window.location.origin)
      Object.keys(currentQuery).forEach(key => {
        url.searchParams.append(key, currentQuery[key])
      })
      return url.toString().replace(window.location.origin, '')
    }
    return href
  }, [href, currentQuery])

  return (
    <Link href={newHref} {...props}>
      {children}
    </Link>
  )
}

export default TokenAwareLink
