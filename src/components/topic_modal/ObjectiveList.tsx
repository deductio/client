import { useState } from "react"
import { ObjectivePrerequisite } from "../../api/model"
import ObjectiveListItem from "./ObjectiveListItem"

type ObjectiveListProps = {
    objectives: ObjectivePrerequisite[]
}

const ObjectiveList = (props: ObjectiveListProps) => {

    const [mode, setMode] = useState<"searching" | "creating" | null>(null)

    return <>
        <div className="text-center m-4"><h1 className="font-bold text-2xl">Required Objectives</h1></div>

        { props.objectives.length === 0 ? <p>None added yet</p> : 
            props.objectives.map(objective => <ObjectiveListItem objective={objective}/>
        )
        }

        <div className="flex justify-center">
            <button className="rounded-lg text-sm border border-indigo-600 text-indigo-600 bg-white p-1" onClick={() => setMode("searching")}>Add Requirement</button>
        </div>

        
    </>
}

export default ObjectiveList