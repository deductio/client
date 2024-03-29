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
import { graphReducer } from "../api/graphOps";
import { produce } from "immer";
import EditTopicModal from "../components/topic_modal/EditTopicModal";

interface GraphProps {
    graph: KnowledgeGraph
}

const SUBJECT_COLORS: { [key: string]: string } = {
    "Calculus": "red",
    "Set theory and logic": "blue",
    "Group theory": "green",
    "Analysis": "yellow"
}

// The nodes and edges selected within the graph are internal state.
const Graph = (props: GraphProps) => {

    const curriedGraphReducer = produce(graphReducer)
    const [{ graph, selectedTopics }, dispatch] = useReducer(curriedGraphReducer, { graph: props.graph, selectedTopics: [] })

    const [openedTopic, setOpenTopic]: [Topic | null, any] = useState(null)

    const openTopic = (id: number) => {
        const topic = graph.topics.find(topic => topic.id === id)
        if (topic) {
            setOpenTopic(topic)
        }
    }

    console.log(selectedTopics)

    const closeTopic = () => setOpenTopic(null)

    return <div>
        <SearchBar topics={graph.topics} />
        <SigmaContainer style={{ height: "90vh", width: "100vw" }}>
            <DagGraph graph={graph}/>
            <GraphEditEvents selectTopic={topic => dispatch({
                type: "selectNode",
                node: topic
            })} modifyTopic={openTopic}/>
        </SigmaContainer>
        <GraphEditor graph={graph} dispatch={dispatch} />
        
        { openedTopic !== null ? <EditTopicModal topic={openedTopic} closeModal={closeTopic}/> : "" }
    </div>
}

export default Graph;
