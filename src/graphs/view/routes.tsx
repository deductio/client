import { createRef } from 'react'
import { Params } from 'react-router'
import { FullRequest, Topic } from '../../utilities/model'
import ViewGraph from './ViewGraph'

export default [{
  path: 'graph/view/:username/:name',
  element: <ViewGraph />,
  loader: async ({ params }: { params: Params<string> }) => {
    if (params.username === undefined || params.name === undefined) throw new Error('Malformed request')

    const ret = await fetch(`/api/graph/view/${params.username}/${params.name}`, { headers: { Accept: 'application/json' } })

    return await ret.json()
  },
  nodeRef: createRef()
},

{
  path: 'graph/view/:uuid',
  element: <ViewGraph />,
  loader: async ({ params }: { params: Params<string> }) => {
    if (params.uuid === undefined) throw new Error('Malformed request')

    const ret = await fetch(`/api/graph/view/${params.uuid}`, { headers: { Accept: 'application/json' } })

    return await ret.json()
  },
  nodeRef: createRef()
},

{
  path: 'graph/progress',
  action: async ({ request }: FullRequest) => {
    const { topic } = await request.json() as { topic: Topic }

    return await fetch(`/api/graph/progress/${topic.knowledge_graph_id}?topic=${topic.id}`, {
      method: request.method
    })
  }
}]
