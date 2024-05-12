import { useSigma } from "@react-sigma/core"

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