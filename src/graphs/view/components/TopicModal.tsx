import Modal from 'react-modal'
import 'katex/dist/katex.min.css'
import { Topic } from '../../../utilities/model'
import LexicalTopic from '../../components/lexical/LexicalTopic'
import { LexicalEditor } from 'lexical'
import { useRef } from 'react'
import { ViewGraphReduceAction } from '../lib/ViewState'
import { X } from 'lucide-react'

interface TopicModalProps {
  topic: Topic | null
  dispatch: (event: ViewGraphReduceAction) => void
  handleClose: () => void
}

const TopicModal = (props: TopicModalProps & { completed: boolean | undefined }): JSX.Element => {
  const editor = useRef<LexicalEditor>(null)

  // Weird workaround to bad Typescript narrowing, unforuntately
  let inner

  if (props.topic != null) {
    const topic = props.topic

    inner = (
      <div>
        <X onClick={props.handleClose} className='float-right' />
        <>
          <div className='text-center p-2'><h1 className='text-2xl'>{props.topic.title}</h1></div>
          <LexicalTopic
            mode='view' state={props.topic.content === ''
              ? '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}'
              : props.topic.content} editorRef={editor}
          />

          <div className='flex flex-center justify-center p-4'>
            <button
              className='bg-indigo-600 rounded text-white p-4' onClick={_ => {
                props.dispatch({ type: props.completed === true ? 'removeProgress' : 'addProgress', node: topic })
                props.handleClose()
              }}
            >{props.completed ?? false ? 'Wait, undo!' : 'I understand!'}
            </button>
          </div>
        </>
      </div>
    )
  } else {
    inner = <></>
  }

  return (
    <Modal isOpen={props.topic != null} onRequestClose={props.handleClose}>
      {inner}
    </Modal>
  )
}

Modal.setAppElement('#root')

export default TopicModal
export { type TopicModalProps }
