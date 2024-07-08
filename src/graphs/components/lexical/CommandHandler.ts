import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  createCommand, TextFormatType, COMMAND_PRIORITY_EDITOR, COMMAND_PRIORITY_HIGH,
  $getSelection, $isRangeSelection, RangeSelection, $insertNodes
} from 'lexical'
import { TRANSFORMERS, $convertToMarkdownString } from '@lexical/markdown'
import { mergeRegister } from '@lexical/utils'
import { useEffect } from 'react'
import { $createEquationNode } from './EquationNode'
import { $createCodeNode } from '@lexical/code'
import { $createImageNode } from './ImageNode'
import { $createYoutubeNode } from './YoutubeNode'

export const FORMAT_TEXT_COMMAND = createCommand<TextFormatType>()

export const MARKDOWN_EXPORT = createCommand()

export const INSERT_MATH_COMMAND = createCommand()

export const INSERT_CODE_BLOCK_COMMAND = createCommand()

export const INSERT_IMAGE_COMMAND = createCommand<string>()

export const INSERT_YOUTUBE_COMMAND = createCommand<string>()

/**
 * A Lexical React plugin that handles events relating to text input
 * and toolbar interactions, such as importing markdown and formatting
 * text.
 */
const CommandHandler = (): null => {
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
        const equation = $createEquationNode('x+1', false)
        $insertNodes([equation])

        return true
      }, COMMAND_PRIORITY_EDITOR),

      editor.registerCommand(INSERT_CODE_BLOCK_COMMAND, () => {
        const code = $createCodeNode()
        $insertNodes([code])

        return true
      }, COMMAND_PRIORITY_EDITOR),

      editor.registerCommand(INSERT_IMAGE_COMMAND, link => {
        const image = $createImageNode(link, 0)
        $insertNodes([image])

        return true
      }, COMMAND_PRIORITY_EDITOR),

      editor.registerCommand(INSERT_YOUTUBE_COMMAND, id => {
        const yt = $createYoutubeNode(id, undefined, undefined)
        $insertNodes([yt])

        return true
      }, COMMAND_PRIORITY_EDITOR)
    )
  }, [editor])

  return null
}

export default CommandHandler
