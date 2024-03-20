import { useLoadGraph } from "@react-sigma/core";
import dagre from "dagre";
import { DirectedGraph } from "graphology";
import { useEffect } from "react";
import { KnowledgeGraph } from "../../api/model";

interface DagGraphProps {
    graph: KnowledgeGraph
}

const DagGraph = (props: DagGraphProps) => {
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
                color: "blue"
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

    }, [loadGraph, props.graph])

    return null
}

export default DagGraph