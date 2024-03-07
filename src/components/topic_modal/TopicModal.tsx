import Markdown from "react-markdown"
import rehypeKatex from "rehype-katex"
import remarkMath from "remark-math"
import Modal from "react-modal"
import 'katex/dist/katex.min.css' 

import { Resource, Topic } from "../../api/model"
import ResourceItem from "./ResourceItem"

interface TopicModalProps {
    topic: Topic,
    resources: Resource[],
    opened: boolean,
    closeModal: () => void
}

const TopicModal = (props: TopicModalProps) => {
        return (<Modal isOpen={props.opened} onRequestClose={props.closeModal}>
        <h1 style={{ textAlign: "center" }}>{props.topic.title}</h1>

        <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
            {props.topic.content}
        </Markdown>

        <h2 style={{ textAlign: "center" }}>Resources</h2>
        {props.resources.map((resource, i) => {
            return <ResourceItem key={i} {...resource}></ResourceItem>
        })}
    </Modal>)
}

Modal.setAppElement("#root")

export default TopicModal;