import { $applyNodeReplacement, DecoratorNode, EditorConfig, LexicalNode, NodeKey, Spread, SerializedLexicalNode, LexicalEditor } from 'lexical'
import { ReactNode } from 'react'
import EquationComponent from './EquationComponent'

export type SerializedEquationNode = Spread<{
  equation: string
  inline: boolean
},
SerializedLexicalNode
>

/**
 * A Lexical Decorator node that takes in LaTeX and allows for both
 * rendering and inline editing.
 */
export class EquationNode extends DecoratorNode<ReactNode> {
  __equation: string
  __inline: boolean
  __editing: boolean

  static getType (): string {
    return 'equation'
  }

  static clone (_data: EquationNode): LexicalNode {
    return new EquationNode(_data.__equation, _data.__inline, _data.__key)
  }

  constructor (equation: string, inline: boolean, key?: NodeKey) {
    super(key)
    this.__equation = equation
    this.__inline = inline
    this.__editing = false
  }

  getTextContent (): string {
    return this.__equation
  }

  setUpdate (equation: string, inline: boolean, editing: boolean): void {
    const writable = this.getWritable()

    writable.__equation = equation
    writable.__inline = inline
    writable.__editing = editing
  }

  getEquation (): string {
    const latest = this.getLatest()
    return latest.__equation
  }

  setEquation (equation: string): void {
    const writable = this.getWritable()
    writable.__equation = equation
    writable.__editing = true
  }

  getInline (): boolean {
    const latest = this.getLatest()
    return latest.__inline
  }

  setInline (inline: boolean): void {
    const writable = this.getWritable()
    writable.__inline = inline
    writable.__editing = true
  }

  getEditing (): boolean {
    const latest = this.getLatest()
    return latest.__editing
  }

  setEditing (editing: boolean): void {
    const writable = this.getWritable()
    writable.__editing = editing
  }

  createDOM (_config: EditorConfig): HTMLElement {
    const element = document.createElement('span')

    element.className = 'editor-equation'
    return element
  }

  updateDOM (prevNode: EquationNode): boolean {
    return prevNode.__inline !== this.__inline || prevNode.__equation !== this.__equation
  }

  decorate (editor: LexicalEditor): ReactNode {
    return <EquationComponent equation={this.getEquation()} inline={this.getInline()} nodeKey={this.getKey()} editing={this.getEditing()} editable={editor.isEditable()} />
  }

  override exportJSON (): SerializedEquationNode {
    return {
      equation: this.getEquation(),
      inline: this.getInline(),
      type: 'equation',
      version: 1
    }
  }

  static importJSON (serialized: SerializedEquationNode): EquationNode {
    return $createEquationNode(
      serialized.equation,
      serialized.inline
    )
  }
}

export function $createEquationNode (equation: string, inline: boolean): EquationNode {
  const node = new EquationNode(equation, inline)
  return $applyNodeReplacement(node)
}

export function $isEquationNode (
  node: LexicalNode | null | undefined
): node is EquationNode {
  return node?.getType() === 'equation'
}
