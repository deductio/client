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

type KnowledgeGraph = {
    id: string,
    name: string,
    description: string,
    owner: string,
    topics: Topic[],
    requirements: [number, number][],
    progress: number[] | undefined
}

type SearchResultGraph = {
    id: string,
    name: string,
    description: string,
    author: string
}

type User = {
    user: {
        username: string,
        avatar: string,
    },
    graphs: SearchResultGraph[]
}

export type { KnowledgeGraph, Topic, Requirement, SearchResultGraph, User }