import { createRef } from "react"
import { Params, redirect } from "react-router"
import { FullRequest } from "../utilities/model"
import EditGraphData from "./EditGraphData"

export default [    {
    path: "graph/configure/:uuid",
    element: <EditGraphData/>,
    nodeRef: createRef(),
    loader: async ({ params }: { params: Params<string> }) => {
        return fetch(`/api/graph/preview/${params.uuid}`).then(res => res.json())
    },
    action: async ({ params, request }: FullRequest) => {
        const data = await request.formData()

        const action = data.get("method")

        if (action === "delete") {
            await fetch(`/api/graph/edit/${params.uuid}`, {
                method: "DELETE"
            })
            return redirect("/")
        } else if (action === "modify") {
            return redirect(`/graph/edit/${params.uuid}`)
        } else if (action === "save") {
            await fetch(`/api/graph/edit/${params.uuid}`, {
                method: "PUT",
                body: data
            })
            return ""
        }
    }
},

{
    path: "graph/update/:uuid",
    action: async ({ request, params }: FullRequest) => {
        return fetch(`/api/graph/edit/${params.uuid}`, {
            method: "PUT",
            body: await request.formData()
        })
    },
},

{
    path: "graph/delete/:uuid",
    action: async ({ params }: { params: Params<string> }) => {
        return fetch(`/api/graph/edit/${params.uuid}`, {
            method: "DELETE"
        })
    },
}]