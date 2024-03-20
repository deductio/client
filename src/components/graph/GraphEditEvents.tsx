import { useRegisterEvents, useSigma } from "@react-sigma/core"
import { useEffect } from "react"

interface GraphEditEventProps {
    selectTopic: (_: number) => void,
    modifyTopic: (_: number) => void
}

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