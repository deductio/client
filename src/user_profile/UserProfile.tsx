import { useLoaderData } from 'react-router-dom'
import { User } from '../utilities/model'
import Cookies from 'js-cookie'
import UserProfileGraphs from './components/UserProfileGraphs'

const UserProfile = (): JSX.Element => {
  const user = useLoaderData() as (User | undefined)
  const currentUser = Cookies.get('name')

  if (user != null) {
    return (
      <div>
        <h1 className='text-bold text-2xl'>{user.user.username}</h1>

        <UserProfileGraphs graphs={user.graphs} self={user.user.username === currentUser} />
      </div>
    )
  } else {
    return <></>
  }
}

export default UserProfile
