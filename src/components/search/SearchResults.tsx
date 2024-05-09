import { Link } from "react-router-dom";
import { SearchResultGraph } from "../../api/model";

const SearchResults = (props: { results: SearchResultGraph[], mode: "view" | "edit" }) => {
    return <div className="bg-white rounded-lg w-1/2 m-4 p-4">
        <h1 className="font-bold text-4xl">Search results</h1>
        {props.results.map((result, i) => {
            return <div className="m-4" key={i}>
                <h2 className="font-semibold text-2xl"><Link to={`/graph/${props.mode}/${result.id}`}>{result.name}</Link></h2>
                <i>by <Link to={`/users/${result.author}`}>{result.author}</Link></i>

                <p className="indent-4 m-2">{result.description}</p>
            </div>
        })}
    </div>
}

export default SearchResults;