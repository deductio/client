import { createRef } from 'react'
import { Params } from 'react-router'
import UserProfile from './UserProfile'

export default [{
  path: 'users/:user',
  element: <UserProfile />,
  loader: async ({ params }: { params: Params<string> }) => {
    if (params.user == null) throw new Error('Bad request')

    return await fetch(`/api/users/${params.user}`, { headers: { Accept: 'application/json' } })
      .then(async (res) => await res.json())
  },
  nodeRef: createRef()
}]
