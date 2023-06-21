import Link from 'next/link'
import { Prefetch } from '@edgio/react'
import { relativizeURL } from '@/lib/helper'
import { HeartIcon } from '@heroicons/react/outline'
import { createNextDataURL } from '@edgio/next/client'

const ProductPreview = ({ name, slug, images, prices }) => {
  return (
    <Prefetch
      url={createNextDataURL({
        href: `/product/${slug}`,
        routeParams: {
          name: slug,
        },
      })}
    >
      {/* 
      CreateNextDataURL generates the link to prefetch the data,
      e.g.: /_next/data/buildID/product/nextjs-enamel-mug?name=nextjs-enamel-mug 
    */}
      <Link className="relative mt-2 border border-white p-1" href={`/product/${slug}`}>
        <div className="absolute left-0 top-0 z-10 flex flex-col items-start">
          <h3 className="border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-black md:px-4 md:py-2 md:text-xl">{name}</h3>
          <h4 className="border border-gray-200 bg-white px-2 py-1 text-xs text-black md:px-4 md:py-2 md:text-lg">{`${prices.price.value}${prices.price.currencyCode}`}</h4>
        </div>
        <HeartIcon className="absolute right-0 top-0 h-[30px] w-[30px] bg-white p-2" />
        <img className="h-full bg-white object-contain" loading="lazy" width={1200} height={1200} src={relativizeURL(images[0].url)} />
      </Link>
    </Prefetch>
  )
}

export default ProductPreview
