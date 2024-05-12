import { useLoaderData } from "react-router-dom"
import { User } from "../api/model"
import SearchResults from "../components/search/SearchResults"
import Cookies from "js-cookie"

const UserProfile = () => {
    const user = useLoaderData() as (User | undefined)
    const currentUser = Cookies.get("name")

    if (user) {
        return <div>
            <h1 className="text-bold text-2xl">{user.user.username}</h1>

            <SearchResults results={user.graphs} mode={user.user.username === currentUser ? "edit" : "view"}/>
        </div>
    }
}

export default UserProfile;