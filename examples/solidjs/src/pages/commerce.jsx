import classNames from 'classnames'
import Sidebar from '../components/Sidebar'
import { Link, useRouteData } from '@solidjs/router'
import ProductPreview from '../components/ProductPreview'

const Commerce = ({}) => {
  const { products, leftSideBarItems } = useRouteData()
  return (
    <div className="flex-col items-center justify-start">
      <div className="flex w-full flex-row items-start px-5">
        {leftSideBarItems.loading && (
          <div className="flex min-w-[200px] flex-col pt-5">
            {new Array(9).fill(0).map((_, index) => (
              <Link
                key={index}
                href={`/commerce`}
                className={classNames('mt-2', 'text-md', 'px-10', 'animate-pulse bg-white/50', 'py-1.5', 'w-[10px]')}
              ></Link>
            ))}
          </div>
        )}
        {!leftSideBarItems.loading && (
          <div className="flex min-w-[200px] flex-col pt-5">
            <Sidebar listingItems={leftSideBarItems()} />
          </div>
        )}
        {products.loading && (
          <div className="flex flex-col items-start pt-5">
            <h2 className="text-[#FFFFFF75]">Showing ... Results</h2>
            <div className="sm:grid-cols-2 mt-5 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
              {new Array(12)
                .fill(0)
                .map((_, _ind) => ({
                  name: '',
                  path: `/${_ind}`,
                  images: [{ url: 'https://via.placeholder.com/250x250' }],
                  prices: { price: { value: '', currencyCode: '' } },
                }))
                .map((i) => (
                  <ProductPreview key={i.path} loading={true} {...i} />
                ))}
            </div>
          </div>
        )}
        {!products.loading && (
          <div className="flex flex-col items-start pt-5">
            <h2 className="text-[#FFFFFF75]">Showing {products().length} Results</h2>
            <div className="sm:grid-cols-2 mt-5 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
              {products().map((i) => (
                <ProductPreview key={i.path} {...i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Commerce
