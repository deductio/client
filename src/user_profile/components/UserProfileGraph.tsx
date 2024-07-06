import { Link } from "react-router-dom";
import { SearchResultGraph } from "../../utilities/model";

const UserProfileGraph = ({ graph }: { graph: SearchResultGraph }) => {
    return <div className="m-4">
        <Link to={`/graph/configure/${graph.id}`} className="float-right">
            <button type="submit" className="text-sm bg-white rounded text-indigo-600 border-indigo-600 p-1 border">
                Edit Graph
            </button>
        </Link>

        <h2 className="font-semibold text-2xl"><Link to={`/graph/view/${graph.id}`}>{graph.name}</Link></h2>

        <i className="flex flex-row">by <Link className="flex flex-row mx-1" to={`/users/${graph.user.username}`}>
            <img className="h-4 rounded-2xl place-self-center mx-0.5" src={graph.user.avatar}></img>
            <p className="font-normal">{graph.user.username}</p>
        </Link></i>

        <p className="indent-4 m-2">{graph.description}</p>

        
    </div>
}

export default UserProfileGraph;