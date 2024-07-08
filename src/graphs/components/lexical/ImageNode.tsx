import type { Spread, SerializedLexicalNode, NodeKey, LexicalNode, EditorConfig, LexicalEditor } from 'lexical'
import { DecoratorNode, $applyNodeReplacement, $getNodeByKey } from 'lexical'
import { ReactNode } from 'react'
import { Resizable } from 're-resizable'

export type SerializedImageNode = Spread<{
  link: string
  width: number
},
SerializedLexicalNode
>

export class ImageNode extends DecoratorNode<ReactNode> {
  __link: string
  __width: number

  constructor (link: string, width: number, key?: NodeKey) {
    super(key)
    this.__link = link
    this.__width = width
  }

  static getType (): string {
    return 'image'
  }

  getLink (): string {
    return this.__link
  }

  getWidth (): number {
    return this.__width
  }

  override exportJSON (): SerializedImageNode {
    return {
      link: this.getLink(),
      width: this.__width,
      type: 'image',
      version: 1
    }
  }

  static importJSON (serialized: SerializedImageNode): ImageNode {
    return $createImageNode(serialized.link, serialized.width)
  }

  setUpdate (width: number): void {
    const writeable = this.getWritable()

    writeable.__width = width
  }

  setWidth (editor: LexicalEditor, width: number): void {
    editor.update(() => {
      const node = $getNodeByKey(this.__key)

      if ($isImageNode(node)) {
        node.setUpdate(width)
      }
    })
  }

  decorate (editor: LexicalEditor): ReactNode {
    if (!editor.isEditable()) {
      return <img src={this.__link} width={this.__width} />
    } else {
      return (
        <Resizable size={{ width: this.__width }} lockAspectRatio onResizeStop={(_e, _dir, _ref, d) => this.setWidth(editor, this.__width + d.width)}>
          <img
            className='min-w-full w-auto' src={this.__link} onLoad={e => {
              if (this.__width === 0) this.setWidth(editor, e.currentTarget.naturalWidth)
            }}
          />
        </Resizable>
      )
    }
  }

  static clone (_data: ImageNode): LexicalNode {
    return new ImageNode(_data.getLink(), _data.getWidth())
  }

  createDOM (_config: EditorConfig): HTMLElement {
    const element = document.createElement('span')

    element.className = 'editor-image flex justify-center'
    return element
  }

  updateDOM (): boolean {
    return false
  }
}

export function $createImageNode (link: string, width: number): ImageNode {
  const node = new ImageNode(link, width)
  return $applyNodeReplacement(node)
}

export function $isImageNode (node: LexicalNode | null | undefined): node is ImageNode {
  return node?.getType() === 'image'
}
