import { useLoaderData } from "react-router-dom";
import { PreviewGraph } from "../utilities/model";
import { useState } from "react";
import SmallForm from "../utilities/SmallForm";

const EditGraphData = () => {

    const graph = useLoaderData() as PreviewGraph

    const [name, setName] = useState(graph?.name)
    const [description, setDescription] = useState(graph?.description)

    if (!graph) return <></>

    return <div className="bg-indigo-100 h-screen flex items-center justify-center">
        <SmallForm action={`/graph/configure/${graph.id}`}>
            <h1 className="font-bold text-4xl">Create a graph</h1>

            <div className="grid grid-cols-2 items-center">
                <p className="justify-self-center text-xl font-extralight">Graph name</p>
                <input type="text" placeholder="Graph name" onChange={e => setName(e.target.value)} value={name} name="name" className="border rounded-lg m-2"></input>

                <p className="justify-self-center text-xl font-extralight">Description</p>
                <textarea className="border rounded-lg m-2 h-32 resize-none" onChange={e => setDescription(e.target.value)} value={description} name="description"></textarea>

            </div>

            <div className="flex justify-around">
                <button type="submit" name="method" value="save" 
                    className="text-sm text-indigo-600 border-indigo-600 border rounded p-1">

                    Save graph
                </button>
                <button type="submit" name="method" value="delete" 
                    className="text-sm text-enginorange border-enginorange border rounded p-1">

                    Delete graph
                </button>
                <button type="submit" name="method" value="modify" 
                    className="text-sm text-indigo-900 border-indigo-900 border rounded p-1">
                        
                    Modify graph
                </button>
            </div>
        </SmallForm>
    </div>
}

export default EditGraphData;