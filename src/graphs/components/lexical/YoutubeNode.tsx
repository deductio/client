import type { Spread, SerializedLexicalNode, NodeKey, LexicalNode, EditorConfig } from 'lexical'
import { DecoratorNode, $applyNodeReplacement } from 'lexical'
import { ReactNode } from 'react'

export type SerializedYoutubeNode = Spread<{
  id: string
  start?: number
  end?: number
},
SerializedLexicalNode
>

export class YoutubeNode extends DecoratorNode<ReactNode> {
  private readonly __id: string
  private readonly __start?: number
  private readonly __end?: number

  constructor (id: string, start?: number, end?: number, key?: NodeKey) {
    super(key)
    this.__id = id
    this.__start = start
    this.__end = end
  }

  static getType (): string {
    return 'youtube'
  }

  getLink (): string {
    return this.__id
  }

  override exportJSON (): SerializedYoutubeNode {
    return {
      id: this.getLink(),
      start: this.__start,
      end: this.__end,
      type: 'youtube',
      version: 1
    }
  }

  static importJSON (serialized: SerializedYoutubeNode): YoutubeNode {
    return $createYoutubeNode(serialized.id)
  }

  decorate (): ReactNode {
    return <iframe src={`https://www.youtube.com/embed/${this.__id}`} />
  }

  static clone (_data: YoutubeNode): LexicalNode {
    return new YoutubeNode(_data.getLink())
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

export function $createYoutubeNode (link: string, start?: number, end?: number): YoutubeNode {
  const node = new YoutubeNode(link, start, end)
  return $applyNodeReplacement(node)
}

export function $isYoutubeNode (node: LexicalNode | null | undefined): node is YoutubeNode {
  return node?.getType() === 'youtube'
}
