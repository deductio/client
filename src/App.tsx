import './App.css'
import { createBrowserRouter, Params, redirect, RouterProvider, useLocation, useOutlet } from "react-router-dom";
import { SwitchTransition, CSSTransition } from "react-transition-group"
import SearchGraph from './pages/SearchGraph';
import NavBar from './components/NavBar';
import CreateGraph from './pages/CreateGraph';
import UserProfile from './pages/UserProfile';
import EditGraph from './pages/EditGraph';
import ViewGraph from './pages/ViewGraph';    
import { createRef, RefObject } from "react"
import TrendingGraph from './pages/TrendingGraphs';
import EditGraphData from './pages/EditGraphData';
import UserMaps from './pages/UserMaps';
import { ObjectiveSatisfier, PGTopicPair } from './api/model';

type FullRequest = {
    params: Params<string>,
    request: Request
}

const MAIN_GRAPH = "00000000-0000-0000-0000-000000000000"

const routes = [
    {
        path: "/",
        loader: async () => {
            return await fetch("/graph/view/" + MAIN_GRAPH).then(res => res.json())
        }
    },

    {
        path: "graph/view/:username/:name",
        element: <ViewGraph/>,
        loader: async ({ params }: { params: Params<string> }) => {
            const ret = await fetch(`/api/graph/view/${params.username}/${params.name}`, { headers: { "Accept": "application/json" } })
            
            if (!ret.ok) {
                throw ret
            }

            return await ret.json()
        },
        nodeRef: createRef()
    },

    {
        path: "graph/view/:uuid",
        element: <ViewGraph/>,
        loader: async ({ params }: { params: Params<string> }) => {
            const ret = await fetch(`/api/graph/view/${params.uuid}`, { headers: { "Accept": "application/json" } })
            
            if (!ret.ok) {
                throw ret
            }

            return await ret.json()
        },
        nodeRef: createRef()
    },

    {
        path: "graph/progress",
        action: async ({ request }: FullRequest) => {
            const { topic } = await request.json()

            return fetch(`/api/graph/progress/${topic.knowledge_graph_id}?topic=${topic.id}`, {
                method: request.method
            })
        },
    },

    {
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
    },

    {
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
        path: "create",
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
    },

    {
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
    },

    {
        path: "users/:user",
        element: <UserProfile/>,
        loader: async ({ params }: { params: Params<string> }) => {
            return fetch(`/api/users/${params.user}`, { headers: { "Accept": "application/json" } })
                .then(res => res.json())
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
    }
]

const AppWrapper = () => {
    const location = useLocation()
    const outlet = useOutlet()

    const { nodeRef } = routes.find((route) => route.path === location.pathname) ?? {}

    return <>
        <NavBar/>
        <SwitchTransition>
            <CSSTransition key={location.pathname} mountOnEnter unmountOnExit classNames="main-app" timeout={300} nodeRef={nodeRef as RefObject<HTMLElement | undefined>}>
                {_ => {

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
