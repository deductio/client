import { Topic } from "../../api/model";

interface SearchBarProps {
    topics: Topic[]
}

function SearchBar(props: SearchBarProps) {

    return <div>
        <input type="text" list="dropdown"></input>
        <datalist id="dropdown">
            {props.topics.map((topic, i) => <option key={i}>{topic.title}</option>)}
        </datalist>
    </div>
}

export default SearchBar;