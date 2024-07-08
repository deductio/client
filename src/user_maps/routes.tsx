import { createRef } from 'react'
import { Params } from 'react-router'
import ViewGraph from '../graphs/view/ViewGraph'
import UserMaps from './UserMaps'

export default [{
  path: 'maps',
  loader: async () => {
    return await fetch('/api/maps').then(async res => await res.json())
  },
  element: <UserMaps />,
  nodeRef: createRef()
},

{
  path: 'map/:id',
  loader: async ({ params }: { params: Params<string> }) => {
    if (params.id == null) throw new Error('Bad request')

    return await fetch(`/api/maps/${params.id}`).then(async res => await res.json())
  },
  element: <ViewGraph />,
  nodeRef: createRef()
}]
