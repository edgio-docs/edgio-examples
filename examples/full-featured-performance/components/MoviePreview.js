import Link from 'next/link'
import { Prefetch } from '@edgio/react'
import { relativizeURL } from '@/lib/helper'
import { createNextDataURL } from '@edgio/next/client'

const MoviePreview = ({ posterURL, imdbId }) => {
  return (
    <Link legacyBehavior passHref href={`/movie/${imdbId}`}>
      {/*
        CreateNextDataURL generates the link to prefetch the data,
        e.g.: /_next/data/buildID/product/nextjs-enamel-mug?name=nextjs-enamel-mug
      */}
      <Prefetch
        url={createNextDataURL({
          href: `/movie/${imdbId}`,
          routeParams: {
            name: imdbId
          },
        })}
      >
        <a className="relative mt-2 p-1">
          <img className="h-full object-cover" width={300} height={444} src={relativizeURL(posterURL)} />
        </a>
      </Prefetch>
    </Link>
  )
}

export default MoviePreview
