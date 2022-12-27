import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { Link, useFetcher, useNavigate } from '@remix-run/react'

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

const Sidebar = ({ filter, pathname }) => {
  const fetcher = useFetcher()
  const navigate = useNavigate()
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
              const url = new URL(window.location.href)
              url.searchParams.set('filter', item.filter)
              navigate(url)
            }
          }}
        >
          {item.name}
        </a>
      ))}
      <Link
        to="/commerce"
        className={classNames(
          'text-md mt-7',
          { 'font-light text-[#FFFFFF75]': pathname !== `/commerce` },
          { 'font-medium text-[#FFFFFF]': pathname === `/commerce` }
        )}
      >
        Shop All
      </Link>
      {listingItems.map((item) => (
        <Link
          key={item.slug}
          to={`/commerce/${item.slug}`}
          className={classNames(
            'text-md mt-2',
            { 'font-light text-[#FFFFFF75]': pathname !== `/commerce/${item.slug}` },
            { 'font-medium text-[#FFFFFF]': pathname === `/commerce/${item.slug}` }
          )}
        >
          {item.name}
        </Link>
      ))}
    </div>
  )
}

export default Sidebar
