import SEO from '@/components/Seo'

const Home = () => {
  const meta = {
    title: 'Edgio Next.js + GraphQL Example',
    description: 'This open source project demonstrates Prefetching, and Image Optimization with Edgio using Next.js and GraphQL.',
    url: 'https://edgio-docs-edgio-next-example-default.edgio.link',
    image: 'https://edgio-docs-og-image-default.edgio.link/api?title=Edgio Next.js Example&width=1400&height=720'
  }
  return (
    <>
      <SEO {...meta} />
      <div className="flex flex-col justify-center items-center w-full min-h-[75vh]">
        <p className="text-center">
          This is an example Next.js app powered by Edgio. Click a category above to get started.
        </p>
      </div>
    </>
  )
}

export default Home
