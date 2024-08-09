import Link from 'next/link'
import { Suspense } from 'react'
import TokenAwareLink from '@/components/TokenAwareLink'

async function getWeatherData() {
  const weatherResponse = await fetch('https://api.open-meteo.com/v1/forecast?latitude=39.746&longitude=-75.5466&current=temperature_2m&timezone=America%2FNew_York', {
    next: {
      revalidate: 0
    }
  })
  if (!weatherResponse.ok) {
    throw new Error('Unable to fetch weather data.')
  }
  return weatherResponse.json()
}

export default async function SecurePage__Dynamic() {
  const weatherData = await getWeatherData()

  return (
    <Suspense>
      <h1 className="text-xl font-bold">Secure Dynamic Page</h1>
      <p>If you're seeing this message, congratulations! Your token is working properly.</p>
      <p>The following data was fetched from <Link className="underline text-slate-400 hover:text-slate-800" href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">https://open-meteo.com/</Link>:</p>
      <pre className="mt-4">
        {JSON.stringify(weatherData, null, 2)}
      </pre>
      <p className="mt-4"><TokenAwareLink className="underline text-slate-400 hover:text-slate-800" href="/secure">Return to the Secure Pages landing page.</TokenAwareLink></p>
    </Suspense>
  )
}