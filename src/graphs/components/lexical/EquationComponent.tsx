import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { useState, useEffect, useCallback } from "react"
import { $getNodeByKey } from "lexical"
import KatexRenderer from "./KatexRender"
import { $isEquationNode } from "./EquationNode"

/**
 * The corresponding JSX component for EquationNode.
 */
const EquationComponent = ({ _equation, _inline, _editing, nodeKey }
    : 
    { _equation: string,_inline: boolean, _editing: boolean, nodeKey: string }) => {

    const [editor] = useLexicalComposerContext()

    const [editing, setEditing] = useState(false)
    const [inline, setInline] = useState(true)
    const [equation, setEquation] = useState("")

    useEffect(() => {
        setInline(_inline)
    }, [_inline, nodeKey])

    useEffect(() => {
        setEquation(_equation)
    }, [_equation, nodeKey])

    useEffect(() => {
        setEditing(_editing)
    }, [_editing, nodeKey])

    const update = useCallback(() => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey)

            if ($isEquationNode(node)) {
                node.setUpdate(equation, inline, false)
            }
        })
    }, [editor, inline, equation, nodeKey])

    return !editing
        ? <KatexRenderer equation={equation} inline={inline} onDoubleClick={() => setEditing(true)}/>
        : <div className="bg-gray-200 m-2 p-2 border-0" tabIndex={1}>
            <div className="float-end">
                <div className="text-sm rounded-lg border border-neutral-900 flex flex-row justify-between text-center overflow-hidden">
                    <p onClick={() => setInline(true)} className={`p-1 ${inline === true ? "bg-neutral-900 text-gray-200" : ""}`}>Inline</p>
                    <p onClick={() => setInline(false)} className={`p-1 ${inline === false ? "bg-neutral-900 text-gray-200" : ""}`}>Display</p>
                </div>
            </div>
            <textarea 
                onChange={(e) => setEquation(e.target.value)}
                value={equation}
                className="font-mono outline-none bg-gray-200 resize-none w-full p-2"
            >
        </textarea>
        <button onClick={update} className="rounded-lg text-sm border border-neutral-900 text-center overflow-hidden p-1">Save</button>
        </div>

}

export default EquationComponent