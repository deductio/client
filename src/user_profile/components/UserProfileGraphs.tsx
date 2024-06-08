import { SearchResultGraph } from "../../utilities/model";
import SearchResult from "../../search_graph/components/SearchResult";
import UserProfileGraph from "./UserProfileGraph";

type UserProfileGraphsProps = {
    graphs: SearchResultGraph[],
    self: boolean
}

const UserProfileGraphs = ({ graphs, self }: UserProfileGraphsProps) => {
    return <div className="bg-white rounded-lg w-1/2 m-4 p-4">
        {graphs.map(result => self ? <UserProfileGraph graph={result}/> : <SearchResult graph={result}/>)}
    </div>
}

export default UserProfileGraphs;