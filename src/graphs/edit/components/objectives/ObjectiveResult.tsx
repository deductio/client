import { Objective } from "../../../../utilities/model"

const ObjectiveResult = ({ objective, use }: { objective: Objective, use: () => void }) => {
    return <div>
        <h1>{objective.title}</h1>
        <p>{objective.description}</p>
        <button onClick={use}>Use</button>
    </div>
}

export default ObjectiveResult