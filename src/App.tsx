import './App.css'
import { createBrowserRouter, Params, redirect, RouterProvider, useLocation, useMatch, useOutlet } from "react-router-dom";
import { SwitchTransition, CSSTransition } from "react-transition-group"
import SearchGraph from './pages/SearchGraph';
import NavBar from './components/NavBar';
import CreateGraph from './pages/CreateGraph';
import UserProfile from './pages/UserProfile';
import EditGraph from './pages/EditGraph';
import ViewGraph from './pages/ViewGraph';    
import { createRef, RefObject } from "react"

const routes = [
    {
        path: "/",
        element: <p>hello wah</p>
    },

    {
        path: "graph/view/:username/:name",
        element: <ViewGraph/>,
        loader: async ({ params }: { params: Params<string> }) => {
            return fetch(`/api/graph/view/${params.username}/${params.name}`, { headers: { "Accept": "application/json" } })
                .then(res => res.json())
        },
        nodeRef: createRef()
    },

    {
        path: "graph/view/:uuid",
        element: <ViewGraph/>,
        loader: async ({ params }: { params: Params<string> }) => {
            return fetch(`/api/graph/view/${params.uuid}`, { headers: { "Accept": "application/json" } })
                .then(res => res.json())
        },
        nodeRef: createRef()
    },

    {
        path: "graph/progress/:uuid",
        action: async ({ request, params } : { request: Request, params: Params<string> }) => {
            const { topic } = await request.json()

            return fetch(`/api/graph/progress/${params.uuid}?topic=${topic}`, {
                method: request.method
            })
        },
    },

    {
        path: "graph/edit/:uuid",
        element: <EditGraph/>,
        loader: async ({ params }: { params: Params<string> }) => {
            return fetch(`/api/graph/view/${params.uuid}`, { headers: { "Accept": "application/json" } })
                .then(res => res.json())
        },
        children: [
            {
                path: "topic",
                action: async ({ request, params } : { request: Request, params: Params<string> }) => {
                    if (request.method === "PUT") {
                        let form_data = Object.fromEntries(await request.formData())
                    
                        let body: {
                            id: number | undefined,
                            knowledge_graph_id: FormDataEntryValue,
                            content: FormDataEntryValue,
                            subject: FormDataEntryValue,
                            title: FormDataEntryValue
                        } = {
                            id: Number(form_data.id),
                            knowledge_graph_id: form_data.knowledge_graph_id,
                            content: form_data.content,
                            subject: form_data.subject,
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
                action: async ({ request, params }: { request: Request, params: Params<string> }) => {
                    const json = await request.json()

                    if (request.method === "PUT") {
                        return fetch(`/api/graph/edit/${params.uuid}/requirement`, {
                            headers: { 
                                "Accept": "application/json",
                                "Content-Type": "application/json"
                            },
                            method: "PUT",
                            body: JSON.stringify(await request.json())
                        })
                    } else if (request.method === "DELETE") {
                        return fetch(`/api/graph/edit/${params.uuid}/requirement?src=${json.src}&dest=${json.dest}`, {
                            method: "DELETE"
                        })
                    }
                }
            }
        ]
    },

    {
        path: "graph/create",
        element: <CreateGraph/>,
        action: async ({ request }: { request: Request }) => {
            let res = await fetch("/api/graph/create", {
                method: "POST",
                body: await request.formData()
            })

            if (res.ok) {
                const body = await res.json()
                return redirect(`/graph/edit/${body.id}`)
            } else {
                return res
            }
        },
        nodeRef: createRef()
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
        path: "users/:user",
        element: <UserProfile/>,
        loader: async ({ params }: { params: Params<string> }) => {
            return fetch(`/api/users/${params.user}`, { headers: { "Accept": "application/json" } })
                .then(res => res.json())
        },
        nodeRef: createRef()
    }
]

const AppWrapper = () => {
    const location = useLocation()
    const outlet = useOutlet()
    const match = useMatch(location.pathname)

    const { nodeRef } = routes.find((route) => route.path === location.pathname) ?? {}

    return <>
        <NavBar/>
        <SwitchTransition>
            <CSSTransition key={location.pathname} mountOnEnter unmountOnExit classNames="main-app" timeout={300} nodeRef={nodeRef as RefObject<HTMLElement | undefined>}>
                {(state, _,) => {

                    return <div ref={nodeRef as RefObject<HTMLDivElement>}>
                        {outlet}
                    </div>
                }}
            </CSSTransition>
        </SwitchTransition>
    </>
}


const router = createBrowserRouter([{
    path: "/",
    element: <AppWrapper/>,
    children: routes

}])


function App() {
    return <div className="h-screen w-screen">
        <RouterProvider router={router}/>
    </div>
}

export default App
