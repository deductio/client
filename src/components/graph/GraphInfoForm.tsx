type GraphInfoFormProps = {
    name: string,
    setName: (arg0: string) => void,
    description: string,
    setDescription: (arg0: string) => void
}

const GraphInfoForm = (props: GraphInfoFormProps) => {
    return <div className="grid grid-cols-2 items-center">
        <p className="justify-self-center text-xl font-extralight">Graph name</p>
        <input 
            type="text" 
            placeholder="Graph name" 
            onChange={e => props.setName(e.target.value)} 
            value={props.name} name="name" 
            className="border rounded-lg m-2">
        </input>

        <p className="justify-self-center text-xl font-extralight">Description</p>
        <textarea 
            className="border rounded-lg m-2 h-32 resize-none" 
            onChange={e => props.setDescription(e.target.value)} 
            value={props.description} 
            name="description">
        </textarea>

    </div>
}

export default GraphInfoForm;