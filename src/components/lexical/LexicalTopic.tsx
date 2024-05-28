import { ListItemNode, ListNode } from "@lexical/list"
import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { ListPlugin } from "@lexical/react/LexicalListPlugin"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { CodeHighlightNode, CodeNode } from "@lexical/code"
import { HeadingNode, QuoteNode } from "@lexical/rich-text"
import { LinkNode } from "@lexical/link"
import { TRANSFORMERS } from "@lexical/markdown"
import Toolbar from "./Toolbar"
import CommandHandler from "./CommandHandler"
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin"
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode"
import { LexicalEditor } from "lexical"
import { MutableRefObject } from "react"
import { EditorRefPlugin } from "@lexical/react/LexicalEditorRefPlugin"
import THEME from "./theme"
import { EquationNode } from "./EquationNode"

const LexicalTopic = ({ state, editorRef, mode }: { state: string, editorRef: MutableRefObject<LexicalEditor | null>, mode: "view" | "edit" }) => {
    const initialConfig = {
        namespace: 'MyEditor',
        onError: (e: any) => {console.log(e)},
        nodes: [
            ListNode,
            ListItemNode,
            CodeHighlightNode,
            CodeNode,
            HorizontalRuleNode,
            HeadingNode,
            QuoteNode,
            LinkNode,
            EquationNode,
        ],
        editable: mode === "edit",
        editorState: state,
        theme: THEME
    };

    return (
        <div className={mode === "edit" ? "divide-y divide-gray-300 border border-gray-300 rounded" : ""}>
          <LexicalComposer initialConfig={initialConfig}>
              {
                mode == "edit" ? <><EditorRefPlugin editorRef={editorRef}/>
                <Toolbar/>
                <CommandHandler/>
                <HistoryPlugin />
                <MarkdownShortcutPlugin transformers={TRANSFORMERS} /></>
                : <></>
              }
              <ListPlugin/>
              <div className="p-4 outline-none">
                <RichTextPlugin
                  contentEditable={<ContentEditable />}
                  placeholder={<></>}
                  ErrorBoundary={LexicalErrorBoundary}/>
              </div>
              
          </LexicalComposer>
        </div>
    )
}

export default LexicalTopic;