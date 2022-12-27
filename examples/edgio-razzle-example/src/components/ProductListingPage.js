import ListItem from './ListItem'
import { getCategory } from '../lib/cms'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export default function ProductListingPage({ match }) {
  let location = useLocation()
  const { slug } = match.params
  const [products, setProducts] = useState()
  useEffect(async () => {
    if (slug) {
      const { products } = await getCategory(slug)
      setProducts(products)
    }
  }, [location])
  return (
    <>
      <div className="flex flex-col items-center">
        <div className="mt-10 grid xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products &&
            products.map((product) => {
              return <ListItem key={product['_id']} product={product} />
            })}
        </div>
      </div>
    </>
  )
}
