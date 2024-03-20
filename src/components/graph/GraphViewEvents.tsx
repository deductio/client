import { useRegisterEvents, useSigma } from "@react-sigma/core"
import { useEffect } from "react"

const GraphViewEvents = (props: { clickTopic: (_: number) => void }) => {
    const registerEvents = useRegisterEvents()
    const sigma = useSigma()

    useEffect(() => {
        const graph = sigma.getGraph()

        registerEvents({
            clickNode: (event) => {
                props.clickTopic(graph.getNodeAttribute(event.node, "id"))
            }
        })
    }, [registerEvents, sigma])

    return null
}

export default GraphViewEvents