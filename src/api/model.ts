type Topic = {
    knowledge_graph_id: string,
    title: string,
    id: number,
    content: string,
    subject: string
}

type Requirement = {
    id: number,
    source: number,
    destination: number
}

type Objective = {
    id: number,
    title: string,
    description: string
}

type KnowledgeGraph = {
    id: string,
    name: string,
    description: string,
    owner: string,
    topics: Topic[],
    requirements: [number, number][],
    progress: number[] | undefined,
    objectives: ObjectivePrerequisite[]
}

type ObjectivePrerequisite = {
    knowledge_graph_id: string,
    topic: number,
    objective: Objective,
    suggested_graph: PreviewGraph,
    suggested_topic: number
}

type GraphMap = {
    id?: string,
    topics: Topic[],
    requirements: [number, number][],
    progress: number[] | undefined
}

type FrontendUser = {
    username: string,
    avatar: string
}

type SearchResultGraph = {
    id: string,
    name: string,
    description: string,
    user: FrontendUser,
    like_count: number,
    liked: boolean
}

type PreviewGraph = {
    id: string,
    name: string,
    description: string
}

type User = {
    user: FrontendUser
    graphs: SearchResultGraph[]
}

export type { KnowledgeGraph, Topic, Requirement, SearchResultGraph, User, FrontendUser, PreviewGraph, GraphMap, ObjectivePrerequisite, Objective }