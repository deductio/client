import { useRegisterEvents, useSigma } from '@react-sigma/core'
import { useEffect } from 'react'
/**
 * A Sigma.js plugin that handles node clicks for {@link module:deductio/view_graph#ViewGraph}.
 */
const GraphViewEvents = (props: { clickTopic: (_: number) => void }): null => {
  const registerEvents = useRegisterEvents()
  const sigma = useSigma()

  useEffect(() => {
    const graph = sigma.getGraph()

    registerEvents({
      clickNode: (event) => {
        props.clickTopic(graph.getNodeAttribute(event.node, 'id'))
      }
    })
  }, [registerEvents, sigma])

  return null
}

export default GraphViewEvents
