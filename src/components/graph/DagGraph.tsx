import { useLoadGraph, useSigma } from "@react-sigma/core";
import dagre from "dagre";
import { DirectedGraph } from "graphology";
import { useEffect } from "react";
import { GraphMap } from "../../api/model";

interface DagGraphProps {
    graph: GraphMap,
    selected?: number[]
}

const DagGraph = (props: DagGraphProps) => {

    //const { positions, assign } = useLayoutNoverlap({ maxIterations: 1000 });
    const loadGraph = useLoadGraph();
    const sigma = useSigma()

    sigma.setSetting("labelFont", "IBM Plex Sans")
    
    useEffect(() => {
        const graph: DirectedGraph = new DirectedGraph() // visualization
        const dag = new dagre.graphlib.Graph() // layout control

        dag.setGraph({})
        dag.setDefaultEdgeLabel(() => {return {}})

        for (const topic of props.graph.topics) {
            graph.addNode(topic.id, { 
                x: 0, 
                y: 0,
                label: topic.title,
                size: 20,
                color: "#6366f1",
            })

            dag.setNode(String(topic.id), {
                label: topic.title,
                width: 100,
                height: 100
            })
    
            graph.setNodeAttribute(topic.id, "id", topic.id)
    
        }

        for (const requirement of props.graph.requirements) {
            graph.addEdge(requirement[0], requirement[1],  { 
                label: "REL_1",
                type: "arrow",
                size: 3
            });

            dag.setEdge(String(requirement[0]), String(requirement[1]))
        }

        if (props.selected !== undefined && props.selected.length === 2 
            && !props.graph.requirements.some(req => req[0] === props.selected![0] && req[1] === props.selected![1])) {
            graph.addEdge(props.selected[0], props.selected[1],  { 
                label: "REL_1",
                type: "arrow",
                size: 3,
                color: "#94a3b8"
            });
        }

        dagre.layout(dag, { nodesep: 300, edgesep: 400, ranksep: 400 })

        graph.forEachNode((node) => {
            const act_node = dag.node(node)
            graph.setNodeAttribute(node, "x", act_node.x / 1)
            graph.setNodeAttribute(node, "y", act_node.y / 1)
        })

        loadGraph(graph)

    }, [loadGraph, props.graph, props.selected])

    return null
}

export default DagGraph