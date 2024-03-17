import React, { useMemo, useState, useCallback } from "react"
import Graph from "./components/graph/Graph"
import TopicModal from './components/topic_modal/TopicModal';
import SearchBar from "./components/search/SearchBar";
import useSWRImmutable from "swr/immutable"
import './App.css';
import { KnowledgeGraph, Resource, Topic } from './api/model';
import getCoursePlan from "./components/search/getCoursePlan";
import { useSigma } from "@react-sigma/core";

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
    link: null,
    img: null
  }]

  const [uuid, setUuid] = useState("00000000-0000-0000-0000-000000000000")
  const [topic, setTopic] = useState(initialTopic)
  const [opened, setOpened] = useState(false)
  const [resource, setResource] = useState(initialResources)
  const [graph, setGraph] = useState()

  const { data, isLoading, error } = useSWRImmutable(["http://localhost/graph/" + uuid, uuid], fetcher)

  const knowledgeGraph: KnowledgeGraph = data as KnowledgeGraph
  const sigmaGraph = useSigma().getGraph()

  const resRet = useCallback((id: number) => {
    setTopic(knowledgeGraph.topics.filter(topic => topic.id === id)[0])
    setOpened(true)
  }, [data])

  const closeModal = useCallback(() => {
    setOpened(false)
  }, [opened])

  const graphMemo = useMemo(() => 
  <Graph graph={data || initialGraph} clickTopic={resRet} getGraph={setGraph.bind(this)}></Graph>, [data])

  return (
    <div className="App">
      <SearchBar topics={knowledgeGraph ? knowledgeGraph.topics : []} />
      { graphMemo }
      <TopicModal topic={topic} opened={opened} closeModal={closeModal}></TopicModal>
    </div>
  );
}

export default App;
