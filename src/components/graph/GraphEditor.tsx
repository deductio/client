import { Dispatch } from "react"
import { KnowledgeGraph, Topic } from "../../api/model"
import { GraphReduceAction } from "../../api/graphOps"

interface GraphEditorProps {
    graph: KnowledgeGraph,
    dispatch: Dispatch<GraphReduceAction>
}

const GraphEditor = (props: GraphEditorProps) => {
    return (<div>
        <button className="bg-indigo-600 rounded text-white p-4" onClick={() => props.dispatch({ type: "addTopic" })}>add topic</button>
        <button className="bg-indigo-600 rounded text-white p-4" onClick={() => props.dispatch({ type: "addRequirement" })}>add edge</button>
        <button className="bg-indigo-600 rounded text-white p-4" onClick={() => props.dispatch({ type: "deleteTopic", node: 0 })}>delete topic</button>
    </div>)
}

export default GraphEditor