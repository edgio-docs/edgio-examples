import { useEffect } from 'react'
import { json } from '@remix-run/node'
import Sidebar from '@/components/Sidebar'
import { filterProducts, getOrigin } from '@/helper'
import ProductPreview from '@/components/ProductPreview'
import { Outlet, useFetcher, useLoaderData, useParams } from '@remix-run/react'

export async function action({}) {
  return null
}

export const loader = async ({ request, params }) => {
  const host = request.headers.get('host')
  const origin = getOrigin({ headers: { host } })
  const url = new URL(request.url)
  const pathname = url.pathname
  const filter = url.searchParams.get('filter')
  const resp = await fetch(`${origin}/l0-api/${params.name ? `categories/${params.name}` : 'products/all'}`)
  let products = await resp.json()
  if (params.name) {
    products = products['items']
  }
  return json({ products, filter, pathname })
}

const Commerce = ({}) => {
  const { name } = useParams()
  const data = useLoaderData()
  const fetcher = useFetcher()
  useEffect(() => {
    if (name) {
      fetcher.submit(`/commerce/${name}`, { method: 'post' })
    } else {
      fetcher.submit(`/commerce`, { method: 'post' })
    }
  }, [name])
  return (
    <div className="flex-col items-center justify-start">
      <div className="flex w-full flex-row items-start px-5">
        <div className="flex min-w-[200px] flex-col pt-5">
          <Sidebar filter={data.filter} pathname={data.pathname} />
        </div>
        <div className="flex flex-col items-start pt-5">
          <h2 className="text-[#FFFFFF75]">Showing {data.products.length} Results</h2>
          <div className="sm:grid-cols-2 mt-5 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {filterProducts(data.products, data.filter).map((i) => (
              <ProductPreview key={i.path} {...i} />
            ))}
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  )
}

export default Commerce
