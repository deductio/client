import { dfsFromNode } from "graphology-traversal/dfs"
import reverse from "graphology-operators/reverse"
import { DirectedGraph } from "graphology"
import { Topic } from "../../api/model"

function getCoursePlan(graph: DirectedGraph, start: string): Topic[] {
    dfsFromNode(graph, start, (node, attr, depth) => {
        console.log("are we mf async rn?")
    })

    console.log("bliss gink")

    return []
}

export default getCoursePlan