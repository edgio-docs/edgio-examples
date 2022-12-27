import classNames from 'classnames'
import React, { useEffect, useState } from 'react'

const relevanceItems = [
  {
    name: 'Trending',
    filter: 'trending',
  },
  {
    name: 'Price: Low to High',
    filter: 'price-low-to-high',
  },
  {
    name: 'Price: High to Low',
    filter: 'price-high-to-low',
  },
]

const Sidebar = () => {
  const [filter, setFilter] = useState(undefined)
  const [listingItems, setListingItems] = useState([])
  const [pathWithoutQuery, setPathWithoutQuery] = useState(undefined)
  useEffect(() => {
    setPathWithoutQuery(window.location.pathname)
    setFilter(new URLSearchParams(window.location.search).get('filter'))
    fetch('/l0-api/categories/all')
      .then((res) => res.json())
      .then((res) => {
        setListingItems(res)
      })
  }, [])
  return (
    <div className="flex w-full flex-col">
      <h2 className="text-md font-light text-[#FFFFFF75]">Relevance</h2>
      {relevanceItems.map((item) => (
        <a
          key={item.name}
          className={classNames(
            'text-md mt-2 cursor-pointer',
            { 'font-light text-[#FFFFFF75]': filter !== item.filter },
            { 'font-medium text-[#FFFFFF]': filter === item.filter }
          )}
          onClick={(e) => {
            e.preventDefault()
            if (typeof window !== undefined) {
              const url = new URL(window.location)
              url.searchParams.set('filter', item.filter)
              window.location.href = url
            }
          }}
        >
          {item.name}
        </a>
      ))}
      <a
        href={`/commerce`}
        className={classNames(
          'text-md mt-7',
          { 'font-light text-[#FFFFFF75]': pathWithoutQuery !== `/commerce` },
          { 'font-medium text-[#FFFFFF]': pathWithoutQuery === `/commerce` }
        )}
      >
        Shop All
      </a>
      {listingItems.map((item) => (
        <a
          href={`/commerce/${item.slug}`}
          className={classNames(
            'text-md mt-2',
            { 'font-light text-[#FFFFFF75]': pathWithoutQuery !== `/commerce/${item.slug}` },
            { 'font-medium text-[#FFFFFF]': pathWithoutQuery === `/commerce/${item.slug}` }
          )}
        >
          {item.name}
        </a>
      ))}
    </div>
  )
}

export default Sidebar
