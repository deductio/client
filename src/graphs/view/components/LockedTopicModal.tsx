import Modal from "react-modal"
import { Topic } from "../../../utilities/model"

type LockedTopicModalProps = {
    topic: Topic | null,
    closeModal: () => void
}

const LockedTopicModal = (props: LockedTopicModalProps) => {
    return <Modal isOpen={props.topic != null} onRequestClose={props.closeModal}>
        <div className="text-center p-2"><h1 className="font-extrabold text-6xl">Woah there!</h1></div>
        <p className="text-xl">It looks like you haven't met all the requirements yet to dive into this topic. </p>
        <div className="text-xl flex flex-row">
            <p>If you'd like to jump straight in and ignore prior progress, you can</p> 
            <button className="border rounded-lg bg-indigo-500 text-white mx-2 p-1 text-sm">Preview this Topic</button> 
            <p> or, if you'd like to go through the requirements for this topic, you can </p> 
            <button className="border rounded-lg bg-indigo-900 text-white mx-2 p-1 text-sm">Add to Learning Graph</button>
        </div>
    </Modal>
}

export default LockedTopicModal