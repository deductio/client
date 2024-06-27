import { useState, useEffect, MutableRefObject, useRef, ChangeEvent, useContext, forwardRef, ForwardedRef } from "react"
import ObjectiveRequirementList from "../objectives/ObjectiveRequirementList"
import ObjectiveSatisfierList from "../objectives/ObjectiveSatisfierList"
import { LexicalEditor } from "lexical"
import LexicalTopic from "../../../components/lexical/LexicalTopic"
import { EditContext } from "../../lib/EditState"
import { EditTopicModalProps, EditTopicModalState } from "./EditTopicModal"
import { X } from "lucide-react"

/**
 * The main UI for editing a topic, contains the Lexical rich text editor, the list of all required objectives,
 * and whether or not the current topic satisfies an objective.
 */
const TopicEditor = forwardRef((props: EditTopicModalProps & { transition: (arg0: EditTopicModalState) => void }, ref: ForwardedRef<HTMLDivElement>) => {

    const [title, setTitle] = useState(props.topic?.title || "")
    const [description, setDescription] = useState(props.topic?.description || "")
    const { dispatch } = useContext(EditContext)
    
    useEffect(() => {
        if (props.topic?.title) setTitle(props.topic.title)
        if (props.topic?.description) setDescription(props.topic.description)
    }, [props.topic?.title, props.topic?.description])

    const editor: MutableRefObject<LexicalEditor | null> = useRef<LexicalEditor | null>(null)

    const updateTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value)
    }

    return <div ref={ref}>
        {(props.topic !== null) ? 
            <>
            <X onClick={props.closeModal} className="float-right"/>
            <div className="text-center p-2">
                <input className="text-2xl text-center" type="text" value={title} onChange={updateTitle} name="title"></input>
            </div>

            <div className="flex flex-row items-center">
                <p>Description</p>
                <textarea className="grow m-2 border resize-none p-2" value={description} onChange={e => setDescription(e.target.value)}></textarea>
            </div>

            <hr className="bg-black m-4"/>

            <LexicalTopic mode="edit" state={props.topic.content === "" ? 
                '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}' 
                : props.topic.content} editorRef={editor}/>

            {
                props.topic.id === 0 
                    ? <p>In order to add objective information, please save this topic</p>
                    : <><ObjectiveRequirementList prereqs={props.objectives} transition={props.transition}/>
                        <ObjectiveSatisfierList satisfier={props.satisfier} transition={props.transition}/>
                    </>
            }

            <div className="flex flex-center justify-center p-4">
                <button className="bg-indigo-600 rounded text-white p-4" onClick={_ => {
                    dispatch({ type: 'modifyTopic', topic: {
                        ...(props.topic!),
                        title,
                        description,
                        content: JSON.stringify(editor.current?.getEditorState().toJSON()),
                    } })

                    props.closeModal()
                }}>Save topic!</button>
            </div>
            </>
            
            : <></>
        }
    </div>
})

export default TopicEditor