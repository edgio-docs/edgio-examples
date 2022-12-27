import classNames from 'classnames'
import { Link, useLocation, useNavigate } from '@solidjs/router'

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

const Sidebar = ({ listingItems }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const filter = new URLSearchParams(location.search.substring(1)).get('filter')
  return (
    <div className="flex w-full flex-col">
      <h2 className={classNames('text-white', 'text-md')}>Relevance</h2>
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
      <Link
        href="/commerce"
        className={classNames(
          'text-md mt-7',
          { 'font-light text-[#FFFFFF75]': location.pathname !== `/commerce` },
          { 'font-medium text-[#FFFFFF]': location.pathname === `/commerce` }
        )}
      >
        Shop All
      </Link>
      {listingItems.map((item) => (
        <Link
          key={item.slug}
          href={`/commerce/${item.slug}`}
          className={classNames(
            'text-md mt-2',
            { 'font-light text-[#FFFFFF75]': location.pathname !== `/commerce/${item.slug}` },
            { 'font-medium text-[#FFFFFF]': location.pathname === `/commerce/${item.slug}` }
          )}
        >
          {item.name}
        </Link>
      ))}
    </div>
  )
}

export default Sidebar
