import { registerCodeHighlighting } from '@lexical/code'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useContext, useEffect, useState } from 'react'
import { FORMAT_TEXT_COMMAND, INSERT_MATH_COMMAND, INSERT_CODE_BLOCK_COMMAND, INSERT_IMAGE_COMMAND, INSERT_YOUTUBE_COMMAND } from './CommandHandler'
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from '@lexical/list'
import { Bold, Code, Film, ImagePlus, Italic, List, ListOrdered, SquareSigma, Strikethrough, Underline } from 'lucide-react'
import { EditContext } from '../../edit/lib/EditState'

/**
 * The toolbar for the rich text editor when editing a topic.
 */
const Toolbar = (): JSX.Element => {
  const [editor] = useLexicalComposerContext()

  const { imageDialogOpen, setImageDialogOpen, youtubeDialogOpen, setYoutubeDialogOpen } = useContext(EditContext).toolbar

  const [imageLink, setImageLink] = useState('')
  const [youtubeId, setYoutubeId] = useState('')

  // TODO
  // const [youtubeStart, setYoutubeStart] = useState<number | null>(null)
  // const [youtubeEnd, setYoutubeEnd] = useState<number | null>(null)

  useEffect(() => {
    return registerCodeHighlighting(editor)
  }, [editor])

  return (
    <div className='flex flex-row divide-x divide-solid divide-gray-300'>

      {/* Formatting functionality */}
      <div className='flex flex-row p-1'>
        <Bold onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')} />
        <Italic onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')} />
        <Underline onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')} />
        <Strikethrough onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')} />
      </div>

      {/* Block insert functionality */}
      <div className='flex flex-row p-1'>
        <Code onClick={() => editor.dispatchCommand(INSERT_CODE_BLOCK_COMMAND, undefined)} />
        <SquareSigma onClick={() => editor.dispatchCommand(INSERT_MATH_COMMAND, undefined)} />

        <div className='relative'>
          <ImagePlus onClick={() => setImageDialogOpen(true)} />
          <div className={`flex flex-col -translate-x-1/4 border border-gray-400 rounded-lg bg-white p-2 mr-2 ${imageDialogOpen ? 'absolute' : 'hidden'}`}>
            <input
              type='text'
              value={imageLink}
              onChange={e => setImageLink(e.target.value)}
              className='border border-gray-100 rounded-lg m-1'
              placeholder='Image link here...'
            />
            <button
              onClick={() => {
                editor.dispatchCommand(INSERT_IMAGE_COMMAND, imageLink)
                setImageLink('')
                setImageDialogOpen(false)
              }} className='p-1 rounded-lg text-white bg-indigo-600 text-sm m-1'
            >Add Image
            </button>
          </div>
        </div>

        <div className='relative'>
          <Film onClick={() => setYoutubeDialogOpen(true)} />
          <div className={`flex flex-col -translate-x-1/4 border border-gray-400 rounded-lg bg-white p-2 mr-2 ${youtubeDialogOpen ? 'absolute' : 'hidden'}`}>
            <div className='flex flex-row items-center'>
              <p className='text-sm whitespace-nowrap'>https://youtube.com/embed/</p>
              <input
                type='text'
                value={youtubeId}
                onChange={e => setYoutubeId(e.target.value)}
                className='border border-gray-100 rounded-lg m-1'
                placeholder='YouTube ID here...'
              />
            </div>
            <button
              onClick={() => {
                editor.dispatchCommand(INSERT_YOUTUBE_COMMAND, youtubeId)
                setYoutubeId('')
                setYoutubeDialogOpen(false)
              }} className='p-1 rounded-lg text-white bg-indigo-600 text-sm m-1'
            >Add Youtube Video
            </button>
          </div>
        </div>
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
        </div> */}

      {/* Structure helpers */}
      <div className='flex flex-row p-1'>
        <List onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)} />
        <ListOrdered onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)} />
      </div>
    </div>
  )
}

export default Toolbar
