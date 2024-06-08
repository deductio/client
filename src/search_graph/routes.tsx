import { createRef } from "react"
import { FullRequest } from "../utilities/model"
import SearchGraph from "./SearchGraph"
import { Params } from "react-router"
import TrendingGraph from "./TrendingGraphs"

export default [{
    path: "like/:uuid",
    action: async ({ params, request }: FullRequest) => {
        const data = await request.formData()

        const method = data.get("liked") === "yes" ? "DELETE" : "PUT"

        return fetch(`/api/graph/like/${params.uuid}`, {
            method: method
        })
    }
},

{
    path: "search",
    element: <SearchGraph/>,
    action: async ({ request }: { request: Request }) => {

        let res = await fetch("/api/search", {
            method: "POST",
            body: await request.formData()
        })

        if (res.ok) {
            return res
        } else {
            return res
        }
    },
    nodeRef: createRef()
},     

{
    path: "trending/:timerange?",
    element: <TrendingGraph/>,
    loader: async ({ params }: { params: Params<string> }) => {
        const timerange = params.timerange || "all_time"

        return fetch(`/api/trending?timerange=${timerange}`)
            .then(res => res.json())
    },
    nodeRef: createRef()
}]