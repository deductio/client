import { Dispatch, SetStateAction, useCallback, useEffect, useReducer, useRef, useState } from "react"
import { SigmaContainer } from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";
import { KnowledgeGraph, Topic } from "../api/model"
import DagGraph from "../components/graph/DagGraph";
import TopicModal from "../components/topic_modal/TopicModal";
import GraphViewEvents from "../components/graph/GraphViewEvents";
import SearchBar from "../components/search/SearchBar";
import { useFetcher, useLoaderData } from "react-router-dom";
import ViewReducer from "../components/graph/ViewReducer";
import useLocalStorageState from "use-local-storage-state";
import Cookies from 'js-cookie'
import { GraphReduceAction, graphReducer } from "../api/graphOps";
import { produce } from "immer";

const isAvailable = (node: number, progress: number[], requirements: [number, number][]): boolean => 
    requirements.filter(req => req[1] === node).every(req => progress.includes(req[0]))

const ViewGraph = () => {

    const _graph = useLoaderData() as KnowledgeGraph
    const [localProgressTemp, setLocalProgress] = useLocalStorageState(`progress-${_graph?.id}`)
    const fetcher = useFetcher()

    useEffect(() => {
        if (localProgressTemp === undefined) {
            setLocalProgress([])
        }
    }, [])
    
    // We need to keep track of what we most recently did in order to properly synchronize the state. 
    const [queuedUpdate, queueUpdate]: [GraphReduceAction | null, Dispatch<SetStateAction<GraphReduceAction | null>>] = useState<GraphReduceAction | null>(null)

    const localProgress = localProgressTemp as number[]

    const [openedTopic, setOpenTopic] = useState<Topic | null>(null)

    const curriedGraphReducer = produce(graphReducer)
    const [{ graph }, dispatch] = useReducer(curriedGraphReducer, { graph: _graph, selectedTopics: [] })

    // We need to have the graph progress kept in a ref in order to access the latest version at any given time
    const progress = useRef<number[]>([])
    progress.current = graph?.progress || localProgress

    useEffect(() => {
        if (queuedUpdate !== null) {
            dispatch(queuedUpdate)

            if (Cookies.get("name")) {
                if (queuedUpdate.type === "addProgress") {
                    fetcher.submit({ topic: queuedUpdate.node }, { method: "PUT", action: `/graph/progress/${graph.id}`, encType: "application/json" })
                } else if (queuedUpdate.type === "removeProgress") {
                    fetcher.submit({ topic: queuedUpdate.node }, { method: "DELETE", action: `/graph/progress/${graph.id}/`, encType: "application/json" })
                }
            } else {
                if (queuedUpdate.type === "addProgress") {
                    localProgress.push(queuedUpdate.node)
                    setLocalProgress(localProgress)
                } else if (queuedUpdate.type === "removeProgress") {
                    setLocalProgress(localProgress.filter(progress => progress !== queuedUpdate.node))
                }
            }
        } 
    }, [queuedUpdate])

    const openTopic = useCallback((id: number) => {

        if (!isAvailable(id, progress.current, graph.requirements)) {
            alert("woah there cowboy! gotta do some work beforehand!")
            return
        } else {
            const topic = graph.topics.find(topic => topic.id === id)
            if (topic) {
                setOpenTopic(topic)
            }
        }
    }, [graph.progress])

    if (graph === null || graph === undefined) {
        return <></>
    }

    const closeTopic = () => setOpenTopic(null)

    return <>
        {/*<SearchBar topics={graph.topics} />*/}
        <SigmaContainer style={{ height: "90vh", width: "100vw" }}>
            <DagGraph graph={graph}/>
            <GraphViewEvents clickTopic={openTopic}/>
            <ViewReducer progress={graph.progress || (!Cookies.get("name") ? localProgress : [])}/>
        </SigmaContainer>
        
        <TopicModal topic={openedTopic} closeModal={closeTopic} dispatch={queueUpdate} completed={progress.current?.includes(openedTopic?.id || -1)}/>
    </>
}

export default ViewGraph;
