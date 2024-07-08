import { MoveRight } from 'lucide-react'
import { Objective, Topic } from '../../../../utilities/model'
import { EditContext } from '../../lib/EditState'
import { useContext } from 'react'

interface Props {
  handleReconcile: () => void
  topic: Topic
  result: Objective
}

/**
 * Presents a search result from a search for a given objective, and
 * allows for the user to select the objective to add it as a satisfier
 * for the given topic.
 *
 * @param props - The topic currently being edited, as well as the objective represented
 * by the search result, along with a function that ends the objective addition process.
 */
const ObjectiveSatisfierResult = (props: Props): JSX.Element => {
  const { dispatch } = useContext(EditContext)

  return (
    <div className='m-4 grid' style={{ gridTemplateColumns: '64px 1fr 1fr 1fr 1fr 1fr' }}>
      <div className='h-6 w-6 self-center m-4 bg-indigo-600 rounded-full text-white'>
        <button
          className='font-extrabold' onClick={() => {
            dispatch({
              type: 'addSatisfier',
              satisfier: {
                topic: props.topic,
                objective: props.result
              }
            })

            props.handleReconcile()
          }}
        ><MoveRight />
        </button>
      </div>

      <h2 className='font-semibold text-2xl col-span-5'>{props.result.title}</h2>
      <div />
      <p className='indent-4 m-2 col-span-5'>{props.result.description}</p>

    </div>
  )
}

export default ObjectiveSatisfierResult
