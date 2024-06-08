import { createRef } from "react"
import { Params } from "react-router"
import ViewGraph from "../graphs/view/ViewGraph"
import UserMaps from "./UserMaps"

export default [{
    path: "maps",
    loader: async () => {
        return fetch("/api/maps").then(res => res.json())
    },
    element: <UserMaps/>,
    nodeRef: createRef(),
},

{
    path: "map/:id",
    loader: async ({ params }: { params: Params<string> }) => {
        return fetch(`/api/maps/${params.id}`).then(res => res.json())
    },
    element: <ViewGraph />,
    nodeRef: createRef()
}]