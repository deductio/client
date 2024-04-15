import { useLoaderData } from "react-router-dom"
import { User } from "../api/model"
import SearchResults from "../components/search/SearchResults"

const UserProfile = () => {
    const user = useLoaderData() as (User | undefined)

    if (user) {
        return <div>
            {user.username}

            <SearchResults results={user.graphs} mode="edit"/>
        </div>
    }
}

export default UserProfile;