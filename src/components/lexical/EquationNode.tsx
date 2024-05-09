import { $applyNodeReplacement, DecoratorNode, EditorConfig, LexicalNode, NodeKey } from "lexical";
import { ReactNode } from "react";
import katex from 'katex';

export class EquationNode extends DecoratorNode<ReactNode> {

    __equation: string;

    static getType(): string {
        return "equation"
    }

    static clone(_data: EquationNode): LexicalNode {
        return new EquationNode(_data.__key)
    }

    constructor(equation: string, key?: NodeKey) {
        super(key)
        this.__equation = equation
    }

    getTextContent(): string {
        return this.__equation;
    }
    
    getEquation(): string {
        return this.__equation;
    }
    
    setEquation(equation: string): void {
        const writable = this.getWritable();
        writable.__equation = equation;
    }

    createDOM(_config: EditorConfig): HTMLElement {
        const element = document.createElement('div');

        element.className = 'editor-equation';
        return element;
    }

    decorate(): ReactNode {
        return <div>waga wag!</div>
    }

}

export function $createEquationNode(): EquationNode {
    const node = new EquationNode("wag")
    return $applyNodeReplacement(node)
}

export function $isEquationNode(
    node: LexicalNode | null | undefined,
  ): node is EquationNode {
    return node instanceof EquationNode;
  }