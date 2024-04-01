
//import rehypeKatex from "rehype-katex"
import remarkMath from "remark-math"
import Modal from "react-modal"
import matter, { GrayMatterFile, Input } from "gray-matter"
import { useMemo } from "react"
import 'katex/dist/katex.min.css' 

import { Topic, Resource } from "../../api/model"
import ResourceItem from "./ResourceItem"

interface TopicModalProps {
    topic: Topic,
    closeModal: () => void
}


const TopicModal = (props: TopicModalProps) => {

        const { content, data } = useMemo(() => matter(props.topic.content), [props.topic.content])
        const resources: Resource[] = data.resources || []

        /*
         <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
            {content}
        </Markdown>
        */

        return (<Modal isOpen={true} onRequestClose={props.closeModal}>
        <h1 style={{ textAlign: "center" }}>{props.topic.title}</h1>

        <h2 style={{ textAlign: "center" }}><ul>Resources</ul></h2>
        {resources.map((resource: Resource, i: number) => {
            return <ResourceItem key={i} {...resource}></ResourceItem>
        })}
    </Modal>)
}

Modal.setAppElement("#root")

export default TopicModal;
export { type TopicModalProps };