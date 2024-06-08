import { registerCodeHighlighting } from "@lexical/code"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { useEffect } from "react"
import { FORMAT_TEXT_COMMAND, INSERT_MATH_COMMAND, INSERT_CODE_BLOCK_COMMAND } from "./CommandHandler"
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from "@lexical/list"

/**
 * The toolbar for the rich text editor when editing a topic.
 */
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
            <span className="material-symbols-rounded" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")}>
                format_strikethrough
            </span>
        </div>


        {/* Block insert functionality */}
        <div className="flex flex-row p-1">
            <span className="material-symbols-rounded" onClick={() => editor.dispatchCommand(INSERT_CODE_BLOCK_COMMAND, undefined)}>
                code
            </span>
            <span className="material-symbols-rounded" onClick={() => editor.dispatchCommand(INSERT_MATH_COMMAND, undefined)}>
                function
            </span>
        </div>

        {/* General text representation formatting 
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
        </div>*/}

        {/* Structure helpers */}
        <div className="flex flex-row p-1">
            <span className="material-symbols-rounded" onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}>
                format_list_bulleted
            </span>
            <span className="material-symbols-rounded" onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}>
                format_list_numbered
            </span>
        </div>


    </div>
}

export default Toolbar