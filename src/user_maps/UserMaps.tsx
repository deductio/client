import { useLoaderData } from 'react-router'
import { Link } from 'react-router-dom'

interface PreviewMap {
  title: string
  id: number
}

const UserMaps = (): JSX.Element => {
  const maps: PreviewMap[] = (useLoaderData() as PreviewMap[]) ?? []

  return (
    <div className='bg-indigo-100 h-screen flex flex-col items-center justify-center'>
      <div className='rounded-lg bg-white shadow-inner shadow-2xl'>
        {maps.map(map => (
          <div key={map.id}>
            <h2 className='font-semibold text-2xl'><Link to={`/map/${map.id}`}>{map.title}</Link></h2>
          </div>)
        )}
      </div>
    </div>
  )
}

export default UserMaps
