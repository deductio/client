import { FetcherWithComponents } from 'react-router-dom'
import { Objective, Topic } from '../../../../utilities/model'
import { MoveRight } from 'lucide-react'

interface Props {
  fetcher: FetcherWithComponents<any>
  handleReconcile: () => void
  topic: Topic
  result: Objective
}

/**
 * A search result when searching for an objective to require as a prerequisite for the currently selected
 * topic.
 *
 * @param props - The topic, objective, and fetcher from the previous request, whose data will be used when
 * reconciling.
 */
const ObjectiveRequirementResult = (props: Props): JSX.Element => {
  return (
    <div className='m-4 grid' style={{ gridTemplateColumns: '64px 1fr 1fr 1fr 1fr 1fr' }}>
      <props.fetcher.Form action='/satisfiers' method='POST'>
        <div className='h-6 w-6 self-center m-4 bg-indigo-600 rounded-full text-white'>

          <button className='font-extrabold' onClick={props.handleReconcile}><MoveRight /></button>
          <input type='hidden' name='id' value={props.result.id} />
          <input type='hidden' name='title' value={props.result.title} />
          <input type='hidden' name='description' value={props.result.description} />
          <input type='hidden' name='knowledge_graph_id' value={props.topic.knowledge_graph_id} />
        </div>
      </props.fetcher.Form>
      <h2 className='font-semibold text-2xl col-span-5'>{props.result.title}</h2>
      <div />
      <p className='indent-4 m-2 col-span-5'>{props.result.description}</p>

    </div>
  )
}

export default ObjectiveRequirementResult
