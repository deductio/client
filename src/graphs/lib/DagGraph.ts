import { useLoadGraph, useSigma } from '@react-sigma/core'
import dagre from 'dagre'
import { DirectedGraph } from 'graphology'
import { useEffect } from 'react'
import { GraphMap } from '../../utilities/model'

interface SigmaData {
  x: number
  y: number
  label: string | null
  size: number
  description?: string
}

/**
 * This function draw in the input canvas 2D context a rectangle.
 * It only deals with tracing the path, and does not fill or stroke.
 *
 * Taken from the Sigma.js main demo, licensed under the MIT license.
 */
export function drawRoundRect (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): void {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
}

const drawHover = (context: CanvasRenderingContext2D, data: SigmaData, settings: { labelWeight: string, labelSize: number, labelFont: string }): void => {
  if (data.label == null) return

  context.font = `${settings.labelWeight} ${settings.labelSize}px ${settings.labelFont}`
  const diameter = data.size * 2

  const metrics = context.measureText(data.label)
  const width = Math.max(metrics.width + diameter + 11 + (settings.labelSize / 2), 200)

  const maxWidth = Math.min(width - diameter, 200)
  // let actualMaxWidth = Math.min(width - diameter, 200)
  const descriptionLines: string[] = []
  const descriptionWords: string[] = (data.description ?? '').split(' ')
  let currentLine = ''
  let currentWidth = 0
  let currentIndex = 0

  context.font = `${settings.labelWeight} ${settings.labelSize - 2}px ${settings.labelFont}`

  while (true) {
    while (currentWidth < maxWidth && currentIndex < descriptionWords.length) {
      currentLine += descriptionWords[currentIndex++] + ' '
      currentWidth = context.measureText(currentLine).width
    }

    const currentSplitLine = currentLine.split(' ')
    currentSplitLine.pop()
    if (currentSplitLine.length === 1) {
      // nothing to be done, move on
      descriptionLines.push(currentLine)
      // actualMaxWidth = Math.max(currentWidth, maxWidth)
    } else {
      if (currentIndex < descriptionWords.length) {
        currentIndex--
        currentSplitLine.pop()
      }

      descriptionLines.push(currentSplitLine.join(' '))
    }

    if (currentIndex === descriptionWords.length) break

    currentWidth = 0
    currentLine = ''
  }

  const height = diameter + 8 + (settings.labelSize - 2) * descriptionLines.length + 4

  context.fillStyle = '#fff'
  drawRoundRect(context, data.x - data.size - 4, data.y - data.size - 4, width, height, 4)
  context.fill()

  context.fillStyle = '#000'
  drawRoundRect(context, data.x - data.size - 4, data.y - data.size - 4, width, height, 4)
  context.stroke()

  context.font = `${settings.labelWeight} ${settings.labelSize}px ${settings.labelFont}`

  context.fillText(data.label, data.x + data.size + 3, data.y + settings.labelSize / 3)

  context.font = `${settings.labelWeight} ${settings.labelSize - 2}px ${settings.labelFont}`
  descriptionLines.forEach((line, i) => {
    context.fillText(line, data.x - data.size + 3, data.y + settings.labelSize + data.size + (settings.labelSize - 2) * i)
  })
}

interface DagGraphProps {
  graph: GraphMap
  selected?: number[]
}

/**
 * The main graph rendering plugin - takes in the current graph state and produces a {@link graphology/DirectedGraph} that is then
 * rendered by Sigma.js. Further logic, such as visualizing progress, is performed in separate reducer plugins.
 *
 * @param props The current graph/map state, including the topics (nodes), requirements (edges), and progress, as well as
 * which nodes are selected (only relevant when editing the graph in the EditGraph component)
 */
const DagGraph = (props: DagGraphProps): null => {
  const loadGraph = useLoadGraph()
  const sigma = useSigma()

  sigma.setSetting('labelFont', 'IBM Plex Sans')
  sigma.setSetting('defaultDrawNodeHover', drawHover)

  useEffect(() => {
    const graph: DirectedGraph = new DirectedGraph() // visualization
    const dag = new dagre.graphlib.Graph() // layout control

    dag.setGraph({})
    dag.setDefaultEdgeLabel(() => { return {} })

    for (const topic of props.graph.topics) {
      graph.addNode(topic.id, {
        x: 0,
        y: 0,
        label: topic.title,
        size: 20,
        color: '#6366f1',
        description: topic.description
      })

      dag.setNode(String(topic.id), {
        label: topic.title,
        width: 100,
        height: 100
      })

      graph.setNodeAttribute(topic.id, 'id', topic.id)
    }

    for (const requirement of props.graph.requirements) {
      graph.addEdge(requirement[0], requirement[1], {
        label: 'REL_1',
        type: 'arrow',
        size: 3
      })

      dag.setEdge(String(requirement[0]), String(requirement[1]))
    }

    if (props.selected !== undefined && props.selected.length === 2) {
      const [src, dest] = props.selected

      if (!props.graph.requirements.some(req => req[0] === src && req[1] === dest)) {
        graph.addEdge(props.selected[0], props.selected[1], {
          label: 'REL_1',
          type: 'arrow',
          size: 3,
          color: '#94a3b8'
        })
      }
    }

    dagre.layout(dag, { nodesep: 300, edgesep: 400, ranksep: 400 })

    graph.forEachNode((node) => {
      const actNode = dag.node(node)
      graph.setNodeAttribute(node, 'x', actNode.x / 1)
      graph.setNodeAttribute(node, 'y', actNode.y / 1)
    })

    loadGraph(graph)
  }, [loadGraph, props.graph, props.selected])

  return null
}

export default DagGraph
