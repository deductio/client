import { produce } from "immer"
import { createContext } from "react"
import { Topic, GraphMap, Requirement } from "../../../utilities/model"

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