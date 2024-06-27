import { DirectedGraph } from "graphology"
import { dfsFromNode } from "graphology-traversal/dfs"

/**
 * Create a course plan from a learning map via a 
 * modified topological sort. The goal here is to
 * minimize context-switching whenever possible,
 * so paths that are designed like link-chains are
 * kept intact during planning.
 */
export default (_graph: DirectedGraph): number[] => {

    const graph = _graph.copy()

    const tempGraph = new DirectedGraph()
    let remaining = graph.order

    while (remaining > 0) {
        const startingPoint = graph.filterNodes(node => 
            graph.everyInNeighbor(node, neighbor => graph.getNodeAttribute(neighbor, "visited"))
            && !graph.getNodeAttribute(node, "visited")
        )[0]

        tempGraph.mergeNode(startingPoint)

        const requirements = tempGraph.getNodeAttribute(startingPoint, "requirements") ?? []

        requirements.forEach((requirement: string) => tempGraph.mergeEdge(requirement, startingPoint))

        dfsFromNode(graph, startingPoint, (node, _attr, _depth) => {
            if (graph.someInNeighbor(node, neighbor => !graph.getNodeAttribute(neighbor, "visited"))
                || (graph.inDegree(node) > 1 && startingPoint != node)) {
                tempGraph.mergeNode(node)

                tempGraph.updateNodeAttribute(node, "requirements", requirements => {
                    if (requirements === undefined) return new Set([startingPoint])
                    else {
                        requirements.add(startingPoint)
                        return requirements
                    }
                })

                return true
            } else if (graph.inDegree(node) == 1 || startingPoint == node) {
                tempGraph.updateNodeAttribute(startingPoint, "members", members => {
                    if (members === undefined) return [node]
                    else return members.concat([node])
                })

                remaining--
                graph.setNodeAttribute(node, "visited", true)

            } else {
                return true
            }
        })
    }

    let retPlan: number[] = []

    remaining = tempGraph.order

    while (remaining > 0) {
        const nextChainStart: string = tempGraph
            .filterNodes(node => tempGraph.inDegree(node) == 0)
            .reduce((prev, curr) => 
                tempGraph.getNodeAttribute(prev, "members").length > tempGraph.getNodeAttribute(curr, "members").length
                    ? prev
                    : curr)


        
        const nextChain: string[] = tempGraph.getNodeAttribute(nextChainStart, "members")
        tempGraph.dropNode(nextChainStart)

        remaining--

        retPlan = retPlan.concat(nextChain.map(Number))
    }

    return retPlan
}