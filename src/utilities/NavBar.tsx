import Cookies from 'js-cookie'
import { NavLink } from 'react-router-dom'

/**
 * The navigation bar displayed at the top of the page.
 */
const NavBar = (): JSX.Element => {
  const username = Cookies.get('name')
  const avatar = Cookies.get('avatar')

  return (
    <div className='w-screen inset-x-0 top-0 bg-indigo-500 flex text-white items-center justify-between'>
      <div className='p-2'>
        <NavLink to='/' className='p-2'>Home</NavLink>
        <NavLink to='/search' className='p-2'>Search</NavLink>
        <NavLink to='/trending' className='p-2'>Trending</NavLink>

        {username !== undefined
          ? (
            <>
              <NavLink to='/create' className='p-2'>Create</NavLink>
              <NavLink to='/maps' className='p-2'>Maps</NavLink>
            </>)
          : <></>}
      </div>

      <div className='p-2 scale-50 md:scale-75'>
        <p className='font-plex sans-thin-italic italic'>graph.deeve.dev</p>
      </div>

      <div className='p-2 flex items-center'>
        {
                username !== undefined
                  ? (
                    <>
                      <img src={avatar} className='w-8 h-8 rounded-md border-white border-solid border' />
                      <NavLink to={`/users/${username}`} className='p-2'>{username}</NavLink>
                      <a className='p-2' href='/api/logout'>Log out</a>
                    </>)
                  : <a className='p-2' href='/api/login/github/'>Log in / Sign up</a>
            }
      </div>
    </div>
  )
}

export default NavBar
