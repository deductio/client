type Resource = {
    title: string,
    description: string,
    link: string | null,
    img: string | null
}

type Topic = {
    knowledge_graph_id: string,
    knowledge_graph_index: number,
    title: string,
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