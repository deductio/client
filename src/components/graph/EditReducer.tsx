import { useSigma } from "@react-sigma/core"

const EditReducer = (props: { selected: number[] }) => {
    const sigma = useSigma()

    sigma.setSetting("nodeReducer", (node, data) => {
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