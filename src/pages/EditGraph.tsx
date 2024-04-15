import { useState, useReducer } from "react"
import { SigmaContainer } from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";
import { KnowledgeGraph, Topic } from "../api/model"
import DagGraph from "../components/graph/DagGraph";
import GraphEditEvents from "../components/graph/GraphEditEvents";
import GraphEditor from "../components/graph/GraphEditor";
import SearchBar from "../components/search/SearchBar";
import { GraphReduceAction, graphReducer } from "../api/graphOps";
import { produce } from "immer";
import EditTopicModal from "../components/topic_modal/EditTopicModal";
import { useFetcher, useLoaderData } from "react-router-dom";

const SUBJECT_COLORS: { [key: string]: string } = {
    "Calculus": "red",
    "Set theory and logic": "blue",
    "Group theory": "green",
    "Analysis": "yellow"
}

// The nodes and edges selected within the graph are internal state.
const EditGraph = () => {

    const dataGraph = useLoaderData() as KnowledgeGraph
    const fetcher = useFetcher()

    const curriedGraphReducer = produce(graphReducer)
    const [{ graph, selectedTopics }, dispatch] = useReducer(curriedGraphReducer, { graph: dataGraph, selectedTopics: [] })

    const [openedTopic, setOpenTopic]: [Topic | null, any] = useState(null)

    const openTopic = (id: number) => {
        const topic = dataGraph.topics.find(topic => topic.id === id)
        if (topic) {
            setOpenTopic(topic)
        }
    }

    const injectedDispatch = (event: GraphReduceAction) => {

        if (event.type === "deleteTopic") {
            event.node = selectedTopics[0]
        } else if (event.type === "premodifyTopic") {
            const formTopic = fetcher.data

            console.log("bruh, come on")
             
            if (formTopic) {

                event = {
                    type: "modifyTopic",
                    topic: formTopic
                }
            }

            console.log(formTopic, fetcher, "?", event)

        }

        dispatch(event)

        if (event.type === "addRequirement") {
            fetcher.submit({
                knowledge_graph_id: graph.id,
                source: selectedTopics[0],
                destination: selectedTopics[1]
            }, {
                method: "POST",
                action: `graph/edit/${graph.id}/add_requirement`,
                encType: "application/json"
            })
        } else if (event.type === "deleteTopic") {
            fetcher.submit({ id: event.node }, {
                method: "POST",
                action: `graph/edit/${graph.id}/delete_topic`,
                encType: "application/json"
            })
        } else if (event.type === "deleteRequirement") {
            const requirement = graph.requirements.find(req => req.destination === event.destination && req.source === event.source)
            
            if (requirement !== undefined) {
                fetcher.submit({ id: requirement.id }, {
                    method: "POST",
                    action: `graph/edit/${graph.id}/delete_requirement`,
                    encType: "application/json"
                })
            }
        } else if (event.type === "addTopic") {
            fetcher.submit({
                knowledge_graph_id: graph.id,
                title: "<new node>",
                content: "",
                subject: ""
            }, {
                method: "POST",
                action: `graph/edit/${graph.id}/add_topic`,
            })
        }
    }

    const closeTopic = () => setOpenTopic(null)

    return <div>
        <SearchBar topics={graph.topics} />
        <SigmaContainer style={{ height: "50vh", width: "100vw" }}>
            <DagGraph graph={dataGraph}/>
            <GraphEditEvents selectTopic={topic => dispatch({
                type: "selectTopic",
                node: topic
            })} modifyTopic={openTopic}/>
        </SigmaContainer>
        <GraphEditor graph={dataGraph} dispatch={injectedDispatch} />
        
        { openedTopic !== null ? <EditTopicModal topic={openedTopic} closeModal={closeTopic} fetcher={fetcher} dispatch={injectedDispatch}/> : "" }
    </div>
}

export default EditGraph;
