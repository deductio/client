import './App.css'
import { createBrowserRouter, Outlet, redirect, RouterProvider } from "react-router-dom";
import SearchGraph from './pages/SearchGraph';
import NavBar from './components/NavBar';
import CreateGraph from './pages/CreateGraph';
import UserProfile from './pages/UserProfile';
import EditGraph from './pages/EditGraph';
import ViewGraph from './pages/ViewGraph';
import { Topic } from './api/model';

const NavBarWrapper = () => {
  return <>
    <NavBar/>
    <Outlet/>
  </>
}


const router = createBrowserRouter([{
  path: "/",
  element: <NavBarWrapper/>,
  children: [
    {
    path: "/",
    element: <p>hello wah</p>
  },

  {
    path: "graph/view/:username/:name",
    element: <ViewGraph/>,
    loader: async ({ params }) => {
      return fetch(`/graph/view/${params.username}/${params.name}`, { headers: { "Accept": "application/json" } })
        .then(res => res.json())
    }
  },

  {
    path: "graph/view/:uuid",
    element: <ViewGraph/>,
    loader: async ({ params }) => {
      return fetch(`/graph/view/${params.uuid}`, { headers: { "Accept": "application/json" } })
        .then(res => res.json())
    }
  },

  {
    path: "graph/edit/:uuid",
    element: <EditGraph/>,
    loader: async ({ params }) => {
      return fetch(`/graph/view/${params.uuid}`, { headers: { "Accept": "application/json" } })
        .then(res => res.json())
    },
    children: [
      {
        path: "graph/edit/:uuid/add_topic",
        action: async ({ request, params }) => {

          let form_data = Object.fromEntries(await request.formData())
          
          let body = {
            id: Number(form_data.id),
            knowledge_graph_id: form_data.knowledge_graph_id,
            content: form_data.content,
            subject: form_data.subject,
            title: form_data.title
          }

          return fetch(`/graph/edit/${params.uuid}/topic`, {
            headers: { 
              "Accept": "application/json",
              "Content-Type": "application/json"
            },
            method: "PUT",
            body: JSON.stringify(body)
          })
        }
      },

      {
        path: "graph/edit/:uuid/add_requirement",
        action: async ({ request, params }) => {
          return fetch(`/graph/edit/${params.uuid}/requirement`, {
            headers: { 
              "Accept": "application/json",
              "Content-Type": "application/json"
            },
            method: "PUT",
            body: JSON.stringify(await request.json())
          })
        }
      },

      {
        path: "graph/edit/:uuid/delete_topic",
        action: async ({ request, params }) => {
          const req = await request.json()
          const { id } = req

          return fetch(`/graph/edit/${params.uuid}/topic?topic=${id}`, {
            method: "DELETE"
          })
        }
      },

      {
        path: "graph/edit/:uuid/delete_requirement",
        action: async ({ request, params }) => {
          const { id } = await request.json()

          return fetch(`/graph/edit/${params.uuid}/requirement?requirement=${id}`, {
            method: "DELETE"
          })
        }
      }
    ]
  },

  {
    path: "graph/create",
    element: <CreateGraph/>,
    action: async ({ params, request }) => {
      let res = await fetch("/graph/create", {
        method: "POST",
        body: await request.formData()
      })

      if (res.ok) {
        const body = await res.json()
        return redirect(`/graph/edit/${body.id}`)
      } else {
        console.log("what happened?", res)
        return res
      }
    }
  },

  {
    path: "search",
    element: <SearchGraph/>,
    action: async ({ params, request }) => {
      let res = await fetch("/search", {
        method: "POST",
        body: await request.formData()
      })

      if (res.ok) {
        return res
      } else {
        console.log("what happened?", res)
        return res
      }
    }
  },
  
  {
    path: "users/:user",
    element: <UserProfile/>,
    loader: async ({ params }) => {
      return fetch(`/users/${params.user}`, { headers: { "Accept": "application/json" } })
        .then(res => res.json())
    }
  }
  ]

}])


function App() {
  return <div className="h-screen w-screen">
    <RouterProvider router={router}/>
  </div>
}

export default App
