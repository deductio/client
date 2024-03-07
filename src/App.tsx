import React, { useMemo, useState, useCallback } from "react"
import logo from './logo.svg';
import Graph from "./components/graph/Graph"
import TopicModal from './components/topic_modal/TopicModal';
import useSWRImmutable from "swr/immutable"
import './App.css';
import { KnowledgeGraph, Resource, Topic } from './api/model';

const fetcher = ([url, ...args]: [string, ...any]) => fetch(url, { headers: { "Accept": "application/json" } }).then(res => res.json())

function App() {
  const initialGraph: KnowledgeGraph = {
    id: "",
    name: "",
    description: "",
    owner: "",
    topics: []
  }

  const initialTopic: Topic = {
    id: 0,
    knowledge_graph_id: "",
    knowledge_graph_index: 0,
    title: "Shine On You Crazy Diamond",
    requirements: [],
    content: "",
    subject: ""
  }

  const initialResources: Resource[] = [{
    title: "yh",
    description: "uj",
    topic_id: 0,
    link: null,
    id: 1
  }]

  const [uuid, setUuid] = useState("00000000-0000-0000-0000-000000000000")
  const [topic, setTopic] = useState(initialTopic)
  const [opened, setOpened] = useState(false)

  const { data, isLoading, error } = useSWRImmutable(["http://localhost/graph/" + uuid, uuid], fetcher)
  const { data: res } = useSWRImmutable(["http://localhost/graph/" + uuid + "/topic/" + topic.id, uuid, topic], fetcher)

  const graph: KnowledgeGraph = data as KnowledgeGraph

  const resRet = useCallback((id: number) => {
    setTopic(graph.topics.filter(topic => topic.id === id)[0])
    setOpened(true)
  }, [data])

  const closeModal = useCallback(() => {
    setOpened(false)
  }, [opened])

  const graphMemo = useMemo(() => <Graph graph={data || initialGraph} clickTopic={resRet}></Graph>, [data])

  return (
    <div className="App">
      { graphMemo }
      <TopicModal topic={topic} resources={res || initialResources} opened={opened} closeModal={closeModal}></TopicModal>
    </div>
  );
}

export default App;
