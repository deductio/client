import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { 
    createCommand, LexicalCommand, TextFormatType, COMMAND_PRIORITY_EDITOR, COMMAND_PRIORITY_HIGH, 
    $getSelection, $isRangeSelection, RangeSelection, $getRoot, $insertNodes, CLICK_COMMAND
} from "lexical"
import { TRANSFORMERS, $convertToMarkdownString } from "@lexical/markdown"
import { mergeRegister } from "@lexical/utils"
import { useEffect } from "react"
import { $createEquationNode } from "./EquationNode"
import { $createCodeNode } from "@lexical/code"

const FORMAT_TEXT_COMMAND: LexicalCommand<TextFormatType> = createCommand()

const MARKDOWN_EXPORT: LexicalCommand<void> = createCommand()

const INSERT_MATH_COMMAND: LexicalCommand<void> = createCommand()

const INSERT_CODE_BLOCK_COMMAND: LexicalCommand<void> = createCommand()

const CommandHandler = () => {
    const [editor] = useLexicalComposerContext()

    useEffect(() => {
        return mergeRegister(
            editor.registerCommand(FORMAT_TEXT_COMMAND, type => {

                const selection = $getSelection() as RangeSelection
        
                if ($isRangeSelection(selection)) {
                    selection.formatText(type)
                }
        
                return true
            }, COMMAND_PRIORITY_EDITOR),

            editor.registerCommand(MARKDOWN_EXPORT, _ => {

                const markdown = $convertToMarkdownString(TRANSFORMERS)

                console.log(markdown)
                
                return true
            }, COMMAND_PRIORITY_HIGH),

            editor.registerCommand(INSERT_MATH_COMMAND, () => {

                const equation = $createEquationNode("x+1", false)
                $insertNodes([equation])

                return true
            }, COMMAND_PRIORITY_EDITOR),

            editor.registerCommand(INSERT_CODE_BLOCK_COMMAND, () => {

                const code = $createCodeNode()
                $insertNodes([code])

                return true
            }, COMMAND_PRIORITY_EDITOR)
        )
    }, [editor])


    return null
}

export default CommandHandler

export { FORMAT_TEXT_COMMAND, MARKDOWN_EXPORT, INSERT_MATH_COMMAND, INSERT_CODE_BLOCK_COMMAND }