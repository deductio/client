import { KnowledgeGraph, Topic } from "../../api/model"

interface GraphEditorProps {
    selected: Topic[],
    graph: KnowledgeGraph,
    
    deleteTopics: (deletes: Topic[]) => void,
    addTopic: () => void,
    addRequirement: (source: Topic, edge: Topic) => void
}

const GraphEditor = (props: GraphEditorProps) => {

}