import { useState, useEffect } from "react"
import { DirectedGraph } from "graphology"
import { SigmaContainer, useLoadGraph, useRegisterEvents, useSigma } from "@react-sigma/core";
import { useLayoutNoverlap } from "@react-sigma/layout-noverlap";
import "@react-sigma/core/lib/react-sigma.min.css";
import { KnowledgeGraph, Topic } from "../../api/model"

interface GraphProps {
    graph: KnowledgeGraph,
    clickTopic: (top: number) => void
}

const SUBJECT_COLORS: { [key: string]: string } = {
    "Calculus": "red",
    "Elementary set theory": "blue"
}

const Graph = (props: GraphProps) => {

    const GraphEvents = () => {
        const registerEvents = useRegisterEvents()
        const sigma = useSigma()

        useEffect(() => {
            const graph = sigma.getGraph()
            console.log("how many times?")
            registerEvents({
                clickNode: (event) => {
                    props.clickTopic(graph.getNodeAttribute(event.node, "id"))
                }
            })
        }, [registerEvents, useSigma])

        return null
    }

    const NoverlapGraph = () => {
        const { positions, assign } = useLayoutNoverlap();
        const loadGraph = useLoadGraph();

        useEffect(() => {
            const graph: DirectedGraph = new DirectedGraph()

            for (const topic of props.graph.topics) {
                graph.addNode(topic.knowledge_graph_index, { 
                    x: topic.knowledge_graph_index, 
                    y: topic.requirements.length,
                    label: topic.title,
                    size: 10,
                    color: SUBJECT_COLORS[topic.subject]
                })
        
                graph.setNodeAttribute(topic.knowledge_graph_index, "id", topic.id)
        
                for (const requirement of topic.requirements) {
                    graph.addEdge(topic.knowledge_graph_index, requirement, { label: "REL_1" });
                }
            }

            loadGraph(graph)
            assign()
        }, [loadGraph, assign])

        return null
    }

    return <SigmaContainer style={{ height: "100vh", width: "100vw" }}>
        <NoverlapGraph/>
        <GraphEvents/>
    </SigmaContainer>
}

export default Graph;