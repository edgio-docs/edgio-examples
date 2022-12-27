import SEO from '@/components/Seo'
import Rating from '@/components/Rating'
import { useQuery } from '@apollo/client'
import { PRODUCT } from 'graphql/queries'

export default function ProductPage({ slug }) {
  const { data, loading, error } = useQuery(PRODUCT, { variables: { productId: slug } })

  if (loading) return null

  if (error || !data.product) {
    return <div className="flex flex-col items-center">Product not found.</div>
  }

  const { product } = data
  const meta = {
    title: product.name,
    description: product.description,
    url: `https://edgio-docs-edgio-next-example-default.edgio.link/product/${slug}`,
    image: `https://edgio-docs-og-image-default.edgio.link/api?title=${product.name}&width=1400&height=720`,
  }

  return (
    <>
      <SEO {...meta} />
      <div className="container center flex flex-col items-center md:flex-row pb-20">
        <div className="container p-5 flex flex-col items-center">
          <img src={product.picture} />
        </div>
        <div className="container p-5 flex flex-col items-center md:items-start text-center md:text-left">
          <h2 className="font-bold py-2 m2">{product.name}</h2>
          <div className="py-2 m2">{product.description}</div>
          <div className="py-2 m2">${product.price}</div>
          <div className="py-2 m2">
            <Rating value={Number(product.rating)} />
          </div>
          <div className="py-2 m2">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Add To Cart
            </button>
          </div>
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
