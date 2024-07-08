/* eslint-disable @typescript-eslint/consistent-type-definitions */

import { Params } from 'react-router-dom'

/**
 * Represents a single node in a {@link KnowledgeGraph}.
 */
export type Topic = {
  knowledge_graph_id: string
  title: string
  id: number
  content: string
  description: string
}

/**
 * Represents an edge in a {@link KnowledgeGraph}.
 */
export interface Requirement {
  id: number
  source: number
  destination: number
}

/**
 * Represents an *objective*, or a requirement that isn't necessarily tied to any specific graph. Used
 * for creating requirements that may span across graphs.
 */
export type Objective = {
  id: number
  title: string
  description: string
}

/**
 * A struct that indicates a given topic (identified by its `id`) satisfies a given {@link Objective}.
 * The server only provides the ID of a topic when providing satisfiers: for a satisfier that contains
 * the relevant topic, see {@link ObjectiveSatisfier}.
 */
export interface ResObjectiveSatisfier {
  topic: number
  objective: Objective
}

/**
 * The main knowledge graph type - contains all information necessary to render (for viewing) and modify (for editing)
 * a user-created graph.
 */
export type KnowledgeGraph = {
  id: string
  name: string
  description: string
  owner: string
  topics: Topic[]
  requirements: Array<[number, number]>
  progress: number[] | undefined
  objectives: ObjectivePrerequisite[]
  satisfiers: ResObjectiveSatisfier[]
}

/**
 * Indicates that a given {@link Objective} must be completed before a topic in the graph can be unlocked, even if
 * all intra-graph requirements are completed. To make learning map generation easier, an external graph (and topic within
 * the graph) are provided that satisfy the given objective, dictated by the creator of the current graph.
 */
export type ObjectivePrerequisite = {
  knowledge_graph_id: string
  topic: number
  objective: Objective
  suggested_graph: PreviewGraph
  suggested_topic: number
}

/**
 * A struct that indicates a given topic (identified by its `id`) satisfies a given {@link Objective}.
 */
export type ObjectiveSatisfier = {
  topic: Topic
  objective: Objective
}

/**
 * A stripped-down {@link KnowledgeGraph} used for rendering to allow both knowledge graphs and learning maps (generated across
 * potentially multiple knowledge graphs) to share rendering logic.
 */
export interface GraphMap {
  id?: string
  topics: Topic[]
  requirements: Array<[number, number]>
  progress: number[] | undefined
}

/**
 * A {@link PreviewGraph} along with a collection of topics, used for presenting search results when
 * finding graphs and topics that satisfy a given objective.
 */
export type PGTopicPair = {
  graph: PreviewGraph
  topics: Topic[]
}

/**
 * A collection of graphs (and specific topics) that satisfy the given objective.
 */
export interface RecResult {
  results: PGTopicPair[]
  objective: Objective
}

/**
 * A public user.
 */
export interface FrontendUser {
  username: string
  avatar: string
}

/**
 * Metadata for a {@link KnowledgeGraph} that appears in search results.
 *
 * @see module:deductio/search_graph
 */
export interface SearchResultGraph {
  id: string
  name: string
  description: string
  user: FrontendUser
  like_count: number
  liked: boolean
}

/**
 * Stripped down metadata of a {@link KnowledgeGraph}, used for modifying basic info
 * without editing the graph itself.
 *
 * @see module:deductio/modify_graph
 */
export type PreviewGraph = {
  id: string
  name: string
  description: string
}

/**
 * Represents a user profile, with metadata about the given user, as well as a collection
 * of graphs authored by the user.
 */
export interface User {
  user: FrontendUser
  graphs: SearchResultGraph[]
}

/**
 * A convenience type for dealing with React Router actions that have both
 * URL parameters and request bodies.
 */
export interface FullRequest {
  params: Params<string>
  request: Request
}
