import { useContext } from "react"
import { Objective } from "../../api/model"
import { EditTopicModalState } from "./EditTopicModal"
import { EditContext } from "../../api/graphOps"

type ObjectiveSatisfierListProps = {
    satisfier?: Objective,
    transition: (arg0: EditTopicModalState) => void
}

const ObjectiveSatisfierList = (props: ObjectiveSatisfierListProps) => {

    const { dispatch, topic } = useContext(EditContext)

    return <div>
        <div className="text-center m-4"><h1 className="font-bold text-2xl">Satisfied Objective</h1></div>

        { props.satisfier 
        ? <div className="flex flex-row m-2">
                <p>{props.satisfier.title}</p> 
                <button className="bg-white text-indigo-600 rounded-full border w-6 h-6 border-indigo-600 p-1 text-lg" 
                    style={{ lineHeight: 0 }}
                    onClick={() => dispatch({
                        type: "removeSatisfier",
                        node: topic!.id
                    })}>-</button>
          </div>
        : 
            <div className="flex justify-center">
                <button className="rounded-lg text-sm border border-indigo-600 text-indigo-600 bg-white p-1" onClick={() => props.transition("satis")}>
                    Add Satisfier
                </button> <p className="mx-2 text-sm">or</p> 
                <button className="rounded-lg text-sm border border-indigo-900 text-indigo-600 bg-white p-1" onClick={() => props.transition("creation")}>
                    Create an objective
                </button> 
            </div> 
        }
    </div>
}

export default ObjectiveSatisfierList