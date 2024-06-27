/** @module deductio/edit_graph/routes */

import { Params } from "react-router-dom"
import EditGraph from "./EditGraph"
import { FullRequest, ObjectiveSatisfier, PGTopicPair } from "../../utilities/model"

export default [{
    path: "graph/edit/:uuid",
    element: <EditGraph/>,
    loader: async ({ params }: { params: Params<string> }) => {
        return fetch(`/api/graph/edit/${params.uuid}`, { headers: { "Accept": "application/json" } })
            .then(res => res.json())
    },
    children: [
        {
            path: "topic",
            action: async ({ request, params }: FullRequest) => {
                if (request.method === "PUT") {
                    let form_data = Object.fromEntries(await request.formData())
                
                    let body: {
                        id: number | undefined,
                        knowledge_graph_id: FormDataEntryValue,
                        content: FormDataEntryValue,
                        description: FormDataEntryValue,
                        title: FormDataEntryValue
                    } = {
                        id: Number(form_data.id),
                        knowledge_graph_id: form_data.knowledge_graph_id,
                        content: form_data.content,
                        description: form_data.description,
                        title: form_data.title
                    } 

                    if (body.id === 0) delete body.id

                    return fetch(`/api/graph/edit/${params.uuid}/topic`, {
                        headers: { 
                            "Accept": "application/json",
                            "Content-Type": "application/json"
                        },
                        method: "PUT",
                        body: JSON.stringify(body)
                    })
                } else if (request.method === "DELETE") {
                    const req = await request.json()
                    const { id } = req

                    return fetch(`/api/graph/edit/${params.uuid}/topic?topic=${id}`, {
                        method: "DELETE"
                    })
                }
                
            }
        },

        {
            path: "requirement",
            action: async ({ request, params }: FullRequest) => {
                const json = await request.json()

                if (request.method === "PUT") {
                    return fetch(`/api/graph/edit/${params.uuid}/requirement`, {
                        headers: { 
                            "Accept": "application/json",
                            "Content-Type": "application/json"
                        },
                        method: "PUT",
                        body: JSON.stringify(json)
                    })
                } else if (request.method === "DELETE") {
                    return fetch(`/api/graph/edit/${params.uuid}/requirement?src=${json.src}&dest=${json.dest}`, {
                        method: "DELETE"
                    })
                }
            }
        },

        {
            path: "satis",
            action: async ({ request, params }: FullRequest) => {
                const method = request.method 
                const req = await request.json()

                if (method === "DELETE") {
                    return fetch(`/api/graph/edit/${params.uuid}/satis?topic=${req.node}`, { method: "DELETE" })
                } else {
                    const obj_satis_req = req as ObjectiveSatisfier

                    const body = {
                        knowledge_graph_id: obj_satis_req.topic.knowledge_graph_id,
                        topic: obj_satis_req.topic.id,
                        objective: obj_satis_req.objective.id
                    }

                    return fetch(`/api/graph/edit/${params.uuid}/satis`, {
                        method: "PUT",
                        body: JSON.stringify(body)
                    })
                }
            }
        },

        {
            path: "prereq",
            action: async ({ request, params }: FullRequest) => {
                const method = request.method 
                const req = await request.json()

                if (method === "DELETE") {
                    return fetch(`/api/graph/edit/${params.uuid}/prereq?topic=${req.node}&obj=${req.objective}`, { method: "DELETE" })
                } else {
                    return fetch(`/api/graph/edit/${params.uuid}/prereq`, {
                        method: "PUT",
                        body: JSON.stringify({ ...req, suggested_graph: req.suggested_graph.id, objective: Number(req.objective.id) })
                    })
                }
            }
        }
    ]
}, 

{
    path: "objectives",
    action: async ({ request }: { request: Request }) => {
        return await fetch ("/api/objectives", {
            method: "POST",
            body: await request.formData()
        })
    }
},

{
    path: "satisfiers",
    action: async ({ request }: { request: Request }) => {
        const req = await request.formData()
        const res = await fetch(`/api/objectives/search?id=${req.get("id")}`).then(res => res.json()) as PGTopicPair[]
        const curr_graph = req.get("knowledge_graph_id")

        return {
            results: res.filter(result => result.graph.id !== curr_graph),
            objective: {
                id: req.get("id"),
                title: req.get("title"),
                description: req.get("description")
            }
        }
    }
},

{
    path: "create_objective",
    action: async({ request }: { request: Request }) => {
        return await fetch("/api/objectives/", {
            method: "PUT",
            body: await request.formData()
        })
    }
}]