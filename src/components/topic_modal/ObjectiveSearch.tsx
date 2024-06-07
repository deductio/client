import { ForwardedRef, forwardRef, useState } from "react"
import { FetcherWithComponents, useFetcher } from "react-router-dom"
import { Objective, Topic } from "../../api/model"
import ObjectiveRequirementResult from "./ObjectiveRequirementResult"
import ObjectiveSatisfierResult from "./ObjectiveSatisfierResult"

type ObjectiveSearchProps = {
    mode: "satisfier" | "prereq",
    fetcher: FetcherWithComponents<any>,
    reconcile: () => void,
    topic: Topic
}

const ObjectiveSearch = forwardRef((props: ObjectiveSearchProps, ref: ForwardedRef<HTMLDivElement>) => {

    const [state, setState] = useState<"ready" | "searching" | "reconciling">("ready")
    const fetcher = useFetcher()

    return <div ref={ref}>
        <h1 className="font-bold text-4xl text-center">Add a {props.mode === "prereq" ? "requirement" : "satisfier"}</h1>

        <fetcher.Form action="/objectives" method="POST" className="flex flex-col">
            <div className="flex flex-col justify-around w-1/3 place-self-center">
                <input className="m-4 border-2 rounded-lg" type="text" name="search"></input>
                <button onClick={() => setState("searching")} className="bg-indigo-600 text-white rounded-lg p-2 place-self-center">Search</button>
                <input type="hidden" name="offset" value="0"></input>
            </div>
        </fetcher.Form>

        {
            fetcher.data ?
                state === "searching" ?
                    fetcher.data.map((result: Objective) => props.mode === "prereq"
                        ? <ObjectiveRequirementResult {...props} result={result}/>
                        : <ObjectiveSatisfierResult {...props} result={result}/>
                    )
                : <div></div>
            : <></>
        }
    </div>

})

export default ObjectiveSearch