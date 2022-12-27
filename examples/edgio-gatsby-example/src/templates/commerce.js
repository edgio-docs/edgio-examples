import React from 'react'
import Sidebar from '../components/Sidebar'
import { filterProducts } from '../lib/helper'
import ProductPreview from '../components/ProductPreview'

const Commerce = ({ pageContext, location }) => {
  const data = Object.keys(pageContext).map((i) => pageContext[i])
  return (
    <div className="flex-col items-center justify-start">
      <div className="flex w-full flex-row items-start px-5">
        <div className="flex min-w-[200px] flex-col pt-5">
          <Sidebar {...location} />
        </div>
        <div className="flex flex-col items-start pt-5">
          <h2 className="text-[#FFFFFF75]">Showing {data.length} Results</h2>
          <div className="sm:grid-cols-2 mt-5 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {filterProducts(data, new URLSearchParams(location.search.substring(1)).get('filter')).map((i) => (
              <ProductPreview key={i.path} {...i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Commerce
