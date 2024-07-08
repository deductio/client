import { useLoadGraph, useSigma } from '@react-sigma/core'
import { Topic } from '../../../utilities/model'
import planGraph from '../lib/graphPlanner'
import { useEffect, useState } from 'react'

interface PlanListProps {
  topics: Topic[]
}

const topicArrToObj = (topics: Topic[]): { [key: number]: Topic } => {
  const ret: { [key: number]: Topic } = {}

  for (const topic of topics) {
    ret[topic.id] = topic
  }

  return ret
}

const PlanList = (props: PlanListProps): JSX.Element => {
  const sigma = useSigma()
  const loadGraph = useLoadGraph()
  const [planList, setPlanList] = useState<number[]>([])
  const topics = topicArrToObj(props.topics)
  const topicList = planList.map(id => topics[id])

  useEffect(() => {
    const graph = sigma.getGraph()

    setPlanList(planGraph(graph))
  }, [sigma, loadGraph])

  return (
    <div>
      {topicList.map(topic => (
        <div key={topic.id} className='border border-gray-400 p-2 m-4 rounded-lg'>
          <h1 className='font-semibold text-2xl'>{topic.title}</h1>
          <p className='indent-4'>{topic.description}</p>
        </div>))}
    </div>
  )
}

export default PlanList
