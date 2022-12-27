import React from 'react'

const Home = () => {
  return (
    <>
      <div className="flex min-h-[calc(100vh-56px)] flex-col items-center justify-center px-5 md:px-0">
        <div className="flex w-full flex-row flex-wrap justify-center md:w-[700px]">
          <div className="flex w-[330px] flex-col items-start justify-start rounded p-5 md:w-1/2">
            <h1 className="text-xl font-bold text-white">Gatsby with Edgio</h1>
            <h3 className="mt-2 text-lg text-[#FFFFFF75]">Edgio supports all of the most powerful features of Gatsby!</h3>
            <a className="mt-auto text-[#01B18D] hover:underline" href="https://docs.edg.io/guides/gatsby" target="_blank">
              Learn More &rarr;
            </a>
          </div>
          <div className="flex w-[330px] flex-col items-start justify-start rounded p-5 md:w-1/2">
            <h1 className="text-xl font-bold text-white">React with Edgio</h1>
            <h3 className="mt-2 text-lg text-[#FFFFFF75]">Edgio supports all of the most powerful features of React!</h3>
            <a className="mt-auto text-[#01B18D] hover:underline" href="https://docs.edg.io/guides/react" target="_blank">
              Learn More &rarr;
            </a>
          </div>
          <div className="flex w-[330px] flex-col items-start justify-start rounded p-5 md:w-1/2">
            <h1 className="text-xl font-bold text-white">Caching with Edgio</h1>
            <h3 className="mt-2 mb-5 text-lg text-[#FFFFFF75]">
              While most CDNs only cache content on your asset URLs, Edgio caches content on your page URLs using EdgeJS, allowing you to control
              caching within your application code.
            </h3>
            <a className="mt-auto text-[#01B18D] hover:underline" href="https://docs.edg.io/guides/caching" target="_blank">
              Learn More &rarr;
            </a>
          </div>
          <div className="flex w-[330px] flex-col items-start justify-start rounded p-5 md:w-1/2">
            <h1 className="text-xl font-bold text-white">Edgio Prefetching</h1>
            <h3 className="mt-2 text-lg text-[#FFFFFF75]">
            Edgio allows you to speed up the user’s browsing experience by prefetching pages and API calls that they are likely to need.
            </h3>
            <a className="mt-auto text-[#01B18D] hover:underline" href="https://docs.edg.io/guides/prefetching" target="_blank">
              Learn More &rarr;
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
