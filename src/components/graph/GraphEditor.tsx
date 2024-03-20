import { KnowledgeGraph, Topic } from "../../api/model"

interface GraphEditorProps {
    graph: KnowledgeGraph,
    setGraph: (graph: KnowledgeGraph) => void
}

const addTopic = (graph: KnowledgeGraph, setGraph: (_: KnowledgeGraph) => void) => {
    const newGraph = { ...graph }

    newGraph.topics.push({ 
        knowledge_graph_id: graph.id, 
        knowledge_graph_index: Math.random(), 
        title: "", 
        requirements: [],
        id: Math.random(),
        subject: "",
        content: ""
     })
     
     setGraph(newGraph)

}

const GraphEditor = (props: GraphEditorProps) => {
    return (<div>
        <button onClick={() => addTopic(props.graph, props.setGraph)}>add top</button>
    </div>)
}

export default GraphEditor