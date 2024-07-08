import Modal from 'react-modal'
import { useContext, useRef, useState } from 'react'
import 'katex/dist/katex.min.css'
import { Objective, ObjectivePrerequisite, Topic } from '../../../../utilities/model'
import TopicEditor from './TopicEditor'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import ObjectiveSearch from '../objectives/ObjectiveSearch'
import { useFetcher } from 'react-router-dom'
import ObjectiveReconciliation from '../objectives/ObjectiveReconciliation'
import ObjectiveCreation from '../objectives/ObjectiveCreation'
import { EditContext } from '../../lib/EditState'

export type EditTopicModalState = 'topic' | 'prereq' | 'satis' | 'creation' | 'reconcile'

export interface EditTopicModalProps {
  topic: Topic | null
  objectives: ObjectivePrerequisite[]
  satisfier?: Objective
  handleClose: (arg0: boolean) => void
}

/**
 * The modal for editing a topic.
 *
 * @param props - Information about the topic being edited, as well as a
 * callback to close the modal.
 */
const EditTopicModal = (props: EditTopicModalProps): JSX.Element => {
  const [state, setState] = useState<EditTopicModalState>('topic')
  const prereqFetcher = useFetcher()

  const { imageDialogOpen, setImageDialogOpen, youtubeDialogOpen, setYoutubeDialogOpen } = useContext(EditContext).toolbar

  const topicEditorRef = useRef(null)
  const objPrereqRef = useRef(null)
  const objSatisRef = useRef(null)
  const objReconcileRef = useRef(null)
  const objCreationRef = useRef(null)

  const styles = {
    content: {
      height: '75vh'
    }
  }

  let body, mainRef

  switch (state) {
    case 'topic':
      mainRef = topicEditorRef
      body = <TopicEditor {...props} transition={setState} ref={mainRef} />
      break

    case 'prereq':
      mainRef = objPrereqRef
      body = props.topic !== null ? <ObjectiveSearch topic={props.topic} mode='prereq' fetcher={prereqFetcher} ref={mainRef} reconcile={() => setState('reconcile')} /> : <></>
      break

    case 'satis':
      mainRef = objSatisRef
      body = props.topic !== null ? <ObjectiveSearch mode='satisfier' topic={props.topic} fetcher={prereqFetcher} ref={mainRef} reconcile={() => setState('topic')} /> : <></>
      break

    case 'reconcile':
      mainRef = objReconcileRef
      body = <ObjectiveReconciliation fetcher={prereqFetcher} reconcile={() => setState('topic')} />
      break

    case 'creation':
      mainRef = objCreationRef
      body = <ObjectiveCreation finish={() => setState('topic')} />
      break
  }

  return (
    <Modal
      isOpen={props.topic !== null} style={styles} onRequestClose={e => {
        if ('keyCode' in e && (youtubeDialogOpen || imageDialogOpen)) {
          setImageDialogOpen(false)
          setYoutubeDialogOpen(false)
        } else {
          setState('topic')
          props.handleClose(false)
        }
      }}
    >
      <SwitchTransition>
        <CSSTransition nodeRef={mainRef} timeout={300} classNames='main-app' key={state}>
          {body}
        </CSSTransition>
      </SwitchTransition>
    </Modal>
  )
}

Modal.setAppElement('#root')

export default EditTopicModal
