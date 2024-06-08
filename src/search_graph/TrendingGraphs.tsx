import { useLoaderData, useParams } from "react-router"
import { SearchResultGraph } from "../utilities/model"
import SearchResult from "../search_graph/components/SearchResult"

const TrendingGraph = () => {
    const graphs = (useLoaderData() as SearchResultGraph[]) || []
    const { timerange } = useParams()

    let range

    switch (timerange) {
        case "day":
            range = "today"
            break;
        case "week":
            range = "this week"
            break;
        case "month":
            range = "this month"
            break;
        default:
            range = ""
            break;
    }

    return <div className="bg-indigo-100 h-screen flex flex-col items-center justify-center">
        <div className="rounded-lg bg-white shadow-inner shadow-2xl">
            <h1 className="font-bold text-4xl">Trending graphs {range}</h1>

            {graphs.map(graph => <SearchResult graph={graph}/>)}
        </div>
    </div>
}

export default TrendingGraph;