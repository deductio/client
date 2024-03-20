import { useState, useReducer } from "react"
import { SigmaContainer } from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";
import { KnowledgeGraph, Topic } from "../api/model"
import DagGraph from "../components/graph/DagGraph";
import GraphViewEvents from "../components/graph/GraphViewEvents";
import GraphEditEvents from "../components/graph/GraphEditEvents";
import GraphEditor from "../components/graph/GraphEditor";
import TopicModal from "../components/topic_modal/TopicModal";
import SearchBar from "../components/search/SearchBar";

interface GraphProps {
    graph: KnowledgeGraph
}

const SUBJECT_COLORS: { [key: string]: string } = {
    "Calculus": "red",
    "Set theory and logic": "blue",
    "Group theory": "green",
    "Analysis": "yellow"
}

type GraphReduceAction = {
    type: "deleteNode",
    node: number 
} | {
    type: "addNode"
} | {
    type: "addEdge",
    source: number,
    destination: number
} | {
    type: "removeEdge",
    source: number,
    destination: number
}

// unfinished!
const graphReducer = (state: KnowledgeGraph, action: GraphReduceAction): KnowledgeGraph => {
    if (action.type === "deleteNode") {
        state.topics = state.topics
            .filter(topic => topic.id != action.node)
            .map(topic => {
                topic.requirements = topic.requirements.filter(requirement => requirement !== action.node)
                return topic
            })

        return state
    } else if (action.type === "removeEdge") {
        const index = state.topics.findIndex(topic => topic.id == action.destination)

        return state
    } else {
        return state
    }
}

// The nodes and edges selected within the graph are internal state.
const Graph = (props: GraphProps) => {
    const [graph, dispatch] = useReducer(graphReducer, props.graph)

    const [topics, setTopics] = useState(new Set())
    const [openedTopic, setOpenTopic]: [Topic | null, any] = useState(null)

    const selectTopic = (id: number) => {
        if (topics.has(id)) 
            topics.delete(id)
        else 
            topics.add(id)
        
        setTopics(topics)
    }

    const openTopic = (id: number) => {
        const topic = graph.topics.find(topic => topic.id === id)
        if (topic) {
            setOpenTopic(topic)
        }
    }

    const modifyTopic = (id: number) => {

    }

    const closeTopic = () => setOpenTopic(null)

    return <div>
        <SearchBar topics={graph.topics} />
        <SigmaContainer style={{ height: "90vh", width: "100vw" }}>
            <DagGraph graph={graph}/>
            <GraphEditEvents selectTopic={selectTopic} modifyTopic={modifyTopic}/>
        </SigmaContainer>
        <GraphEditor graph={graph} setGraph={setGraph} />
        
        { openedTopic !== null ? <TopicModal topic={openedTopic} closeModal={closeTopic}></TopicModal> : "" }
    </div>
}

export default Graph;