import { useContext } from "react"
import { ObjectivePrerequisite } from "../../api/model"
import { EditContext } from "../../api/graphOps"

const ObjectiveListItem = ({ objective }: { objective: ObjectivePrerequisite }) => {

    const { dispatch, topic } = useContext(EditContext)

    return <div className="flex flex-row m-2">
        <h3 className="w-1/2 text-center font-semibold">{objective.objective.title}</h3>
        <span className="material-symbols-rounded">arrow_forward</span>
        <p className="w-1/3 text-center">satisfied by <i>{objective.suggested_graph.name}</i></p>
        <button className="bg-white text-indigo-600 rounded-full border w-6 h-6 border-indigo-600 p-1 text-lg" 
            style={{ lineHeight: 0 }}
            onClick={() => dispatch({
                type: "removePrerequisite",
                node: topic!.id,
                objective: objective.objective.id

            })}>-</button>
    </div>
}

export default ObjectiveListItem