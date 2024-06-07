import { ObjectivePrerequisite } from "../../api/model"
import ObjectiveListItem from "./ObjectiveListItem"
import { EditTopicModalState } from "./EditTopicModal"

type ObjectiveRequirementListProps = {
    prereqs: ObjectivePrerequisite[],
    transition: (arg0: EditTopicModalState) => void
}

const ObjectiveRequirementList = (props: ObjectiveRequirementListProps) => {

    return <div>
        <div className="text-center m-4"><h1 className="font-bold text-2xl">Required Objectives</h1></div>

        { props.prereqs.length === 0 ? <p>None added yet</p> : 
            props.prereqs.map(objective => <ObjectiveListItem objective={objective}/>)
        }

        <div className="flex justify-center">
            <button className="rounded-lg text-sm border border-indigo-600 text-indigo-600 bg-white p-1" onClick={() => props.transition("prereq")}>Add Requirement</button>
        </div>
    </div>
}

export default ObjectiveRequirementList