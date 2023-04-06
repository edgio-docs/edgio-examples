const About = ({ showcases }) => {
  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col items-center px-5 md:px-0">
      <div className="mt-10 flex w-full max-w-2xl flex-col p-2.5">
        <span className="text-2xl font-semibold text-white">About</span>
        <span className="mt-5 text-lg text-[#FFFFFF75]">This demo of Edgio showcases the following:</span>
        <ul className="list-disc">
          {showcases.map((i) => (
            <li key={i} className="mt-3 text-[#FFFFFF75]">
              {i}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default About

export async function getStaticProps() {
  return {
    props: {
      showcases: [
        `Edgio's Compatibility with Next.js 13`,
        '(Free) Real Time User Monitoring service offered by Edgio',
        '(Free) Edgio Image Optimization Service',
        'Edge and Browser caching of SSR page(s)',
        'Prefetching & Deepfetching with Edgio Service Worker to speed up transitions',
        'Response transformation with Serverless Compute',
        'Header Manipulation',
        'Cache-Key normalization',
        'Proxying and Caching external API(s) for faster edge and browser responses',
        'Edgio Devtools: See what came from the edge, browser and serverless',
      ],
    },
  }
}
