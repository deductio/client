import { Dispatch, SetStateAction, useCallback, useEffect, useReducer, useRef, useState } from "react"
import { SigmaContainer } from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";
import { GraphMap, Topic } from "../api/model"
import DagGraph from "../components/graph/DagGraph";
import TopicModal from "../components/topic_modal/TopicModal";
import GraphViewEvents from "../components/graph/GraphViewEvents";
import { useFetcher, useLoaderData } from "react-router-dom";
import ViewReducer from "../components/graph/ViewReducer";
import useLocalStorageState from "use-local-storage-state";
import Cookies from 'js-cookie'
import { GraphReduceAction, ViewGraphReduceAction, viewGraphReducer } from "../api/graphOps";
import { produce } from "immer";
import LockedTopicModal from "../components/topic_modal/LockedTopicModal";

const isAvailable = (node: number, progress: number[], requirements: [number, number][]): boolean => 
    requirements.filter(req => req[1] === node).every(req => progress.includes(req[0]))

const ViewGraph = () => {

    const _graph = useLoaderData() as GraphMap

    // if we are given a learning map rather than a graph, this hook is irrelevant
    const [localProgressTemp, setLocalProgress] = useLocalStorageState(`progress-${_graph?.id}`)
    const fetcher = useFetcher()

    useEffect(() => {
        if (localProgressTemp === undefined) {
            setLocalProgress([])
        }
    }, [])
    
    // We need to keep track of what we most recently did in order to properly synchronize the state. 
    const [queuedUpdate, queueUpdate]: [ViewGraphReduceAction | null, Dispatch<SetStateAction<ViewGraphReduceAction | null>>] = useState<ViewGraphReduceAction | null>(null)

    const localProgress = localProgressTemp as number[]

    const [openedTopic, setOpenTopic] = useState<Topic | null>(null)
    const [lockedModalTopic, setLockedModalTopic] = useState<Topic | null>(null)

    const curriedGraphReducer = produce(viewGraphReducer)
    const [graph, dispatch] = useReducer(curriedGraphReducer, _graph)

    // We need to have the graph progress kept in a ref in order to access the latest version at any given time
    const progress = useRef<number[]>([])
    progress.current = graph?.progress || localProgress

    useEffect(() => {
        if (queuedUpdate !== null) {
            dispatch(queuedUpdate)

            if (Cookies.get("name")) {
                if (queuedUpdate.type === "addProgress") {
                    fetcher.submit({ topic: queuedUpdate.node }, { method: "PUT", action: `/graph/progress`, encType: "application/json" })
                } else if (queuedUpdate.type === "removeProgress") {
                    fetcher.submit({ topic: queuedUpdate.node }, { method: "DELETE", action: `/graph/progress`, encType: "application/json" })
                }
            } else {
                if (queuedUpdate.type === "addProgress") {
                    localProgress.push(queuedUpdate.node.id)
                    setLocalProgress(localProgress)
                } else if (queuedUpdate.type === "removeProgress") {
                    setLocalProgress(localProgress.filter(progress => progress !== queuedUpdate.node.id))
                }
            }
        } 
    }, [queuedUpdate])

    const openTopic = useCallback((id: number) => {

        const topic = graph.topics.find(topic => topic.id === id)

        if (!isAvailable(id, progress.current, graph.requirements)) {
            setLockedModalTopic(topic!)
        } else {
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
        <LockedTopicModal topic={lockedModalTopic}/>
    </>
}

export default ViewGraph;
