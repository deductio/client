import { Resource } from "../../api/model";
import "./modal.css"
import book from "../../icons/book-half.svg"

const ResourceItem = (props: Resource) => {
    return (<div style={{ display: "flex" }}>
        <img className="resource-image" src={props.img || book}></img>
        <div>
            <h2 className="resource-title-header">
                {props.link ? <a href={props.link}>{props.title}</a> : props.title}
            </h2>
            <p>{props.description}</p>
        </div>
    </div>)
}

export default ResourceItem;