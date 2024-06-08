import { useState, useReducer, useEffect, useRef, Dispatch, SetStateAction } from "react"
import { SigmaContainer, ControlsContainer } from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";
import { KnowledgeGraph, Topic } from "../../utilities/model"
import DagGraph from "../lib/DagGraph";
import GraphEditEvents from "./lib/GraphEditEvents";
import { EditContext, GraphReduceAction, editGraphReducer } from "./lib/EditState";
import { produce } from "immer";
import EditTopicModal from "./components/modal/EditTopicModal";
import { useFetcher, useLoaderData } from "react-router-dom";
import EditReducer from "./lib/EditReducer";

type EditGraphState = { graph: KnowledgeGraph, selectedTopics: number[] }

/**
 * The main (page) component for editing user-owned graphs.
 */
const EditGraph = () => {

    const dataGraph = useLoaderData() as KnowledgeGraph
    const fetcher = useFetcher()

    const curriedGraphReducer = produce(editGraphReducer)
    const [{ graph, selectedTopics }, dispatch] = useReducer(curriedGraphReducer, { graph: dataGraph, selectedTopics: [] })

    const [openedTopic, setOpenTopic]: [Topic | null, Dispatch<SetStateAction<Topic | null>>] = useState(null as (Topic | null))

    // Stale closure avoidance
    const graphTopicRef = useRef<EditGraphState>()
    graphTopicRef.current = { graph, selectedTopics }
        
    const openedTopicRef = useRef<Topic | null>()
    openedTopicRef.current = openedTopic

    const openTopic = (id: number) => {
        const topic = graphTopicRef.current?.graph.topics.find(topic => topic.id === id)

        if (topic) {
            setOpenTopic(topic)
        }
    }

    /**
     * A wrapper around the functional `dispatch` reducer function
     * that performs API requests after updating the local state.
     * 
     * @param event - The state action to be performed.
     * 
     * @see module:deductio/edit_graph/routes
     */
    const injectedDispatch = (event: GraphReduceAction) => {

        const graph = graphTopicRef.current?.graph!
        const selectedTopics = graphTopicRef.current?.selectedTopics!

        if (event.type === "deleteTopic") {
            event.node = selectedTopics[0]
        }

        dispatch(event)

        switch (event.type) {
            case "deleteTopic":
                fetcher.submit({ id: event.node }, {
                    method: "DELETE",
                    action: `/graph/edit/${graph.id}/topic`,
                    encType: "application/json"
                })
                break;
            
            case "deleteRequirement":
                const requirement = graph.requirements.find(req => req[1] === selectedTopics[1] && req[0] === selectedTopics[0])
            
                if (requirement !== undefined) {
                    fetcher.submit({ src: requirement[0], dest: requirement[1] }, {
                        method: "DELETE",
                        action: `/graph/edit/${graph.id}/requirement`,
                        encType: "application/json"
                    })
                }
                break;
    
            case "addRequirement":
                fetcher.submit({
                    knowledge_graph_id: graph.id,
                    source: selectedTopics[0],
                    destination: selectedTopics[1]
                }, {
                    method: "PUT",
                    action: `/graph/edit/${graph.id}/requirement`,
                    encType: "application/json"
                })
                break;
    
            case "modifyTopic":
                fetcher.submit(event.topic, { method: "PUT", action: `/graph/edit/${graph.id}/topic` })
                break;
    
            case "addPrerequisite":
                fetcher.submit(event.prereq, { method: "PUT", action: `/graph/edit/${graph.id}/prereq`, encType: "application/json" })
                break;
    
            case "addSatisfier":
                fetcher.submit(event.satisfier, { method: "PUT", action: `/graph/edit/${graph.id}/satis`, encType: "application/json" })
                break;
    
            case "removePrerequisite":
                fetcher.submit(event, { method: "DELETE", action: `/graph/edit/${graph.id}/prereq`, encType: "application/json" })
                break;
    
            case "removeSatisfier":
                fetcher.submit(event, { method: "DELETE", action: `/graph/edit/${graph.id}/satis`, encType: "application/json" })
        }
    }

    useEffect(() => {
        const topic = graphTopicRef.current!.graph.topics.find(topic => topic.id === 0)
        if (topic) {
            setOpenTopic(topic)
        }
    }, [graph.topics])

    /**
     * Closes a given topic.
     * 
     * If the topic has an ID of zero, it was created from the "Add Topic" dialog and
     * not yet committed to the server, so it will be deleted from the local state.
     */
    const closeTopic = () => {
        if (openedTopicRef.current === null) {
            return
        } else if (openedTopicRef.current?.id === 0) {
            dispatch({ type: "deleteTopic", node: 0 })
        }

        setOpenTopic(null)
    }

    if (dataGraph === undefined) {
        return <></>
    }

    return <div onKeyDown={(event) => {
            if (event.key === "Escape") {
                dispatch({ type: "clearSelected" })
            }
        }}>
        <SigmaContainer style={{ height: "90vh", width: "100vw" }}>
            <ControlsContainer>
                <div className={`flex flex-col ${openedTopic != null ? "hidden" : ""}`}>
                    <div>
                        <button 
                            className={`${selectedTopics.length == 0 ? "bg-indigo-600" : "bg-gray-400"} rounded text-white p-2 m-1`}
                            disabled={selectedTopics.length != 0}
                            onClick={() => { injectedDispatch({ type: "addTopic" })}}>Add Topic</button>
                        <button 
                            className={`${selectedTopics.length == 1 ? "bg-indigo-600" : "bg-gray-400"} rounded text-white p-2 m-1`}
                            disabled={selectedTopics.length != 1}
                            onClick={() => openTopic(graphTopicRef.current!.selectedTopics[0])}>Edit Topic</button>
                        <button 
                            className={`${selectedTopics.length == 1 ? "bg-indigo-600" : "bg-gray-400"} rounded text-white p-2 m-1`}
                            disabled={selectedTopics.length != 1}
                            onClick={() => injectedDispatch({ type: "deleteTopic", node: 0 })}>Delete Topic</button>
                    </div>
                    <div className="flex">
                        <button 
                            className={`${selectedTopics.length == 2 ? "bg-indigo-600" : "bg-gray-400"} rounded text-white p-2 m-1 w-full`}
                            disabled={selectedTopics.length != 2}
                            onClick={() => injectedDispatch({ type: "deleteRequirement" })}>Delete Edge</button>
                        <button 
                            className={`${selectedTopics.length == 2 ? "bg-indigo-600" : "bg-gray-400"} rounded text-white p-2 m-1 w-full`}
                            disabled={selectedTopics.length != 2}
                            onClick={() => injectedDispatch({ type: "addRequirement" })}>Add Edge</button>
                    </div>
                </div>
            </ControlsContainer>
            <DagGraph graph={dataGraph} selected={selectedTopics}/>
            <GraphEditEvents selectTopic={topic => dispatch({
                type: "toggleSelectTopic",
                node: topic
            })} modifyTopic={openTopic}/>
            <EditReducer selected={selectedTopics}/>
\
        </SigmaContainer>
        
        <EditContext.Provider value={{dispatch: injectedDispatch, topic: openedTopic}}>
            <EditTopicModal 
                objectives={graph.objectives.filter(prereq => prereq.topic === openedTopic?.id)}
                satisfier={graph.satisfiers.find(satisfier => satisfier.topic === openedTopic?.id)?.objective}
                topic={openedTopic} 
                closeModal={closeTopic} 
                />
        </EditContext.Provider>
    </div>
}

export default EditGraph;
