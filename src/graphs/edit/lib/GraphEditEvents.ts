import { useRegisterEvents, useSigma } from "@react-sigma/core"
import { useEffect } from "react"

interface GraphEditEventProps {
    selectTopic: (_: number) => void,
    modifyTopic: (_: number) => void
}

/**
 * A Sigma.js plugin that handles click events for the graph rendered in
 * {@link module:deductio/edit_graph#EditGraph}.
 * 
 * @param props - Callback functions to handle click events
 */
const GraphEditEvents = (props: GraphEditEventProps) => {
    const registerEvents = useRegisterEvents()
    const sigma = useSigma()

    useEffect(() => {
        const graph = sigma.getGraph()

        registerEvents({
            clickNode: event => {
                props.selectTopic(graph.getNodeAttribute(event.node, "id"))
            },
            doubleClickNode: event => {
                props.modifyTopic(graph.getNodeAttribute(event.node, "id"))
            }
        })
    }, [registerEvents, sigma, props])

    return null
}

export default GraphEditEvents