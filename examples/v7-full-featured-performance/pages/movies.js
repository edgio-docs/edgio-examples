import { useRouter } from 'next/router'
import { moviesSidebar as Sidebar } from '@/components/Sidebar'
import MoviePreview from '@/components/MoviePreview'
import { filterProducts, getOrigin } from '@/lib/helper'

const Search = ({ data }) => {
  const router = useRouter()

  return (
    <div className="flex-col items-center justify-start">
      <div className="flex w-full flex-row items-start px-5">
        <div className="flex min-w-[200px] flex-col pt-5">
          <Sidebar />
        </div>
        <div className="flex flex-col items-start pt-5">
          <h2 className="text-[#FFFFFF75]">Showing {data.length} Results</h2>
          <div className="sm:grid-cols-2 mt-5 border-0 grid grid-cols-1 pb-20 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {filterProducts(data, router.query.filter).map((i) => (
              <MoviePreview key={i.id} {...i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Search

export async function getServerSideProps({ req, query }) {
  const resp = await fetch(`${getOrigin(req)}/edgio-sampleapis/movies/${query.category ? `${query.category}` : 'animation'}`)
  if (!resp.ok) {
    return {
      notFound: true,
    }
  }
  let data = await resp.json()

  const moviesToExclude = [
    'tt0025316', 'tt0071315', 'tt0059646', 'tt0063522', 'tt0067328', 'tt0057091', 'tt0043265', 'tt0063350', 'tt0043456',
    'tt9019280', 'tt1032856',
    'tt0078748', 'tt0067328', 'tt0036775', 'tt0076759', 'tt0078788',
    'tt0457430', 'tt6674752', 'tt0084516', 'tt5260464', 'tt1611176',
    'tt7831362', 'tt0808376',
    'tt0044079', 'tt0071360', 'tt5916886', 'tt0061811', 'tt0090756',
    'tt0064116', 'tt0047136'
  ]

  data = data.filter(item => item.posterURL != 'N/A')
  data = data.filter(item => !moviesToExclude.includes(item.imdbId))


  return {
    props: { data },
  }
}
