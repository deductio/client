import { useState, useEffect, useCallback } from 'react'
import { SigmaContainer, ControlsContainer } from '@react-sigma/core'
import '@react-sigma/core/lib/react-sigma.min.css'
import { Topic } from '../../utilities/model'
import DagGraph from '../lib/DagGraph'
import GraphEditEvents from './lib/GraphEditEvents'
import { EditContext, useEditGraph } from './lib/EditState'
import EditTopicModal from './components/modal/EditTopicModal'
import EditReducer from './lib/EditReducer'

/**
 * The main (page) component for editing user-owned graphs.
 */
const EditGraph = (): JSX.Element => {
  const [{ graph, selectedTopics }, dispatch] = useEditGraph()
  const [openedTopic, setOpenTopic] = useState<Topic | null>(null)

  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [youtubeDialogOpen, setYoutubeDialogOpen] = useState(false)

  const toolbar = { imageDialogOpen, setImageDialogOpen, youtubeDialogOpen, setYoutubeDialogOpen }

  const openTopic = useCallback((id: number) => {
    const topic = graph.topics.find(topic => topic.id === id)

    if (topic != null) { setOpenTopic(topic) }
  }, [graph.topics])

  const closeTopic = useCallback((save: boolean) => {
    console.log(openedTopic)

    if (openedTopic == null) { return } else if (openedTopic.id === 0 && !save) { dispatch({ type: 'clearTempNode' }) }

    if (imageDialogOpen || youtubeDialogOpen) {
      setImageDialogOpen(false)
      setYoutubeDialogOpen(false)
    } else {
      setOpenTopic(null)
    }
  }, [openedTopic])

  useEffect(() => {
    const topic = graph.topics.find(topic => topic.id === 0)
    if (topic != null) {
      setOpenTopic(topic)
    }
  }, [graph.topics])

  if (graph === undefined) {
    return <></>
  }

  return (
    <div onKeyDown={(event) => {
      if (event.key === 'Escape') { dispatch({ type: 'clearSelected' }) }
    }}
    >
      <SigmaContainer style={{ height: '90vh', width: '100vw' }}>
        <ControlsContainer>
          <div className={`flex flex-col ${openedTopic != null ? 'hidden' : ''}`}>
            <div>
              <button
                className={`${selectedTopics.length === 0 ? 'bg-indigo-600' : 'bg-gray-400'} rounded text-white p-2 m-1`}
                disabled={selectedTopics.length !== 0}
                onClick={() => { dispatch({ type: 'addTopic' }) }}
              >Add Topic
              </button>
              <button
                className={`${selectedTopics.length === 1 ? 'bg-indigo-600' : 'bg-gray-400'} rounded text-white p-2 m-1`}
                disabled={selectedTopics.length !== 1}
                onClick={() => openTopic(selectedTopics[0])}
              >Edit Topic
              </button>
              <button
                className={`${selectedTopics.length === 1 ? 'bg-indigo-600' : 'bg-gray-400'} rounded text-white p-2 m-1`}
                disabled={selectedTopics.length !== 1}
                onClick={() => dispatch({ type: 'deleteTopic', node: selectedTopics[0] })}
              >Delete Topic
              </button>
            </div>
            <div className='flex'>
              <button
                className={`${selectedTopics.length === 2 ? 'bg-indigo-600' : 'bg-gray-400'} rounded text-white p-2 m-1 w-full`}
                disabled={selectedTopics.length !== 2}
                onClick={() => dispatch({ type: 'deleteRequirement' })}
              >Delete Edge
              </button>
              <button
                className={`${selectedTopics.length === 2 ? 'bg-indigo-600' : 'bg-gray-400'} rounded text-white p-2 m-1 w-full`}
                disabled={selectedTopics.length !== 2}
                onClick={() => dispatch({ type: 'addRequirement' })}
              >Add Edge
              </button>
            </div>
          </div>
        </ControlsContainer>
        <DagGraph graph={graph} selected={selectedTopics} />
        <GraphEditEvents
          selectTopic={topic => dispatch({
            type: 'toggleSelectTopic',
            node: topic
          })} modifyTopic={openTopic}
        />
        <EditReducer selected={selectedTopics} />
        \
      </SigmaContainer>

      <EditContext.Provider value={{ dispatch, topic: openedTopic, toolbar }}>
        <EditTopicModal
          objectives={graph.objectives.filter(prereq => prereq.topic === openedTopic?.id)}
          satisfier={graph.satisfiers.find(satisfier => satisfier.topic === openedTopic?.id)?.objective}
          topic={openedTopic}
          handleClose={closeTopic}
        />
      </EditContext.Provider>
    </div>
  )
}

export default EditGraph
