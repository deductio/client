import { useState, useReducer } from "react"
import { SigmaContainer } from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";
import { KnowledgeGraph, Topic } from "../api/model"
import DagGraph from "../components/graph/DagGraph";
import TopicModal from "../components/topic_modal/TopicModal";
import GraphViewEvents from "../components/graph/GraphViewEvents";
import SearchBar from "../components/search/SearchBar";
import { graphReducer } from "../api/graphOps";
import { produce } from "immer";
import { useLoaderData } from "react-router-dom";

const SUBJECT_COLORS: { [key: string]: string } = {
    "Calculus": "red",
    "Set theory and logic": "blue",
    "Group theory": "green",
    "Analysis": "yellow"
}

// The nodes and edges selected within the graph are internal state.
const ViewGraph = () => {

    const dataGraph = useLoaderData() as KnowledgeGraph

    const curriedGraphReducer = produce(graphReducer)
    const [{ graph, selectedTopics }, dispatch] = useReducer(curriedGraphReducer, { graph: dataGraph, selectedTopics: [] })

    const [openedTopic, setOpenTopic]: [Topic | null, any] = useState(null)

    const openTopic = (id: number) => {
        const topic = graph.topics.find(topic => topic.id === id)
        if (topic) {
            setOpenTopic(topic)
        }
    }

    const closeTopic = () => setOpenTopic(null)

    return <div>
        <SearchBar topics={graph.topics} />
        <SigmaContainer style={{ height: "90vh", width: "100vw" }}>
            <DagGraph graph={graph}/>
            <GraphViewEvents clickTopic={openTopic}/>
        </SigmaContainer>
        
        { openedTopic !== null ? <TopicModal topic={openedTopic} closeModal={closeTopic}/> : "" }
    </div>
}

export default ViewGraph;
