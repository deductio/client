import React, { useMemo, useState, useCallback } from "react"
import Graph from "./pages/Graph"
import TopicModal from './components/topic_modal/TopicModal';
import SearchBar from "./components/search/SearchBar";
import useSWRImmutable from "swr/immutable"
import './App.css';
import GraphContainer from "./pages/GraphContainer";

function App() {

  return (
    <GraphContainer uuid={"00000000-0000-0000-0000-000000000000"}/>
  );
}

export default App;
