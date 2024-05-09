import { Link, Form } from "react-router-dom";
import { KnowledgeGraph, SearchResultGraph } from "../../api/model";
import { useState } from "react";
import ReactModal from "react-modal";
import CreateOrRenameGraph from "../graph/CreateOrRenameGraph";

const SearchResults = (props: { results: SearchResultGraph[], mode: "view" | "edit" }) => {

    const [editing, setEditing] = useState<SearchResultGraph | null>(null)

    return <div className="bg-white rounded-lg w-1/2 m-4 p-4">
        {props.mode === "view" ? <h1 className="font-bold text-4xl">Search results</h1> : <></>}
        {props.results.map((result, i) => {
            return <div className="m-4" key={i}>
                <h2  className="font-semibold text-2xl"><Link to={`/graph/${props.mode}/${result.id}`}>{result.name}</Link></h2>
                <i>by <Link to={`/users/${result.author}`}>{result.author}</Link></i>

                <p className="indent-4 m-2">{result.description}</p>

                {props.mode === "edit" ? <>
                    <div className="flex flex-row">
                        <button className="bg-indigo-600 rounded text-white p-2 m-2" onClick={editing ? () => setEditing(null) : () => setEditing(result)}>
                            Edit Graph
                        </button>
                        <Form action={`/graph/delete/${result.id}`} method="POST"><button className="m-2 bg-indigo-600 rounded text-white p-2">Delete Graph</button></Form>
                    </div>
                </> : <></>}
            </div>
        })}

    <ReactModal isOpen={editing !== null} onRequestClose={() => setEditing(null)}>
        <CreateOrRenameGraph mode={editing?.id || ""} info={editing || undefined}/>
    </ReactModal>
    </div>

}

export default SearchResults;