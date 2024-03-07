type Resource = {
    title: string,
    description: string,
    topic_id: number,
    link: string | null,
    id: number
}

type Topic = {
    knowledge_graph_id: string,
    knowledge_graph_index: number,
    title: string,
    requirements: number[],
    id: number,
    content: string,
    subject: string
}

type KnowledgeGraph = {
    id: string,
    name: string,
    description: string,
    owner: string,
    topics: Topic[]
}

export type { KnowledgeGraph, Topic, Resource }