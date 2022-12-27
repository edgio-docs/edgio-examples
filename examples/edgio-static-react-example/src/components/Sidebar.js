import classNames from 'classnames'
import { Prefetch } from '@edgio/react'
import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const relevance = [
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

const Sidebar = ({ pathname = window.location.pathname, search = window.location.search }) => {
  let navigate = useNavigate()
  const filter = new URLSearchParams(search.substring(1)).get('filter')
  const [listingItems, setListingItems] = useState([])
  useEffect(() => {
    fetch('/l0-api/categories/all')
      .then((res) => res.json())
      .then((res) => {
        setListingItems(res)
      })
  }, [])
  return (
    <div className="flex w-full flex-col">
      <h2 className={classNames('text-[#FFFFFF75]', 'text-md')}>Relevance</h2>
      {relevance.map((item) => (
        <a
          key={item.name}
          onClick={(e) => {
            e.preventDefault()
            if (typeof window !== undefined) {
              navigate(`${window.location.pathname}?filter=${item.filter}`)
            }
          }}
          className={classNames(
            'cursor-pointer text-md mt-2',
            { 'font-light text-[#FFFFFF75]': filter !== item.filter },
            { 'font-medium text-[#FFFFFF]': filter === item.filter }
          )}
        >
          {item.name}
        </a>
      ))}
      <Prefetch href={`/l0-api/products/all`}>
        <Link
          to={`/commerce`}
          className={classNames(
            'text-md mt-7',
            { 'font-light text-[#FFFFFF75]': pathname !== `/commerce` },
            { 'font-medium text-[#FFFFFF]': pathname === `/commerce` }
          )}
        >
          Shop All
        </Link>
      </Prefetch>
      {listingItems.map((item) => (
        <Prefetch key={item.slug} url={`/l0-api/categories/${item.slug}`}>
          <Link
            to={`/commerce/${item.slug}`}
            className={classNames(
              'text-md mt-2',
              { 'font-light text-[#FFFFFF75]': pathname !== `/commerce/${item.slug}` },
              { 'font-medium text-[#FFFFFF]': pathname === `/commerce/${item.slug}` }
            )}
          >
            {item.name}
          </Link>
        </Prefetch>
      ))}
    </div>
  )
}

export default Sidebar
