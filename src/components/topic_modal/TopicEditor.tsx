import { useState, useEffect, MutableRefObject, useRef, ChangeEvent, useContext, forwardRef, ForwardedRef } from "react"
import ObjectiveRequirementList from "./ObjectiveRequirementList"
import ObjectiveSatisfierList from "./ObjectiveSatisfierList"
import { LexicalEditor } from "lexical"
import LexicalTopic from "../lexical/LexicalTopic"
import { EditContext } from "../../api/graphOps"
import { EditTopicModalProps, EditTopicModalState } from "./EditTopicModal"

const TopicEditor = forwardRef((props: EditTopicModalProps & { transition: (arg0: EditTopicModalState) => void }, ref: ForwardedRef<HTMLDivElement>) => {

    const [title, setTitle] = useState(props.topic?.title || "")
    const { dispatch } = useContext(EditContext)
    
    useEffect(() => {
        if (props.topic?.title) setTitle(props.topic.title)
    }, [props.topic?.title])

    const editor: MutableRefObject<LexicalEditor | null> = useRef<LexicalEditor | null>(null)

    const updateTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value)
    }

    return <div ref={ref}>
        {(props.topic !== null) ? 
            <>
            <span className="material-symbols-rounded float-right" onClick={props.closeModal}>close</span>
            <div className="text-center p-2">
                <input className="text-2xl text-center" type="text" value={title} onChange={updateTitle} name="title"></input>
            </div>

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