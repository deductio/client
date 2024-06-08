import { useSigma } from "@react-sigma/core"

/**
 * A Sigma.js plugin that highlights selected nodes, while dimming
 * unselected nodes, used for editing graphs.
 * 
 * @param props - The collection of selected nodes.
 */
const EditReducer = (props: { selected: number[] }) => {
    const sigma = useSigma()

    sigma.setSetting("nodeReducer", (node, data) => {

        // Sigma node ID's are strings, while our input is a number - need to cast
        if (props.selected.includes(Number(node))) {
            return {
                ...data,
                color: "#7c3aed"
            }
        } else if (props.selected.length != 0) {
            return {
                ...data,
                color: "grey"
            }
        } else {
            return data
        }
    })

    return null
}

export default EditReducer