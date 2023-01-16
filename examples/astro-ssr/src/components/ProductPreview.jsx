import React from 'react'
import { Prefetch } from '@edgio/react'
import { relativizeURL } from '@/helper'
import { HeartIcon } from '@heroicons/react/outline/esm/index.js'

const ProductPreview = ({ name, slug, images, prices }) => {
  return (
    <a href={`/product/${slug}`} className="relative mt-2 border border-white p-1">
      <div className="absolute top-0 left-0 z-10 flex flex-col items-start">
        <h3 className="border border-gray-200 bg-white py-1 px-2 text-xs font-medium text-black md:py-2 md:px-4 md:text-xl">{name}</h3>
        <h4 className="border border-gray-200 bg-white py-1 px-2 text-xs text-black md:py-2 md:px-4 md:text-lg">{`${prices.price.value}${prices.price.currencyCode}`}</h4>
      </div>
      <Prefetch url={`/product/${slug}`}>
        <HeartIcon className="absolute top-0 right-0 h-[30px] w-[30px] bg-white p-2" />
      </Prefetch>
      <img className="h-full bg-white object-contain" loading="lazy" width={1200} height={1200} src={relativizeURL(images[0].url)} />
    </a>
  )
}

export default ProductPreview
