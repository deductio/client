import { Link, Form } from "react-router-dom";
import { SearchResultGraph } from "../../api/model";
import { useState } from "react";
import ReactModal from "react-modal";
import CreateOrRenameGraph from "../graph/CreateOrRenameGraph";
import SearchResult from "./SearchResult";

const SearchResults = (props: { results: SearchResultGraph[] }) => {

    const [editing, setEditing] = useState<SearchResultGraph | null>(null)

    return <div className="bg-white rounded-lg w-1/2 m-4 p-4">
        <h1 className="font-bold text-4xl">Search results</h1>
        {props.results.map((result, i) => <SearchResult graph={result}/>)}

    <ReactModal isOpen={editing !== null} onRequestClose={() => setEditing(null)}>
        <CreateOrRenameGraph mode={editing?.id || ""} info={editing || undefined}/>
    </ReactModal>
    </div>

}

export default SearchResults;