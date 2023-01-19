import Link from 'next/link'
import { Prefetch } from '@edgio/react'
import { relativizeURL } from '@/lib/helper'
import { HeartIcon } from '@heroicons/react/outline'
import { createNextDataURL } from '@edgio/next/client'

const ProductPreview = ({ name, slug, images, prices }) => {
  return (
    <Link legacyBehavior passHref href={`/product/${slug}`}>
      {/*
        CreateNextDataURL generates the link to prefetch the data,
        e.g.: /_next/data/buildID/product/nextjs-enamel-mug?name=nextjs-enamel-mug
      */}
      <Prefetch
        url={createNextDataURL({
          href: `/product/${slug}`,
          routeParams: {
            name: slug,
          },
        })}
      >
        <a className="relative inline-block p-2">
          <div className="absolute bottom-2 left-2 right-2 z-10 flex full-w flex-col items-start bg-white/[.6]">
            <h7 className="pt-2 px-2 font-bold text-black text-base leading-4">{name}</h7>
            <h8 className="pb-2 px-2 text-xs text-gray-500  md:text-sm">{`${prices.price.value}${prices.price.currencyCode}`}</h8>
          </div>
          <HeartIcon className="absolute top-2 right-2 h-[30px] w-[30px] bg-white p-2" />
          <img className="h-full bg-white object-contain" width={1200} height={1200} src={relativizeURL(images[0].url)} />
        </a>
      </Prefetch>
    </Link>
  )
}

export default ProductPreview
