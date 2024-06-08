import { useSigma } from "@react-sigma/core"

/**
 * A Sigma.js reducer plugin that colors (and locks) nodes based on whether or not their
 * prerequisite nodes have been completed (and the necessary objectives have been satisfied
 * as well). Used in the ViewGraph component.
 * 
 * @param props - The current reported progress on this graph/map
 */
const ViewReducer = (props: { progress: number[] }) => {
    const sigma = useSigma()
    const graph = sigma.getGraph()

    const progress = props.progress === undefined ? [] : props.progress

    sigma.setSetting("nodeReducer", (node, data) => {
        if (graph.inNeighbors(node).map(Number).some(req => !progress.includes(req)) && graph.inDegree(node) !== 0) {
            return {
                ...data,
                color: "gray"
            }
        } 
            return data
        }
    )
    
    return null
}

export default ViewReducer