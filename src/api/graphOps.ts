import { KnowledgeGraph, Topic } from "./model"
import { produce } from 'immer';

type GraphReduceAction = {
    type: "deleteNode",
    node: number 
} | {
    type: "addNode"
} | {
    type: "addEdge",
    source: number,
    destination: number
} | {
    type: "removeEdge",
    source: number,
    destination: number
} | {
    type: "selectNode",
    node: number
} | {
    type: "deselectNode",
    node: number
}

interface GraphReducerState {
    graph: KnowledgeGraph,
    selectedTopics: number[]
}

// unfinished!
const graphReducer = (state: GraphReducerState, action: GraphReduceAction) => {
    if (action.type === "deleteNode") {
        return produce(state, draft => {
            draft.graph.topics = draft.graph.topics
            .filter(topic => topic.id != action.node)
            .map(topic => {
                topic.requirements = topic.requirements.filter(requirement => requirement !== action.node)
                return topic
            })
        })

    } else if (action.type === "removeEdge") {
        return produce(state, draft => {
            const index = draft.graph.topics.findIndex(topic => topic.id == action.destination)

            draft.graph.topics[index].requirements = draft.graph.topics[index]
                .requirements
                .filter(requirement => requirement != action.source)
        })

    } else if (action.type === "addEdge") {
        // TODO: cycle detection

        return produce(state, draft => {
            const index = draft.graph.topics.findIndex(topic => topic.id == action.destination)

            draft.graph.topics[index].requirements.push(action.source)
        })
    } else if (action.type === "addNode") {
        return produce(state, draft => {
            draft.graph.topics.push({
                id: Math.random(),
                knowledge_graph_id: "",
                knowledge_graph_index: Math.random(),
                title: "Shine On You Crazy Diamond",
                requirements: [],
                content: "",
                subject: ""
              })
        })
    } else if (action.type === "selectNode") {
        console.log("oh yeah")

        return produce(state, draft => {
            if (draft.selectedTopics.length < 2) {
                draft.selectedTopics.push(action.node)
            }
        })
    } else if (action.type === "deselectNode") {
        return produce(state, draft => {
            draft.selectedTopics = draft.selectedTopics.filter(topic => topic != action.node)
        })
    } else { // satisfy the typescript compiler
        return produce(state, draft => draft)
    }
}

export { graphReducer, type GraphReduceAction }