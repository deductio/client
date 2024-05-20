import { useLoaderData } from "react-router-dom"
import { User } from "../api/model"
import Cookies from "js-cookie"
import UserProfileGraphs from "../components/user/UserProfileGraphs"

const UserProfile = () => {
    const user = useLoaderData() as (User | undefined)
    const currentUser = Cookies.get("name")

    if (user) {
        return <div>
            <h1 className="text-bold text-2xl">{user.user.username}</h1>

            <UserProfileGraphs graphs={user.graphs} self={user.user.username === currentUser}/>
        </div>
    }
}

export default UserProfile;