import { createRef } from 'react'
import { redirect } from 'react-router'
import CreateGraph from './CreateGraph'
import { PreviewGraph } from '../utilities/model'

export default [{
  path: 'create',
  element: <CreateGraph />,
  action: async ({ request }: { request: Request }) => {
    const res = await fetch('/api/graph/create', {
      method: 'POST',
      body: await request.formData()
    })

    if (res.ok) {
      const body = await res.json() as PreviewGraph
      return redirect(`/graph/edit/${body.id}`)
    } else {
      return res
    }
  },
  nodeRef: createRef()
}]
