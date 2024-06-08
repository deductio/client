import { useContext, useState, useEffect } from "react"
import { useFetcher } from "react-router-dom"
import { EditContext } from "../../lib/EditState"
import { Objective } from "../../../../utilities/model"

type ObjectiveCreationProps = {
    finish: () => void
}

/**
 * A UI to create an objective.
 * 
 * @param props - A function to finish creation, in which the objective is submitted and the current topic is
 * marked as a satisfier of the objective.
 */
const ObjectiveCreation = (props: ObjectiveCreationProps) => {
    
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")

    const fetcher = useFetcher()
    const { dispatch, topic } = useContext(EditContext)

    useEffect(() => {
        if (fetcher.data) {
            const data = fetcher.data as Objective

            dispatch({
                type: "addSatisfier",
                satisfier: {
                    topic: topic!,
                    objective: data
                }
            })

            props.finish()
        }

    }, [fetcher.data])

    return <div className="flex flex-col h-full">
        <h1 className="font-bold text-4xl text-center">Create an objective</h1>

        <fetcher.Form method="POST" action="/create_objective" className="flex flex-col items-center m-4 grow">
            <input type="text" name="title" className="border w-1/4 m-2" value={title} placeholder="Title..." onChange={e => setTitle(e.target.value)}></input>
            <textarea name="description" value={description} className="border m-2 w-2/3 flex-1 grow" placeholder="Description..." onChange={e => setDescription(e.target.value)}></textarea>
            <button className="rounded-lg bg-indigo-600 text-white p-2">Submit</button>
        </fetcher.Form>
    </div>

}

export default ObjectiveCreation