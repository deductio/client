import { createContext } from "react";
import { GraphMap, KnowledgeGraph, ObjectivePrerequisite, ObjectiveSatisfier, Requirement, Topic } from "./model"
import { produce } from 'immer';

export type GraphReduceAction = {
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
    type: "clearSelected"
} | {
    type: "addPrerequisite",
    prereq: ObjectivePrerequisite
} | {
    type: "removePrerequisite",
    node: number,
    objective: number
} | {
    type: "addSatisfier",
    satisfier: ObjectiveSatisfier
} | {
    type: "removeSatisfier",
    node: number
}

interface EditGraphReducerState {
    graph: KnowledgeGraph,
    selectedTopics: number[]
}

export const editGraphReducer = (state: EditGraphReducerState, action: GraphReduceAction) => produce(state, draft => {
    switch (action.type) {
        case "deleteTopic":
            draft.graph.topics = draft.graph.topics
            .filter(topic => topic.id != action.node)
        
            draft.graph.requirements = draft.graph.requirements
                .filter(requirement => requirement[0] !== action.node && requirement[1] !== action.node)

            draft.selectedTopics = []
            break;
        
        case "deleteRequirement":
            draft.graph.requirements = draft.graph.requirements
                .filter(requirement => requirement[0] !== draft.selectedTopics[0] || requirement[1] !== draft.selectedTopics[1])

            draft.selectedTopics = []
            break;

        case "addRequirement":
            // TODO: cycle detection
            if (draft.selectedTopics.length == 2) {

                draft.graph.requirements.push([draft.selectedTopics[0], draft.selectedTopics[1]])

                draft.selectedTopics = []
            }

            break;

        case "addTopic":
            draft.graph.topics.push({
                id: 0,
                knowledge_graph_id: draft.graph.id!,
                title: "<new node>",
                content: "",
                subject: ""
            })

            break;

        case "toggleSelectTopic":
            if (draft.selectedTopics.includes(action.node)) draft.selectedTopics = draft.selectedTopics.filter(topic => topic != action.node)

            else if ((draft.selectedTopics.length == 1 && draft.selectedTopics[0] != action.node) || draft.selectedTopics.length == 0) {
                draft.selectedTopics.push(action.node)
            }

            break;

        case "modifyTopic":
            draft.graph.topics = draft.graph.topics.map(topic => topic.id === action.topic.id ? action.topic : topic)
            break;
        
        case "clearSelected":
            draft.selectedTopics = []
            break;

        case "addPrerequisite":
            draft.graph.objectives.push(action.prereq)
            break;

        case "addSatisfier":
            draft.graph.satisfiers.push({ ...action.satisfier, topic: action.satisfier.topic.id })
            break;

        case "removePrerequisite":
            draft.graph.objectives = draft.graph.objectives.filter(prereq => prereq.topic !== action.node && prereq.objective.id !== action.objective)
            break;

        case "removeSatisfier":
            draft.graph.satisfiers = draft.graph.satisfiers.filter(satisfier => satisfier.topic != action.node)
    }
})

export const EditContext = createContext<{ dispatch: (event: GraphReduceAction) => void, topic: Topic | null }>({dispatch: (_: GraphReduceAction) => {}, topic: null})

export const ViewContext = createContext((_: ViewGraphReduceAction) => {})

export type ViewGraphReduceAction = {
    type: "addProgress",
    node: Topic
} | {
    type: "removeProgress",
    node: Topic
}

export const viewGraphReducer = (state: GraphMap, action: ViewGraphReduceAction) => produce(state, draft => {
    if (action.type === "addProgress") {
        if (!(draft.progress?.includes(action.node.id))) draft.progress?.push(action.node.id)
    } else if (action.type === "removeProgress") {
        draft.progress = draft.progress?.filter(progress => progress !== action.node.id)
    }
})

export type GraphAPIAction = {
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