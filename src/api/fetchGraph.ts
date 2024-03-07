import { DirectedGraph } from "graphology"
import { KnowledgeGraph, Resource } from "./model"

async function getKnowledgeGraph(uuid: String): Promise<KnowledgeGraph> {
    const res = await fetch("/graph/" + uuid)
    return res.json()
}

async function getTopicResources(graph_uuid: String, topic_idx: Number): Promise<Resource[]> {
    const res = await fetch("/graph/" + graph_uuid + "/topic/" + topic_idx)
    return res.json()
}