import { Dispatch } from "react"
import { KnowledgeGraph, Topic } from "../../api/model"
import { GraphReduceAction } from "../../api/graphOps"

interface GraphEditorProps {
    graph: KnowledgeGraph,
    dispatch: Dispatch<GraphReduceAction>
}


const GraphEditor = (props: GraphEditorProps) => {
    return (<div>
        <button onClick={() => props.dispatch({ type: "addNode" })}>add top</button>
        <button onClick={() => props.dispatch({ type: "addEdge" })}>add edge</button>
    </div>)
}

export default GraphEditor