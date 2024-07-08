import { SearchResultGraph } from '../../utilities/model'
import SearchResult from '../../search_graph/components/SearchResult'
import UserProfileGraph from './UserProfileGraph'

interface UserProfileGraphsProps {
  graphs: SearchResultGraph[]
  self: boolean
}

const UserProfileGraphs = ({ graphs, self }: UserProfileGraphsProps): JSX.Element => {
  return (
    <div className='bg-white rounded-lg w-1/2 m-4 p-4'>
      {graphs.map((result: SearchResultGraph, i: number) => self ? <UserProfileGraph graph={result} key={i} /> : <SearchResult graph={result} key={i} />)}
    </div>
  )
}

export default UserProfileGraphs
