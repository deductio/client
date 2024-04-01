//import rehypeKatex from "rehype-katex"
import Modal from "react-modal"
import matter from "gray-matter"
import { useMemo } from "react"
import 'katex/dist/katex.min.css' 

import { Topic, Resource } from "../../api/model"
import ResourceItem from "./ResourceItem"

import { TopicModalProps } from "./TopicModal"

import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {OnChangePlugin} from '@lexical/react/LexicalOnChangePlugin';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import TopicEditor from "./TopicEditor"

interface EditTopicModalProps extends TopicModalProps {
    saveTopic: (topic: Topic) => void
}

const EditTopicModal = (props: EditTopicModalProps) => {

        const { content, data } = useMemo(() => matter(props.topic.content), [props.topic.content])
        const resources: Resource[] = data.resources || []

        /*
         <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
            {content}
        </Markdown>
        */

        return (<Modal isOpen={true} onRequestClose={props.closeModal}>
        <h1 style={{ textAlign: "center" }}>{props.topic.title}</h1>

        <TopicEditor/>

        <h2 style={{ textAlign: "center" }}><ul>Resources</ul></h2>
        {resources.map((resource: Resource, i: number) => {
            return <ResourceItem key={i} {...resource}></ResourceItem>
        })}

        <button>Save topic!</button>
    </Modal>)
}

Modal.setAppElement("#root")

export default EditTopicModal;