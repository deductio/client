/** @module deductio/edit_graph/routes */

import { Params } from 'react-router-dom'
import EditGraph from './EditGraph'
import { FullRequest, ObjectivePrerequisite, ObjectiveSatisfier, PGTopicPair, Topic } from '../../utilities/model'

export default [{
  path: 'graph/edit/:uuid',
  element: <EditGraph />,
  loader: async ({ params }: { params: Params<string> }) => {
    if (params.uuid === undefined) throw new Error('UUID is undefined')

    return await fetch(`/api/graph/edit/${params.uuid}`, { headers: { Accept: 'application/json' } })
      .then(async res => await res.json())
  },
  children: [
    {
      path: 'topic',
      action: async ({ request, params }: FullRequest) => {
        if (params.uuid === undefined) throw new Error('UUID is undefined')

        if (request.method === 'PUT') {
          const formData = Object.fromEntries(await request.formData())

          const body: {
            id: number | undefined
            knowledge_graph_id: FormDataEntryValue
            content: FormDataEntryValue
            description: FormDataEntryValue
            title: FormDataEntryValue
          } = {
            id: Number(formData.id),
            knowledge_graph_id: formData.knowledge_graph_id,
            content: formData.content,
            description: formData.description,
            title: formData.title
          }

          if (body.id === 0) delete body.id

          return await fetch(`/api/graph/edit/${params.uuid}/topic`, {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify(body)
          })
        } else if (request.method === 'DELETE') {
          const req = await request.json() as Topic
          const { id } = req

          return await fetch(`/api/graph/edit/${params.uuid}/topic?topic=${id}`, {
            method: 'DELETE'
          })
        }
      }
    },

    {
      path: 'requirement',
      action: async ({ request, params }: FullRequest) => {
        if (params.uuid === undefined) throw new Error('UUID is undefined')

        const json = await request.json() as { src: string, dest: string }

        if (request.method === 'PUT') {
          return await fetch(`/api/graph/edit/${params.uuid}/requirement`, {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify(json)
          })
        } else if (request.method === 'DELETE') {
          return await fetch(`/api/graph/edit/${params.uuid}/requirement?src=${json.src}&dest=${json.dest}`, {
            method: 'DELETE'
          })
        }
      }
    },

    {
      path: 'satis',
      action: async ({ request, params }: FullRequest) => {
        const method = request.method
        const req = await request.json()

        if (params.uuid == null) throw new Error('Bad Request')

        if (method === 'DELETE') {
          return await fetch(`/api/graph/edit/${params.uuid}/satis?topic=${(req as { node: number }).node}`, { method: 'DELETE' })
        } else {
          const objSatisReq = req as ObjectiveSatisfier

          const body = {
            knowledge_graph_id: objSatisReq.topic.knowledge_graph_id,
            topic: objSatisReq.topic.id,
            objective: objSatisReq.objective.id
          }

          return await fetch(`/api/graph/edit/${params.uuid}/satis`, {
            method: 'PUT',
            body: JSON.stringify(body)
          })
        }
      }
    },

    {
      path: 'prereq',
      action: async ({ request, params }: FullRequest) => {
        const method = request.method
        if (params.uuid == null) throw new Error('Bad Request')

        if (method === 'DELETE') {
          const req = await request.json() as { node: number, objective: number }
          return await fetch(`/api/graph/edit/${params.uuid}/prereq?topic=${req.node}&obj=${req.objective}`, { method: 'DELETE' })
        } else {
          const req = await request.json() as ObjectivePrerequisite
          return await fetch(`/api/graph/edit/${params.uuid}/prereq`, {
            method: 'PUT',
            body: JSON.stringify({ ...req, suggested_graph: req.suggested_graph.id, objective: Number(req.objective.id) })
          })
        }
      }
    }
  ]
},

{
  path: 'objectives',
  action: async ({ request }: { request: Request }) => {
    return await fetch('/api/objectives', {
      method: 'POST',
      body: await request.formData()
    })
  }
},

{
  path: 'satisfiers',
  action: async ({ request }: { request: Request }) => {
    const req = await request.formData()
    const id = req.get('id') as string

    if (id == null) throw new Error('Bad request')

    const res = await fetch(`/api/objectives/search?id=${id}`).then(async res => await res.json()) as PGTopicPair[]
    const currGraph = req.get('knowledge_graph_id')

    return {
      results: res.filter(result => result.graph.id !== currGraph),
      objective: {
        id: req.get('id'),
        title: req.get('title'),
        description: req.get('description')
      }
    }
  }
},

{
  path: 'create_objective',
  action: async ({ request }: { request: Request }) => {
    return await fetch('/api/objectives/', {
      method: 'PUT',
      body: await request.formData()
    })
  }
}]
