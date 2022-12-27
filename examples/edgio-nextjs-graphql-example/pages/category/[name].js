import SEO from '@/components/Seo'
import ListItem from '@/components/ListItem'
import { useQuery } from '@apollo/client'
import { PRODUCTS_BY_CATEGORY } from 'graphql/queries'

export default function ProductListingPage({ slug }) {
  const meta = {
    title: slug,
    description: slug,
    url: `https://edgio-docs-edgio-next-example-default.edgio.link/category/${slug}`,
    image: `https://edgio-docs-og-image-default.edgio.link/api?title=${slug}&width=1400&height=720`,
  }

  const { data, loading, error } = useQuery(PRODUCTS_BY_CATEGORY, { variables: { name: slug } })

  if (loading) return null

  if (error || !data.productsOfCategory.length) {
    return <div className="flex flex-col items-center">No products found.</div>
  }

  return (
    <>
      <SEO {...meta} />
      <div className="flex flex-col items-center">
        <div className="mt-10 grid xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data.productsOfCategory.map((product) => {
            const prefetchProps = {}
            if (process.browser) {
              // prefetch URL needs to include the `name` param otherwise it will be a browser miss
              prefetchProps.url = `/_next/data/${__NEXT_DATA__.buildId}${product.href}.json?name=${
                product.href.split('/').reverse()[0]
              }`
            }
            return <ListItem key={product['_id']} product={product} prefetchProps={prefetchProps} />
          })}
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps({ params }) {
  return {
    props: { slug: params.name },
  }
}
