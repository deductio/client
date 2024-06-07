import { FetcherWithComponents } from "react-router-dom"
import { Objective, Topic } from "../../api/model"

type Props = {
    fetcher: FetcherWithComponents<any>,
    reconcile: () => void,
    topic: Topic,
    result: Objective
}

const ObjectiveRequirementResult = (props: Props) => {
    return <div className="m-4 grid" style={{ "gridTemplateColumns": "64px 1fr 1fr 1fr 1fr 1fr" }}>
        <props.fetcher.Form action="/satisfiers" method="POST">
            <div className="h-6 w-6 self-center m-4 bg-indigo-600 rounded-full text-white">
                <button className="material-symbols-rounded font-extrabold" onClick={props.reconcile}>arrow_forward</button>
                <input type="hidden" name="id" value={props.result.id}/>
                <input type="hidden" name="title" value={props.result.title}></input>
                <input type="hidden" name="description" value={props.result.description}></input>
                <input type="hidden" name="knowledge_graph_id" value={props.topic.knowledge_graph_id}></input>
            </div>
        </props.fetcher.Form>
        <h2 className="font-semibold text-2xl col-span-5">{props.result.title}</h2>
        <div></div>
        <p className="indent-4 m-2 col-span-5">{props.result.description}</p>

    </div>
}

export default ObjectiveRequirementResult