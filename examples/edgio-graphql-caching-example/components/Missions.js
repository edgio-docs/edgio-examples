import Button from './Button'
import Loader from './Loader'
import Mission from './Mission'
import { useQuery } from '@apollo/client'
import { missionsQuery } from '@/lib/query'
import { useEffect, useRef, useState } from 'react'

const Missions = () => {
  const startTime = useRef(Date.now())
  const [timing, setTiming] = useState(0)
  const sortAscending = false
  const {
    loading,
    error,
    data = { launchesPast: [] },
    refetch,
  } = useQuery(missionsQuery(3, `${sortAscending ? '' : '-'}launch_date_local`), {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  })

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

  const missions = [...data.launchesPast]
    .sort((a, b) => {
      let diff = new Date(b.launch_date_local) - new Date(a.launch_date_local)
      if (sortAscending) diff *= -1
      return diff
    })
    .map((item) => <Mission {...item} key={item.mission_name} />)

  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center justify-between">
        <h1 className="flex flex-row items-center">
          <span className="text-2xl">Missions</span> <small>&nbsp;(Cached on Edge)</small>
        </h1>
        <div className="px-2 py-1 border shadow rounded">
          <b className="text-gray-500">{timing || '--'}ms</b>
        </div>
      </div>
      <div className="mt-5 mb-5">
        This section is cached on Edgio. Refetches will be <span className="font-bold">faster</span>.
      </div>
      <div className="mb-5 mt-5 flex flex-row flex-wrap gap-2 items-center justify-between">
        <Button text={loading ? 'Refetching...' : 'Refetch'} callback={refetch} disabled={loading} bgColor={loading ? '#e95495' : '#35274B'} />
      </div>
      {loading ? (
        <div className="w-full p-5 flex flex-col items-center justify-center">
          <Loader textColor="#e95495" />
        </div>
      ) : (
        missions
      )}
    </div>
  )
}

export default Missions
