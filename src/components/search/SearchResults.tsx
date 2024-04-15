import { Link } from "react-router-dom";
import { SearchResultGraph } from "../../api/model";

const SearchResults = (props: { results: SearchResultGraph[], mode: "view" | "edit" }) => {
    return <div className="bg-white rounded-lg w-50 h-50">
        {props.results.map(result => {
            return <div>
                <h1><Link to={`/graph/${props.mode}/${result.id}`}>{result.name}</Link></h1>

                <p>{result.description}</p>
            </div>
        })}
    </div>
}

export default SearchResults;