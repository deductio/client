import { useEffect, useRef } from 'react'
import katex from 'katex'

const KatexRenderer = ({ equation, inline, onDoubleClick }: { equation: string, inline: boolean, onDoubleClick: () => void }) => {
    const katexRef = useRef<HTMLElement>(null)

    useEffect(() => {
        if (katexRef.current !== null) {
            katex.render(equation, katexRef.current, {
                displayMode: !inline,
                trust: false,
                output: "html"
            })
        }
    }, [equation, inline])

    return <span role="button" onDoubleClick={onDoubleClick} ref={katexRef} tabIndex={-1}>
        </span>

}

export default KatexRenderer