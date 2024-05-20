//import rehypeKatex from "rehype-katex"
import Modal from "react-modal"
import { useState, ChangeEvent, useRef, MutableRefObject, useEffect } from "react"
import { LexicalEditor } from "lexical"
import 'katex/dist/katex.min.css' 
import { TopicModalProps } from "./TopicModal"
import TopicViewer from "../lexical/LexicalTopic"

const EditTopicModal = (props: TopicModalProps) => {

    const [title, setTitle] = useState(props.topic?.title || "")

    const styles = {
        content: {
            height: "75vh"
        }
    }

    useEffect(() => {
        if (props.topic?.title) setTitle(props.topic.title)
    }, [props.topic?.title])

    const editor: MutableRefObject<LexicalEditor | null> = useRef<LexicalEditor | null>(null)

    const updateTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value)
    }

    return <Modal isOpen={props.topic !== null} style={styles} onRequestClose={props.closeModal}>
        <div>
            {(props.topic !== null) ? 
                <>
                <span className="material-symbols-rounded float-right" onClick={props.closeModal}>close</span>
                <div className="text-center p-2"><input className="text-2xl text-center" type="text" value={title} onChange={updateTitle} name="title"></input></div>
                <TopicViewer mode="edit" state={props.topic.content === "" ? 
                    '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}' 
                    : props.topic.content} editorRef={editor}/>
    
                <div className="flex flex-center justify-center p-4">
                    <button className="bg-indigo-600 rounded text-white p-4" onClick={_ => {
                        props.dispatch({ type: 'modifyTopic', topic: {
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
            
    </Modal>
}

Modal.setAppElement("#root")

export default EditTopicModal;