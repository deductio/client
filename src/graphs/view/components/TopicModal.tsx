import Modal from "react-modal"
import 'katex/dist/katex.min.css' 
import { Topic } from "../../../utilities/model"
import LexicalTopic from "../../components/lexical/LexicalTopic"
import { LexicalEditor } from "lexical"
import { useRef } from "react"
import { ViewGraphReduceAction } from "../lib/ViewState"
import { X } from "lucide-react"

interface TopicModalProps {
    topic: Topic | null,
    dispatch: (event: ViewGraphReduceAction) => void
    closeModal: () => void,
}

const TopicModal = (props: TopicModalProps & { completed: boolean | undefined }) => {

        const editor = useRef<LexicalEditor>(null)

        return <Modal isOpen={props.topic !== null} onRequestClose={props.closeModal}>
            <div>
                <X onClick={props.closeModal} className="float-right"/>
                {(props.topic !== null) ? 
                    <><div className="text-center p-2"><h1 className="text-2xl">{props.topic.title}</h1></div>
                <LexicalTopic mode="view" state={props.topic.content === "" ? 
                        '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}' 
                        : props.topic.content} editorRef={editor}/>
        
                    <div className="flex flex-center justify-center p-4">
                        <button className="bg-indigo-600 rounded text-white p-4" onClick={_ => {
                            props.dispatch({ type: props.completed ? "removeProgress" : "addProgress", node: props.topic! })
                            props.closeModal()
                        }}>{props.completed ? "Wait, undo!" : "I understand!"}</button>
                    </div>
                    </>
                    
                    : <></>
                }
            </div>
        </Modal>
}

Modal.setAppElement("#root")

export default TopicModal;
export { type TopicModalProps };