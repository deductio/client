import './App.css'
import { createBrowserRouter, RouterProvider, useLocation, useOutlet } from "react-router-dom";
import { SwitchTransition, CSSTransition } from "react-transition-group"
import NavBar from './utilities/NavBar'; 
import { RefObject } from "react"

import viewRoutes from "./graphs/view/routes"
import editRoutes from "./graphs/edit/routes"
import createRoutes from "./create_graph/routes"
import searchRoutes from "./search_graph/routes"
import userRoutes from "./user_profile/routes"
import mapRoutes from "./user_maps/routes"
import modifyRoutes from "./modify_graph/routes"

const MAIN_GRAPH = "00000000-0000-0000-0000-000000000000"

const routes = [
    {
        path: "/",
        loader: async () => {
            return await fetch("/graph/view/" + MAIN_GRAPH).then(res => res.json())
        }
    },
    ...viewRoutes,
    ...createRoutes,
    ...editRoutes,
    ...searchRoutes,
    ...userRoutes,
    ...mapRoutes,
    ...modifyRoutes
]

const AppWrapper = () => {
    const location = useLocation()
    const outlet = useOutlet()

    // This can most likely be done a better way, but as every route with a component has a node ref, we can guarantee that
    // one exists, so the `as` cast is done to tell TypeScript we know what we're doing. (Do we actually? Irrelevant.)
    let nodeRef = (routes.find((route) => route.path === location.pathname) as { nodeRef: RefObject<HTMLElement | undefined> }).nodeRef

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
