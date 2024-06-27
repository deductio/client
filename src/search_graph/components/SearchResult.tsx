import { useFetcher, Link } from "react-router-dom"
import { SearchResultGraph } from "../../utilities/model";
import Cookies from "js-cookie"
import { Star } from "lucide-react";

const SearchResult = ({ graph, timerange }: { graph: SearchResultGraph, timerange?: string }) => {
    let range;

    const username = Cookies.get("name")
    const fetcher = useFetcher()
    const liked = fetcher.formData ? fetcher.formData.get("liked") === "yes" : graph.liked

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

    return <div className="m-4">
        <h2 className="font-semibold text-2xl"><Link to={`/graph/view/${graph.id}`}>{graph.name}</Link></h2>
        <i className="float-right flex flex-row">
            <Star/>
            {graph.like_count} {graph.like_count == 1 ? "like" : "likes"} {range}
        </i>
        <i className="flex flex-row">by <Link className="flex flex-row mx-1" to={`/users/${graph.user.username}`}>
            <img className="h-4 rounded-2xl place-self-center mx-0.5" src={graph.user.avatar}></img>
            <p className="font-normal">{graph.user.username}</p>
        </Link></i>

        <p className="indent-4 m-2">{graph.description}</p>

        { username ?
            <fetcher.Form method="POST" action={`/like/${graph.id}`} className="float-right">
                <button type="submit" name="liked" value={liked ? "yes" : "no"} className={!liked
                    ? "text-sm bg-indigo-600 rounded text-white p-1"
                    : "text-sm bg-white rounded text-indigo-600 border-indigo-600 p-1 border"
                }>{liked ? "Unlike" : "Like"}</button>
            </fetcher.Form>
        : <></>}
    
    </div>
}

export default SearchResult;