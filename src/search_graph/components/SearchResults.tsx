import { SearchResultGraph } from '../../utilities/model'
import SearchResult from './SearchResult'

const SearchResults = (props: { results: SearchResultGraph[] }): JSX.Element => {
  return (
    <div className='bg-white rounded-lg w-1/2 m-4 p-4'>
      <h1 className='font-bold text-4xl'>Search results</h1>
      {props.results.map(result => <SearchResult graph={result} key={result.id} />)}
    </div>
  )
}

export default SearchResults
