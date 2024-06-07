import { Objective, Topic } from "../../api/model"
import { EditContext } from "../../api/graphOps"
import { useContext } from "react"

type Props = {
    reconcile: () => void,
    topic: Topic,
    result: Objective
}

const ObjectiveSatisfierResult = (props: Props) => {

    const { dispatch } = useContext(EditContext)

    return <div className="m-4 grid" style={{ "gridTemplateColumns": "64px 1fr 1fr 1fr 1fr 1fr" }}>
        <div className="h-6 w-6 self-center m-4 bg-indigo-600 rounded-full text-white">
            <button className="material-symbols-rounded font-extrabold" onClick={() => {
                dispatch({
                    type: "addSatisfier",
                    satisfier: {
                        topic: props.topic,
                        objective: props.result
                    }
                })

                props.reconcile()
            }}>arrow_forward</button>
        </div>

        <h2 className="font-semibold text-2xl col-span-5">{props.result.title}</h2>
        <div></div>
        <p className="indent-4 m-2 col-span-5">{props.result.description}</p>

    </div>
}

export default ObjectiveSatisfierResult