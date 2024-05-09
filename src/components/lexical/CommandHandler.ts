import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { createCommand, LexicalCommand, TextFormatType, COMMAND_PRIORITY_NORMAL, COMMAND_PRIORITY_HIGH, $getSelection, $isRangeSelection, RangeSelection } from "lexical"
import { TRANSFORMERS, $convertToMarkdownString } from "@lexical/markdown"
import { mergeRegister } from "@lexical/utils"
import { useEffect } from "react"

const FORMAT_TEXT_COMMAND: LexicalCommand<TextFormatType> = createCommand()

const MARKDOWN_EXPORT: LexicalCommand<void> = createCommand()

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
            }, COMMAND_PRIORITY_NORMAL),

            editor.registerCommand(MARKDOWN_EXPORT, _ => {

                const markdown = $convertToMarkdownString(TRANSFORMERS)

                console.log(markdown)
                
                return true
            }, COMMAND_PRIORITY_HIGH)
        )
    }, [editor])


    return null
}

export default CommandHandler

export { FORMAT_TEXT_COMMAND, MARKDOWN_EXPORT }