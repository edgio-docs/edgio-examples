import { Link } from 'react-router-dom'
import { Prefetch } from '@edgio/react'
import { getCategories } from '../lib/cms'
import { useEffect, useState } from 'react'

export default function Header() {
  const [categories, setCategories] = useState()
  const [activeTab, setActiveTab] = useState()
  //   const router = useRouter()

  useEffect(() => {
    async function fetchCategories() {
      const { categories: results } = await getCategories()
      setCategories(results)
    }
    fetchCategories()
  }, [])

  //   useEffect(() => {
  //     router.events.on('routeChangeComplete', (url) => {
  //       if (categories) {
  //         setActiveTab(categories.findIndex(({ href }) => href === url))
  //       }
  //     })
  //   }, [categories])

  return (
    <>
      <header className="bg-white pt-2 flex flex-col items-center">
        <Link to="/">
          <img
            width={200}
            height={55.59}
            src="/edgio-icon.svg"
            alt="Edgio Logo"
            title="Edgio Logo"
          />
          <div className="text-center text-gray-700">React Example</div>
        </Link>
        <div className="flex flex-col items-center w-full border-b-[1px] border-[#eaeaea]">
          {categories && (
            <div className={`py-4 w-2/3 md:flex flex flex-row justify-between`}>
              {categories.map(({ categoryName, href }, i) => {
                return (
                  <div
                    key={categoryName}
                    className={activeTab === i ? 'border-b-[3px] border-[#ff0000]' : null}
                  >
                    <Link to={href}>
                      <Prefetch url={`/api/category/${categoryName.toLowerCase()}`}>
                        <a>{categoryName}</a>
                      </Prefetch>
                    </Link>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </header>
    </>
  )
}
