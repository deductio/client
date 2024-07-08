/** @module deductio/search_graph */

import { useActionData } from 'react-router'
import SmallForm from '../utilities/SmallForm'
import SearchResults from './components/SearchResults'
import { SearchResultGraph } from '../utilities/model'

/**
 * The main (page) component for searching for graphs according to a given query.
 */
const SearchGraph = (): JSX.Element => {
  const results = useActionData() as (SearchResultGraph[] | undefined)

  return (
    <div className='bg-indigo-100 h-screen flex flex-col items-center justify-center'>
      <SmallForm action='/search'>
        <h1 className='font-bold text-xl md:text-4xl'>Search for a graph</h1>

        <input type='text' placeholder='Graph name' name='search' className='border rounded-lg m-2 self-center w-80' />

        <div className='flex justify-center'>
          <button className='bg-indigo-600 rounded text-white p-4'>
            Search graphs <i className='bi bi-arrow-right' />
          </button>
        </div>

        <input type='hidden' value='BestMatch' name='order' />
      </SmallForm>

      {(results != null) ? <SearchResults results={results ?? []} /> : <></>}
    </div>
  )
}

export default SearchGraph
