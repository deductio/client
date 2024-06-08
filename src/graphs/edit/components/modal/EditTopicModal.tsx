import Modal from "react-modal"
import { useRef, useState } from "react"
import 'katex/dist/katex.min.css' 
import { Objective, ObjectivePrerequisite, Topic } from "../../../../utilities/model"
import TopicEditor from "./TopicEditor"
import { CSSTransition, SwitchTransition } from "react-transition-group"
import ObjectiveSearch from "../objectives/ObjectiveSearch"
import { useFetcher } from "react-router-dom"
import ObjectiveReconciliation from "../objectives/ObjectiveReconciliation"
import ObjectiveCreation from "../objectives/ObjectiveCreation"

export type EditTopicModalState = "topic" | "prereq" | "satis" | "creation" | "reconcile"

export interface EditTopicModalProps {
    topic: Topic | null,
    objectives: ObjectivePrerequisite[],
    satisfier?: Objective,
    closeModal: () => void,
}

/**
 * The modal for editing a topic.
 * 
 * @param props - Information about the topic being edited, as well as a
 * callback to close the modal.
 */
const EditTopicModal = (props: EditTopicModalProps) => {

    const [state, setState] = useState<EditTopicModalState>("topic")
    const prereqFetcher = useFetcher()

    const topicEditorRef = useRef(null)
    const objPrereqRef = useRef(null)
    const objSatisRef = useRef(null)
    const objReconcileRef = useRef(null)
    const objCreationRef = useRef(null)

    const styles = {
        content: {
            height: "75vh"
        }
    }

    let body, mainRef;

    switch (state) {
        case "topic":
            mainRef = topicEditorRef
            body = <TopicEditor {...props} transition={setState} ref={mainRef}/>
            break;
        
        case "prereq":
            mainRef = objPrereqRef
            body = <ObjectiveSearch topic={props.topic!} mode="prereq" fetcher={prereqFetcher} ref={mainRef} reconcile={() => setState("reconcile")}/>
            break;

        case "satis":
            mainRef = objSatisRef
            body = <ObjectiveSearch mode="satisfier" topic={props.topic!} fetcher={prereqFetcher} ref={mainRef} reconcile={() => setState("topic")}/>
            break;

        case "reconcile":
            mainRef = objReconcileRef
            body = <ObjectiveReconciliation fetcher={prereqFetcher} reconcile={() => setState("topic")}/>
            break;

        case "creation":
            mainRef = objCreationRef
            body = <ObjectiveCreation finish={() => setState("topic")}/>
            break;
            
    }

    return <Modal isOpen={props.topic !== null} style={styles} onRequestClose={() => { setState("topic"); props.closeModal() }}>
        <SwitchTransition>
            <CSSTransition nodeRef={mainRef} timeout={300} classNames="main-app" key={state}>
                {body}
            </CSSTransition> 
        </SwitchTransition> 
    </Modal>
}

Modal.setAppElement("#root")

export default EditTopicModal;