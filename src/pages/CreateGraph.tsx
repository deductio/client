import SmallForm from "../components/utilities/SmallForm";

const CreateGraph = () => {

    return <div className="bg-indigo-100 h-screen flex items-center justify-center">
        <SmallForm action="/graph/create">
            <h1 className="font-bold text-4xl">Create a graph</h1>

            <div className="grid grid-cols-2 items-center">
                <p className="justify-self-center text-xl font-extralight">Graph name</p>
                <input type="text" placeholder="Graph name" name="name" className="border rounded-lg m-2"></input>

                <p className="justify-self-center text-xl font-extralight">Description</p>
                <textarea className="border rounded-lg m-2 h-32 resize-none" name="description"></textarea>

            </div>

            <div className="flex justify-center">
                <button className="bg-indigo-600 rounded text-white p-4">
                    Make your graph <i className="bi bi-arrow-right"></i>
                </button>
            </div>
        </SmallForm>
    </div>
}

export default CreateGraph;