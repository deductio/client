export type Topic = {
    knowledge_graph_id: string,
    title: string,
    id: number,
    content: string,
    subject: string
}

export type Requirement = {
    id: number,
    source: number,
    destination: number
}

export type Objective = {
    id: number,
    title: string,
    description: string
}

export type ResObjectiveSatisfier = {
    topic: number,
    objective: Objective
}

export type KnowledgeGraph = {
    id: string,
    name: string,
    description: string,
    owner: string,
    topics: Topic[],
    requirements: [number, number][],
    progress: number[] | undefined,
    objectives: ObjectivePrerequisite[],
    satisfiers: ResObjectiveSatisfier[]
}

export type ObjectivePrerequisite = {
    knowledge_graph_id: string,
    topic: number,
    objective: Objective,
    suggested_graph: PreviewGraph,
    suggested_topic: number
}

export type ObjectiveSatisfier = {
    topic: Topic,
    objective: Objective
}

export type GraphMap = {
    id?: string,
    topics: Topic[],
    requirements: [number, number][],
    progress: number[] | undefined
}

export type PGTopicPair = {
    graph: PreviewGraph,
    topics: Topic[]
}

export type RecResult = {
    results: PGTopicPair[],
    objective: Objective
}

export type FrontendUser = {
    username: string,
    avatar: string
}

export type SearchResultGraph = {
    id: string,
    name: string,
    description: string,
    user: FrontendUser,
    like_count: number,
    liked: boolean
}

export type PreviewGraph = {
    id: string,
    name: string,
    description: string
}

export type User = {
    user: FrontendUser
    graphs: SearchResultGraph[]
}