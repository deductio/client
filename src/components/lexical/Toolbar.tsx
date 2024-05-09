import { $createCodeHighlightNode, $createCodeNode, registerCodeHighlighting } from "@lexical/code"
import { $getRoot, $createParagraphNode, $getSelection, $isRangeSelection, RangeSelection } from "lexical"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { useEffect } from "react"
import CommandHandler, { FORMAT_TEXT_COMMAND, MARKDOWN_EXPORT } from "../lexical/CommandHandler"
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from "@lexical/list"


const Toolbar = () => {
    const [editor] = useLexicalComposerContext()

    useEffect(() => {
        return registerCodeHighlighting(editor);
    }, [editor]);

    return <div className="flex flex-row divide-x divide-solid divide-gray-300">
        
        {/* Formatting functionality */}
        <div className="flex flex-row p-1">
            <a className="material-symbols-rounded" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}>
                format_bold
            </a>
            <span className="material-symbols-rounded" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}>
                format_italic
            </span>
            <span className="material-symbols-rounded" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}>
                format_underlined
            </span>
            <span className="material-symbols-rounded">
                format_strikethrough
            </span>
        </div>

        {/* Block insert functionality */}
        <div className="flex flex-row p-1">
            <span className="material-symbols-rounded">
                code
            </span>
            <span className="material-symbols-rounded">
                function
            </span>
        </div>

        {/* General text representation formatting */}
        <div className="flex flex-row p-1">
            <span className="material-symbols-rounded">
                format_size
            </span>
            <span className="material-symbols-rounded">
                format_color_text
            </span>
            <span className="material-symbols-rounded">
                format_clear
            </span>
        </div>

        {/* Structure helpers */}
        <div className="flex flex-row p-1">
            <span className="material-symbols-rounded" onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}>
                format_list_bulleted
            </span>
            <span className="material-symbols-rounded" onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}>
                format_list_numbered
            </span>
        </div>

        {/* Structure helpers */}
        <div className="flex flex-row p-1">
            <span className="material-symbols-rounded" onClick={() => editor.dispatchCommand(MARKDOWN_EXPORT, undefined)}>
                format_list_bulleted
            </span>
        </div>

    </div>
}

export default Toolbar