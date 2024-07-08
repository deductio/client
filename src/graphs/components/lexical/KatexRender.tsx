import { useEffect, useRef } from 'react'
import katex from 'katex'

/**
 * A decorator component that renders KaTeX math provided to it.
 */
const KatexRenderer = ({ equation, inline, onDoubleClick }: { equation: string, inline: boolean, onDoubleClick: () => void }): JSX.Element => {
  const katexRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (katexRef.current !== null) {
      katex.render(equation, katexRef.current, {
        displayMode: !inline,
        trust: false,
        output: 'html'
      })
    }
  }, [equation, inline])

  return (
    <span role='button' onDoubleClick={onDoubleClick} ref={katexRef} tabIndex={-1} />
  )
}

export default KatexRenderer
