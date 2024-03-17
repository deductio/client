import { useState, useEffect } from "react"
import { DirectedGraph } from "graphology"
import { SigmaContainer, useLoadGraph, useRegisterEvents, useSigma } from "@react-sigma/core";
import dagre from "dagre"
import "@react-sigma/core/lib/react-sigma.min.css";
import { KnowledgeGraph, Topic } from "../../api/model"

interface GraphProps {
    graph: KnowledgeGraph,
    clickTopic: (top: number) => void,
    getGraph: (graph: DirectedGraph) => void
}

const SUBJECT_COLORS: { [key: string]: string } = {
    "Calculus": "red",
    "Set theory and logic": "blue",
    "Group theory": "green",
    "Analysis": "yellow"
}

const Graph = (props: GraphProps) => {

    const GraphEvents = () => {
        const registerEvents = useRegisterEvents()
        const sigma = useSigma()

        useEffect(() => {
            const graph = sigma.getGraph()

            registerEvents({
                clickNode: (event) => {
                    props.clickTopic(graph.getNodeAttribute(event.node, "id"))
                }
            })
        }, [registerEvents, useSigma])

        return null
    }

    const NoverlapGraph = () => {
        //const { positions, assign } = useLayoutNoverlap({ maxIterations: 1000 });
        const loadGraph = useLoadGraph();

        useEffect(() => {
            const graph: DirectedGraph = new DirectedGraph() // visualization
            const dag = new dagre.graphlib.Graph() // layout control

            dag.setGraph({})
            dag.setDefaultEdgeLabel(() => {return {}})

            for (const topic of props.graph.topics) {
                graph.addNode(topic.knowledge_graph_index, { 
                    x: 0, 
                    y: 0,
                    label: topic.title,
                    size: 10,
                    color: SUBJECT_COLORS[topic.subject]
                })

                dag.setNode(String(topic.knowledge_graph_index), {
                    label: topic.title,
                    width: 100,
                    height: 100
                })
        
                graph.setNodeAttribute(topic.knowledge_graph_index, "id", topic.id)
        
                for (const requirement of topic.requirements) {
                    graph.addEdge(requirement, topic.knowledge_graph_index,  { 
                        label: "REL_1",
                        type: "arrow",
                        size: 3
                    });

                    dag.setEdge(String(requirement), String(topic.knowledge_graph_index))
                }
            }

            dagre.layout(dag, { nodesep: 300, edgesep: 400, ranksep: 400 })

            graph.forEachNode((node, attributes) => {
                const act_node = dag.node(node)
                graph.setNodeAttribute(node, "x", act_node.x / 1)
                graph.setNodeAttribute(node, "y", act_node.y / 1)
                console.log(act_node, node, attributes)
            })

            
            loadGraph(graph)
            //assign()
        }, [loadGraph])

        return null
    }

    return <SigmaContainer style={{ height: "100vh", width: "100vw" }}>
        <NoverlapGraph/>
        <GraphEvents/>
    </SigmaContainer>
}

export default Graph;