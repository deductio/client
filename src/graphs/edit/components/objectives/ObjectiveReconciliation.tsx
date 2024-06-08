import { FetcherWithComponents } from "react-router-dom"
import { RecResult, Topic } from "../../../../utilities/model"
import { ForwardedRef, forwardRef, useContext, useState } from "react"
import { EditContext } from "../../lib/EditState"

type ObjectiveReconciliationProps = {
    fetcher: FetcherWithComponents<any>,
    reconcile: () => void
}

/**
 * A component that allows you to select the external graph (and topic) that satisfy a given objective when
 * adding a prerequisite to a topic.
 */
const ObjectiveReconciliation = forwardRef((props: ObjectiveReconciliationProps, ref: ForwardedRef<HTMLDivElement>) => {
    const data = props.fetcher.data as RecResult

    const { dispatch, topic: currentTopic } = useContext(EditContext)
    const [topic, setTopic] = useState<Topic | null>(null)

    return <div ref={ref}>
        <h1 className="font-bold text-4xl text-center">Add a satisfying graph</h1>

        <div>
            {data.results.map(({ graph, topics }) => {
                const inner = topics.length > 1 
                    ? topics.map(topicResult => <input type="radio" name="topic" onChange={() => setTopic(topic)} checked={topic?.id === topicResult.id}>{topicResult.title}</input>)
                    : <input type="hidden" value={topics[0].id} name="id"></input>

                return <div className="m-4">
                    <h2 className="font-semibold text-2xl">{graph.name}</h2>

                    <p className="indent-4 m-2">{graph.description}</p>

                    {inner}

                    <button className="bg-indigo-600 text-white p-1 rounded-lg" onClick={() => {
                        if (topics.length > 1 && (topic === null || topic.knowledge_graph_id !== graph.id)) {
                            alert("There are multiple topics from this graph that satisfy the given objective: please select one")
                        } else {
                            dispatch({
                                type: "addPrerequisite",
                                prereq: {
                                    knowledge_graph_id: currentTopic!.knowledge_graph_id,
                                    topic: currentTopic!.id,
                                    suggested_graph: graph,
                                    objective: data.objective,
                                    suggested_topic: topics.length > 1 ? topic!.id : topics[0].id
                                }
                            })

                            props.reconcile()
                        }
                    }}>Select</button>
                </div>
            })}
        </div>
    </div>
})

export default ObjectiveReconciliation