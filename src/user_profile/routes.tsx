import { createRef } from "react"
import { Params } from "react-router"
import UserProfile from "./UserProfile"

export default [{
    path: "users/:user",
    element: <UserProfile/>,
    loader: async ({ params }: { params: Params<string> }) => {
        return fetch(`/api/users/${params.user}`, { headers: { "Accept": "application/json" } })
            .then(res => res.json())
    },
    nodeRef: createRef()
}]