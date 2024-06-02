import { useLoaderData } from "react-router"
import { Link } from "react-router-dom"

type PreviewMap = {
    title: string,
    id: number
}

const UserMaps = () => {

    const maps = (useLoaderData() as PreviewMap[]) || []

    return <div className="bg-indigo-100 h-screen flex flex-col items-center justify-center">
        <div className="rounded-lg bg-white shadow-inner shadow-2xl">
            {maps.map(map => <>
                <h2 className="font-semibold text-2xl"><Link to={`/map/${map.id}`}>{map.title}</Link></h2>
            </>
            )}
        </div>
    </div>
}

export default UserMaps