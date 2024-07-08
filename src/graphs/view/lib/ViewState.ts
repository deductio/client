import { produce } from 'immer'
import { Dispatch, createContext, useEffect, useReducer, useState } from 'react'
import { Topic, GraphMap, Requirement } from '../../../utilities/model'
import { useLoaderData } from 'react-router'
import { useFetcher } from 'react-router-dom'
import useLocalStorageState from 'use-local-storage-state'
import Cookies from 'js-cookie'

export const ViewContext = createContext((_: ViewGraphReduceAction) => {})

export type ViewGraphReduceAction = {
  type: 'addProgress'
  node: Topic
} | {
  type: 'removeProgress'
  node: Topic
}

export const viewGraphReducer = (state: GraphMap, action: ViewGraphReduceAction): GraphMap => produce(state, draft => {
  if (action.type === 'addProgress') {
    if (draft.progress?.includes(action.node.id) === false) draft.progress?.push(action.node.id)
  } else if (action.type === 'removeProgress') {
    draft.progress = draft.progress?.filter(progress => progress !== action.node.id)
  }
})

export type GraphAPIAction = {
  type: 'addTopic'
  topic: Topic
} | {
  type: 'deleteTopic'
  topicId: number
} | {
  type: 'addRequirement'
  requirement: Requirement
} | {
  type: 'deleteRequirement'
  requirementId: number
}

export const useViewGraph = (): [GraphMap, number[], Dispatch<ViewGraphReduceAction>] => {
  const _graph = useLoaderData() as GraphMap

  // if we are given a learning map rather than a graph, this hook is irrelevant
  const [localProgressTemp, setLocalProgress] = useLocalStorageState(`progress-${_graph.id ?? 'fallback'}`)

  const fetcher = useFetcher()

  useEffect(() => {
    if (localProgressTemp === undefined) {
      setLocalProgress([])
    }
  }, [])

  // We need to keep track of what we most recently did in order to properly synchronize the state.
  const [queuedUpdate, queueUpdate] = useState<ViewGraphReduceAction | null>(null)

  const localProgress = localProgressTemp as number[]

  const curriedGraphReducer = produce(viewGraphReducer)
  const [graph, dispatch] = useReducer(curriedGraphReducer, _graph)
  const [progress, setProgress] = useState(graph?.progress ?? localProgress)

  // We need to have the graph progress kept in a ref in order to access the latest version at any given time

  useEffect(() => {
    if (queuedUpdate !== null) {
      dispatch(queuedUpdate)

      if (Cookies.get('name') !== undefined) {
        if (queuedUpdate.type === 'addProgress') {
          fetcher.submit({ topic: queuedUpdate.node }, { method: 'PUT', action: '/graph/progress', encType: 'application/json' })
          setProgress(progress.concat([queuedUpdate.node.id]))
        } else if (queuedUpdate.type === 'removeProgress') {
          fetcher.submit({ topic: queuedUpdate.node }, { method: 'DELETE', action: '/graph/progress', encType: 'application/json' })
          setProgress(progress.filter(progress => progress !== queuedUpdate.node.id))
        }
      } else {
        if (queuedUpdate.type === 'addProgress') {
          setLocalProgress(localProgress.concat([queuedUpdate.node.id]))
          setProgress(progress.concat([queuedUpdate.node.id]))
        } else if (queuedUpdate.type === 'removeProgress') {
          setLocalProgress(localProgress.filter(progress => progress !== queuedUpdate.node.id))
          setProgress(progress.filter(progress => progress !== queuedUpdate.node.id))
        }
      }
    }
  }, [queuedUpdate])

  return [graph, progress, queueUpdate]
}
