import { Resource } from "../../api/model";

const ResourceItem = (props: Resource) => {
    return (<div>
        <div style={{ width: "25%" }}>

        </div>
        <div style={{ width: "75%" }}>
            <h3>{props.title}</h3>
            <p>{props.description}</p>
        </div>
    </div>)
}

export default ResourceItem;