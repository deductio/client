//import rehypeKatex from "rehype-katex"
import Modal from "react-modal"
import { useMemo, useState, ChangeEvent } from "react"
import 'katex/dist/katex.min.css' 

import { Topic } from "../../api/model"
import ResourceItem from "./ResourceItem"

import { TopicModalProps } from "./TopicModal"


import TopicEditor from "./TopicEditor"
import { FetcherWithComponents, useFetcher } from "react-router-dom"
import { GraphReduceAction } from "../../api/graphOps"

interface EditTopicModalProps extends TopicModalProps {
    fetcher: FetcherWithComponents<any>,
    dispatch: (event: GraphReduceAction) => void
}

const EditTopicModal = (props: EditTopicModalProps) => {

    const [title, setTitle] = useState(props.topic.title)
    const [content, setContent] = useState(props.topic.content)

    const updateContent = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value)
    }

    const updateTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value)
    }

    console.log(props.topic)

    return <Modal isOpen={true} onRequestClose={props.closeModal}>
        <props.fetcher.Form method="POST" action={`graph/edit/${props.topic.knowledge_graph_id}/add_topic`}>
            <input type="hidden" name="knowledge_graph_id" value={props.topic.knowledge_graph_id}></input>
            <input type="hidden" name="id" value={props.topic.id}></input>
            <input type="hidden" name="subject" value={props.topic.subject}></input>
            <h1 style={{ textAlign: "center" }}><input type="text" value={title} onChange={updateTitle} name="title"></input></h1>
            <textarea name="content" value={content} onChange={updateContent}></textarea>

            <button onClick={() => setTimeout(() => props.dispatch({ type: "premodifyTopic" }), 0)}>Save topic!</button>
        </props.fetcher.Form>
            
    </Modal>
}

Modal.setAppElement("#root")

export default EditTopicModal;