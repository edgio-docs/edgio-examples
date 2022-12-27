import Link from 'next/link'
import NextImage from 'next/image'
import { useRouter } from 'next/router'
// import { Prefetch } from '@edgio/react'
import { useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { CATEGORIES } from '../graphql/queries'

export default function Header() {
  const { data, loading, error } = useQuery(CATEGORIES)
  const [activeTab, setActiveTab] = useState()
  const router = useRouter()

  useEffect(() => {
    router.events.on('routeChangeComplete', (url) => {
      if (data && data.categories) {
        setActiveTab(data.categories.findIndex(({ href }) => href === url))
      }
    })
  }, [data])

  if (loading || error) {
    return null
  }

  return (
    <>
      <header className="bg-white pt-2 flex flex-col items-center">
        <Link href="/">
          <a>
            <NextImage
              width={200}
              height={55.59}
              src="/edgio-icon.svg"
              alt="Edgio Logo"
              title="Edgio Logo"
            />
            <div className="text-center text-gray-700">Next.js + GraphQL Example</div>
          </a>
        </Link>
        {
          <div className="flex flex-col items-center w-full border-b-[1px] border-[#eaeaea]">
            <div className={`py-4 w-2/3 md:flex flex flex-row justify-between`}>
              {data.categories.map(({ categoryName, href }, i) => {
                const prefetchProps = {}
                if (process.browser) {
                  // prefetch URL needs to include the `name` param otherwise it will be a browser miss
                  prefetchProps.url = `/_next/data/${__NEXT_DATA__.buildId}${href}.json?name=${
                    href.split('/').reverse()[0]
                  }`
                }

                return (
                  <div
                    key={categoryName}
                    className={activeTab === i ? 'border-b-[3px] border-[#ff0000]' : null}
                  >
                    <Link href={href} passHref>
                      {/* <Prefetch {...prefetchProps}> */}
                      <a>{categoryName}</a>
                      {/* </Prefetch> */}
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        }
      </header>
    </>
  )
}
