import { useQuery } from '@apollo/client'
import { ROCKETS } from '@/lib/query'
import { useRef, useState, useEffect } from 'react'
import Button from './Button'
import Rocket from './Rocket'
import Loader from './Loader'

const Rockets = () => {
  const startTime = useRef(Date.now())
  const [timing, setTiming] = useState(0)
  const { loading, error, data = { rockets: [] }, refetch } = useQuery(ROCKETS, { fetchPolicy: 'network-only', notifyOnNetworkStatusChange: true })

  useEffect(() => {
    if (loading) {
      startTime.current = Date.now()
    } else {
      if (!error) {
        setTiming(Date.now() - startTime.current)
      }
    }
  }, [loading, error])

  if (error) return <p>Error :(</p>

  const rockets = [...data.rockets].slice(0, 3).map((item) => <Rocket {...item} key={item.name} />)

  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center justify-between">
        <h1 className="flex flex-row items-center">
          <span className="text-2xl">Rockets</span>
          <small>&nbsp;(Uncached)</small>
        </h1>
        <div className="px-2 py-1 border shadow rounded">
          <b className="text-gray-500">{timing || '--'}ms</b>
        </div>
      </div>
      <div className="mt-5 mb-5">
        This section is NOT cached. Refetches will be <span className="font-bold">slower</span>.
      </div>
      <div className="mb-5 mt-5 flex flex-row items-center justify-between">
        <Button text={loading ? 'Refetching...' : 'Refetch'} callback={refetch} disabled={loading} bgColor={loading ? '#e95495' : '#35274B'} />
      </div>
      {loading ? (
        <div className="w-full p-5 flex flex-col items-center justify-center">
          <Loader textColor="#35274B" />
        </div>
      ) : (
        rockets
      )}
    </div>
  )
}

export default Rockets
