import { Dispatch, SetStateAction, createContext, useEffect, useReducer, useState } from "react";
import { KnowledgeGraph, ObjectivePrerequisite, ObjectiveSatisfier, Topic } from "../../../utilities/model"
import { produce } from 'immer';
import { useLoaderData } from "react-router";
import { useFetcher } from "react-router-dom";

/**
 * The actions that can be performed on a writable graph.
 */
export type GraphReduceAction = {
    type: "deleteTopic",
    node: number 
} | {
    type: "addTopic",
    topic?: Topic
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
} | {
    type: "commitTopic",
    id: number
} | {
    type: "clearTempNode"
}

/**
 * The current state of the writable graph.
 */
export interface EditGraphReducerState {
    graph: KnowledgeGraph,
    selectedTopics: number[]
}

/**
 * A React reducer function, implemented using Immer, that immutably handles changes 
 * in the state of the graph when editing it.
 * 
 * @param state The previous graph state.
 * @param action The action to be performed on the graph.
 * @returns An updated state with the proper action applied.
 */
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
            draft.graph.topics.push(action.topic ? action.topic : {
                id: 0,
                knowledge_graph_id: draft.graph.id!,
                title: "<new node>",
                content: "",
                description: ""
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
            break

        case "commitTopic":
            draft.graph.topics = draft.graph.topics.map(topic => {
                if (topic.id != 0) return topic
                else return {
                    ...topic,
                    id: action.id
                }
            })
            break

        case "clearTempNode":
            draft.graph.topics = draft.graph.topics.filter(topic => topic.id != 0)
    }
})

export interface ToolbarProps {
    imageDialogOpen: boolean,
    setImageDialogOpen: Dispatch<SetStateAction<boolean>>,
    youtubeDialogOpen: boolean,
    setYoutubeDialogOpen: Dispatch<SetStateAction<boolean>>
}

/**
 * A Context that provides the graph edit reducer function (defined above, but wrapped before passing), as well as the currently opened topic
 * to child components of EditGraph to prevent deeply passing props.
 */
export const EditContext = createContext<{ dispatch: (event: GraphReduceAction) => void, topic: Topic | null, toolbar: ToolbarProps }>(
    {dispatch: (_: GraphReduceAction) => {}, topic: null, toolbar: {
        imageDialogOpen: false,
        setImageDialogOpen: (_) => {},
        setYoutubeDialogOpen: (_) => {},
        youtubeDialogOpen: false
    }}
)

export const useEditGraph = (): [EditGraphReducerState, Dispatch<GraphReduceAction | null>] => {
    const dataGraph = useLoaderData() as KnowledgeGraph
    const fetcher = useFetcher()

    const [event, setEvent] = useState<GraphReduceAction | null>(null)

    const curriedGraphReducer = produce(editGraphReducer)
    const [{ graph, selectedTopics }, dispatch] = useReducer(curriedGraphReducer, { graph: dataGraph, selectedTopics: [] })

    useEffect(() => {
        if (fetcher.formAction == `/graph/edit/${graph.id}/topic` && fetcher.formMethod == "put" && fetcher.data.knowledge_graph_id
            && !graph.topics.some(topic => topic.id == fetcher.data.id)
        ) 
            dispatch({ type: "commitTopic", id: fetcher.data.id })
        
    }, [fetcher.data])

    useEffect(() => {
        if (event == null) return

        if (event.type === "deleteTopic" && event.node == undefined) {
            event.node = selectedTopics[0]
        }

        dispatch(event)

        switch (event.type) {
            case "deleteTopic":
                if (event.node != 0)
                    fetcher.submit({ id: event.node }, {
                        method: "DELETE",
                        action: `/graph/edit/${graph.id}/topic`,
                        encType: "application/json"
                    })
                break;
            
            case "deleteRequirement":
                const requirement = graph.requirements.find(req => req[1] === selectedTopics[1] && req[0] === selectedTopics[0])
            
                if (requirement !== undefined) {
                    fetcher.submit({ src: requirement[0], dest: requirement[1] }, {
                        method: "DELETE",
                        action: `/graph/edit/${graph.id}/requirement`,
                        encType: "application/json"
                    })
                }
                break;
    
            case "addRequirement":
                fetcher.submit({
                    knowledge_graph_id: graph.id,
                    source: selectedTopics[0],
                    destination: selectedTopics[1]
                }, {
                    method: "PUT",
                    action: `/graph/edit/${graph.id}/requirement`,
                    encType: "application/json"
                })
                break;
    
            case "modifyTopic":
                fetcher.submit(event.topic, { method: "PUT", action: `/graph/edit/${graph.id}/topic` })
                break;
    
            case "addPrerequisite":
                fetcher.submit(event.prereq, { method: "PUT", action: `/graph/edit/${graph.id}/prereq`, encType: "application/json" })
                break;
    
            case "addSatisfier":
                fetcher.submit(event.satisfier, { method: "PUT", action: `/graph/edit/${graph.id}/satis`, encType: "application/json" })
                break;
    
            case "removePrerequisite":
                fetcher.submit(event, { method: "DELETE", action: `/graph/edit/${graph.id}/prereq`, encType: "application/json" })
                break;
    
            case "removeSatisfier":
                fetcher.submit(event, { method: "DELETE", action: `/graph/edit/${graph.id}/satis`, encType: "application/json" })
        }
    }, [event])

    return [{ graph, selectedTopics }, setEvent]
}