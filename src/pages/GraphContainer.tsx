import * as defaultGraph from "../data/default.json";
import { KnowledgeGraph } from "../api/model";
import useSWRImmutable from "swr/immutable";
import useSWRMutation from 'swr/mutation';
import Graph from "./Graph";

const fetcher = ([url, uuid]: [string, string]) => {
    if (uuid === "00000000-0000-0000-0000-000000000000") {
        return defaultGraph
    } else {
        return fetch(url, { headers: { "Accept": "application/json" } }).then(res => res.json())
    }
}

const updateGraph = () => {

}

interface GraphContainerProps {
    uuid: string
}

interface GraphSWRValue {
    data: KnowledgeGraph | undefined,
    isLoading: boolean | undefined,
    error: boolean | undefined,
}

const GraphContainer = (props: GraphContainerProps) => {
    const { data, isLoading, error }: GraphSWRValue = useSWRImmutable(["/graph/" + props.uuid, props.uuid], fetcher)
    const { trigger } = useSWRMutation(["/graph/" + props.uuid, props.uuid], updateGraph, {})


    return data ? <Graph graph={data}/> : <p></p>

}

export default GraphContainer;