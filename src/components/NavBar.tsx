import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const NavBar = () => {
    const username = Cookies.get("name")
    const avatar = Cookies.get("avatar")

    return <div className="w-screen inset-x-0 top-0 bg-indigo-500 flex text-white items-center justify-between">
        <div className="p-2">
            <Link to="/" className="p-2">Home</Link>
            <Link to="/search" className="p-2">Search</Link>
            <Link to="/graph/create" className="p-2">Create</Link>
        </div>

        <div className="p-2 scale-75">
            <p className="font-plex sans-thin-italic italic">graph.deeve.dev</p>
        </div>

        <div className="p-2 flex items-center">
            {
                username ?
                    <>
                        <img src={avatar} className="w-8 h-8 rounded-md border-white border-solid border"/>
                        <Link to={`/users/${username}`} className="p-2">{username}</Link>
                        <a className="p-2" href="/logout">Log out</a>
                    </> :
                    <a className="p-2" href="/login/github/">Log in / Sign up</a>
            }
        </div>
    </div>
}

export default NavBar