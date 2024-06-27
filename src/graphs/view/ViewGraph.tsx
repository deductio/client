/** @module deductio/view_graph */

import { useCallback, useRef, useState } from "react"
import { SigmaContainer, ControlsContainer } from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";
import { Topic } from "../../utilities/model"
import DagGraph from "../lib/DagGraph";
import TopicModal from "./components/TopicModal";
import GraphViewEvents from "./lib/GraphViewEvents";
import ViewReducer from "./lib/ViewReducer";
import { useViewGraph } from "./lib/ViewState";
import LockedTopicModal from "./components/LockedTopicModal";
import PlanList from "./components/PlanList";

const isAvailable = (node: number, progress: number[], requirements: [number, number][]): boolean => 
    requirements.filter(req => req[1] === node).every(req => progress.includes(req[0]))

/**
 * The main (page) component for viewing read-only graphs (non-owned knowledge graphs and/or maps) and interacting with them
 * (such as accumulating progress). Essentially a wrapper around a {@link @react-sigma/core#SigmaContainer} that 
 * renders incoming graphs, and adds listeners to view topics and modify graph progress.
 */
const ViewGraph = () => {

    const [openedTopic, setOpenTopic] = useState<Topic | null>(null)
    const [lockedModalTopic, setLockedModalTopic] = useState<Topic | null>(null)

    const [graph, progress, queueUpdate] = useViewGraph()
    const progressRef = useRef(progress)
    progressRef.current = progress

    const openTopic = useCallback((id: number) => {
        const topic = graph.topics.find(topic => topic.id === id)

        if (!isAvailable(id, progressRef.current, graph.requirements)) {
            setLockedModalTopic(topic!)
        } else {
            if (topic) {
                setOpenTopic(topic)
            }
        }
    }, [graph, progress])

    if (graph === null || graph === undefined) {
        return <></>
    }

    return <>
        <SigmaContainer style={{ height: "90vh", width: "100vw" }}>
            <DagGraph graph={graph}/>
            <GraphViewEvents clickTopic={openTopic}/>
            <ViewReducer progress={progress}/>
            <ControlsContainer position="top-right" className="w-1/5">
                <PlanList topics={graph.topics}/>
            </ControlsContainer>
        </SigmaContainer>
        
        <TopicModal topic={openedTopic} closeModal={() => setOpenTopic(null)} dispatch={queueUpdate} completed={progressRef.current.includes(openedTopic?.id || -1)}/>
        <LockedTopicModal topic={lockedModalTopic} closeModal={() => setLockedModalTopic(null)}/>
    </>
}

export default ViewGraph;
