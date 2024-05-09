import reverse from 'graphology-operators/reverse';

import { KnowledgeGraph, Requirement, Topic } from "./model"
import { produce } from 'immer';

type GraphReduceAction = {
    type: "deleteTopic",
    node: number 
} | {
    type: "addTopic"
} | {
    type: "addRequirement"
} | {
    type: "deleteRequirement",
} | {
    type: "toggleSelectTopic",
    node: number
} | {
    type: "modifyTopic",
    topic: Topic
} | {
    type: "addProgress",
    node: number
} | {
    type: "removeProgress",
    node: number
} | {
    type: "clearSelected"
}

interface GraphReducerState {
    graph: KnowledgeGraph,
    selectedTopics: number[]
}

// unfinished!
const graphReducer = (state: GraphReducerState, action: GraphReduceAction) => 
    produce(state, draft => {
        if (action.type === "deleteTopic") {
            draft.graph.topics = draft.graph.topics
                .filter(topic => topic.id != action.node)
            
            draft.graph.requirements = draft.graph.requirements
                .filter(requirement => requirement[0] !== action.node && requirement[1] !== action.node)

            draft.selectedTopics = []

        } else if (action.type === "deleteRequirement") {

            draft.graph.requirements = draft.graph.requirements
                .filter(requirement => requirement[0] !== draft.selectedTopics[0] || requirement[1] !== draft.selectedTopics[1])

            draft.selectedTopics = []

        } else if (action.type === "addRequirement") {
            // TODO: cycle detection
            if (draft.selectedTopics.length == 2) {

                draft.graph.requirements.push([draft.selectedTopics[0], draft.selectedTopics[1]])

                draft.selectedTopics = []
            }
        } else if (action.type === "addTopic") {
            draft.graph.topics.push({
                id: 0,
                knowledge_graph_id: draft.graph.id,
                title: "<new node>",
                content: "",
                subject: ""
            })
        } else if (action.type === "toggleSelectTopic") {
            if (draft.selectedTopics.includes(action.node)) draft.selectedTopics = draft.selectedTopics.filter(topic => topic != action.node)

            else if ((draft.selectedTopics.length == 1 && draft.selectedTopics[0] != action.node) || draft.selectedTopics.length == 0) {
                draft.selectedTopics.push(action.node)
            }
        } else if (action.type === "modifyTopic"){ 
            draft.graph.topics = draft.graph.topics.map(topic => topic.id === action.topic.id ? action.topic : topic)
        } else if (action.type === "addProgress") {
            if (!(draft.graph.progress?.includes(action.node))) draft.graph.progress?.push(action.node)
        } else if (action.type === "removeProgress") {
            draft.graph.progress = draft.graph.progress?.filter(progress => progress !== action.node)
        } else if (action.type === "clearSelected") {
            draft.selectedTopics = []
        }
    })

type GraphAPIAction = {
    type: "addTopic",
    topic: Topic
} | {
    type: "deleteTopic",
    topicId: number
} | {
    type: "addRequirement",
    requirement: Requirement
} | {
    type: "deleteRequirement",
    requirementId: number
}

export { graphReducer, type GraphReduceAction, type GraphAPIAction }