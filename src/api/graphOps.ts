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
    source: number,
    destination: number
} | {
    type: "selectTopic",
    node: number
} | {
    type: "deselectTopic",
    node: number
} | {
    type: "modifyTopic",
    topic: Topic
} | {
    type: "premodifyTopic" // only used to signal modifyTopic
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
                .filter(requirement => requirement.source !== action.node && requirement.destination !== action.node)

            draft.selectedTopics = []

        } else if (action.type === "deleteRequirement") {

            const index = draft.graph.topics.findIndex(topic => topic.id == action.destination)

            draft.graph.requirements = draft.graph.requirements
                .filter(requirement => requirement.source !== draft.selectedTopics[0] || requirement.destination !== draft.selectedTopics[1])

        } else if (action.type === "addRequirement") {
            // TODO: cycle detection

            if (draft.selectedTopics.length == 2) {

                draft.graph.requirements.push({
                    id: 0,
                    source: draft.selectedTopics[0],
                    destination: draft.selectedTopics[1]
                })

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

        } else if (action.type === "selectTopic") {

            if ((draft.selectedTopics.length == 1 && draft.selectedTopics[0] != action.node) || draft.selectedTopics.length == 0) {
                draft.selectedTopics.push(action.node)
            }

        } else if (action.type === "deselectTopic") {

            draft.selectedTopics = draft.selectedTopics.filter(topic => topic != action.node)

        } else if (action.type === "modifyTopic"){ // satisfy the typescript compiler
            
            draft.graph.topics = draft.graph.topics.map(topic => topic.id === action.topic.id ? action.topic : topic)

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