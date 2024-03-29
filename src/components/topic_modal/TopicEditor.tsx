import { ListItemNode, ListNode } from "@lexical/list"
import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { ListPlugin } from "@lexical/react/LexicalListPlugin"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"

const TopicEditor = () => {
    const initialConfig = {
        namespace: 'MyEditor',
        onError: (e) => {console.log(e)},
        nodes: [
            ListNode,
            ListItemNode
        ]
    };

    return (
        <LexicalComposer initialConfig={initialConfig}>
        <RichTextPlugin
            contentEditable={<ContentEditable />}
            placeholder={<div>Enter some text...</div>}
            ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <ListPlugin/>
        </LexicalComposer>
    )
}

export default TopicEditor;