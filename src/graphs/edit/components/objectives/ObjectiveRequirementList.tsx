import { ObjectivePrerequisite } from '../../../../utilities/model'
import ObjectiveListItem from './ObjectiveListItem'
import { EditTopicModalState } from '../modal/EditTopicModal'

interface ObjectiveRequirementListProps {
  prereqs: ObjectivePrerequisite[]
  transition: (arg0: EditTopicModalState) => void
}

/**
 * Lists the objectives that are required by the current topic in order to proceed.
 *
 * @param props - The required objectives, as well as a function to add more.
 */
const ObjectiveRequirementList = (props: ObjectiveRequirementListProps): JSX.Element => {
  return (
    <div>
      <div className='text-center m-4'><h1 className='font-bold text-2xl'>Required Objectives</h1></div>

      {props.prereqs.length === 0
        ? <p>None added yet</p>
        : props.prereqs.map((objective, i) => <ObjectiveListItem objective={objective} key={i} />)}

      <div className='flex justify-center'>
        <button className='rounded-lg text-sm border border-indigo-600 text-indigo-600 bg-white p-1' onClick={() => props.transition('prereq')}>Add Requirement</button>
      </div>
    </div>
  )
}

export default ObjectiveRequirementList
