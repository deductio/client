import reverse from 'graphology-operators/reverse';

import { KnowledgeGraph, Topic } from "./model"
import { produce } from 'immer';

type GraphReduceAction = {
    type: "deleteNode",
    node: number 
} | {
    type: "addNode"
} | {
    type: "addEdge"
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
const graphReducer = (state: GraphReducerState, action: GraphReduceAction) => 
    produce(state, draft => {
        if (action.type === "deleteNode") {
                draft.graph.topics = draft.graph.topics
                .filter(topic => topic.id != action.node)
                .map(topic => {
                    topic.requirements = topic.requirements.filter(requirement => requirement !== action.node)
                    return topic
                })

        } else if (action.type === "removeEdge") {

                const index = draft.graph.topics.findIndex(topic => topic.id == action.destination)

                draft.graph.topics[index].requirements = draft.graph.topics[index]
                    .requirements
                    .filter(requirement => requirement != action.source)

        } else if (action.type === "addEdge") {
            // TODO: cycle detection

                if (draft.selectedTopics.length == 2) {
                    const index = draft.graph.topics.findIndex(topic => topic.id == draft.selectedTopics[1])

                    draft.graph.topics[index].requirements.push(draft.selectedTopics[0])

                    draft.selectedTopics = []
                }
                

        } else if (action.type === "addNode") {

                draft.graph.topics.push({
                    id: Math.random(),
                    knowledge_graph_id: "",
                    knowledge_graph_index: Math.random(),
                    title: "<new node>",
                    requirements: [],
                    content: "",
                    subject: ""
                })

        } else if (action.type === "selectNode") {

            if ((draft.selectedTopics.length == 1 && draft.selectedTopics[0] != action.node) || draft.selectedTopics.length == 0) {
                draft.selectedTopics.push(action.node)
            }

        } else if (action.type === "deselectNode") {

                draft.selectedTopics = draft.selectedTopics.filter(topic => topic != action.node)

        } else { // satisfy the typescript compiler
            
        }
    })



export { graphReducer, type GraphReduceAction }