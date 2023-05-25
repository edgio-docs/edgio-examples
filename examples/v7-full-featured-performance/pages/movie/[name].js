import { relativizeURL, getOrigin } from '@/lib/helper'

const Movie = ({ data }) => {
  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex max-w-6xl flex-col lg:flex-row pb-20">

        <div className="relative flex w-full flex-col items-start lg:w-2/5 mb-10 lg:pl-10">
          <div className="flex w-full flex-col px-5 md:px-0 items-center">
            <img src={relativizeURL(data.short.image)} className="rounded-lg h-auto w-full max-w-[543px]" />
          </div>
        </div>
        <div className="flex w-full flex-col items-start lg:px-10 px-5 lg:w-3/5">
          <div className='flex flex-row w-full'>
            <div className='basis-5/6'>
              <h1 className="text-3xl font-bold  text-white ">{data.short.name}</h1>
              <h5 className="mt-1 text-l text-gray-400">({data.top.releaseYear.year})</h5>
            </div>

            <div className='basis-1/6 text-lg align-right'>
              <div className='font-light text-[#FFFFFF75] mt-2'>
                <div className='inline-block align-middle'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" className="text-yellow-400" id="iconContext-star" viewBox="0 0 24 24" fill="currentColor" role="presentation">
                    <path d="M12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72 3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18-1.1 4.72c-.2.86.73 1.54 1.49 1.08l4.15-2.5z"></path>
                  </svg>
                </div>
                <div className='inline-block align-middle'>
                  <div >
                    <span className='text-xl text-white font-500'>{data.short.aggregateRating.ratingValue}</span>
                    <span>/10</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <span className="mt-2 font-light text-[#FFFFFF75]">{data.short.description}</span>
          <div className="mt-5 h-[1px] w-full bg-[#FFFFFF30]"></div>
          <span className="mt-5 text-lg font-medium text-white">Genre</span>
          <span className="mt-2 font-light text-[#FFFFFF75]">
            <ul>
              {data.short.genre.map((value, key) => (
                <span >
                  {value + ', '}
                </span>
              ))}
            </ul>
          </span>
          <div className="mt-5 h-[1px] w-full bg-[#FFFFFF30]"></div>
          <span className="mt-5 text-lg font-medium text-white">Actors</span>
          <span className="mt-2 font-light text-[#FFFFFF75]">
            <ul>
              {data.short.actor.map((value, key) => (
                <span >
                  {value.name + ', '}
                </span>
              ))}
            </ul>
          </span>
          <div className="mt-5 h-[1px] w-full bg-[#FFFFFF30]"></div>
          <button className="mt-5 w-full bg-black px-2 py-4 uppercase text-white">Play Movie</button>
          <div className="mt-2 flex w-full flex-row justify-between">

          </div>

        </div>
      </div>
      <style jsx>
        {`
          .product-thumbnails::-webkit-scrollbar {
            display: none;
          }
          .product-thumbnails {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>
    </div>
  )
}

export default Movie

export async function getServerSideProps({ req, params }) {
  const slug = params.name.trim()
  const resp = await fetch(`${getOrigin(req)}/edgio-imdb/?tt=${slug}`)
  
  if (!resp.ok) {
    return {
      notFound: true,
    }
  }

  const data = await resp.json()

  return {
    props: { data },
  }
}
