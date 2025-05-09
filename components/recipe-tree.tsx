"use client"
import { useState, useEffect } from "react"
import ReactFlow, {
  type Node,
  type Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Position,
} from "reactflow"
import "reactflow/dist/style.css"
import ElementNode from "@/components/element-node"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw, FastForward } from "lucide-react"

// Types
interface Element {
  id: number
  name: string
  emoji?: string
  isBasic: boolean
}

interface RecipeNode {
  element: Element
  children: RecipeNode[][]
}

interface RecipeTreeProps {
  recipe: RecipeNode
}

// Node types
const nodeTypes = {
  element: ElementNode,
}

export default function RecipeTree({ recipe }: RecipeTreeProps) {
  // Convert the recipe tree to ReactFlow nodes and edges
  const { nodes: initialNodes, edges: initialEdges, levels } = convertRecipeToGraph(recipe)

  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [currentLevel, setCurrentLevel] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState(1000) // ms between levels

  // Reset animation
  const resetAnimation = () => {
    setNodes([])
    setEdges([])
    setCurrentLevel(0)
    setIsComplete(false)
    setIsPlaying(false)
  }

  // Play/pause animation
  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  // Speed up animation
  const speedUp = () => {
    setAnimationSpeed((prev) => Math.max(prev / 2, 250))
  }

  // Handle animation steps
  useEffect(() => {
    if (!isPlaying || isComplete) return

    const timer = setTimeout(() => {
      if (currentLevel < levels.length) {
        // Add nodes for this level
        const nodesForLevel = initialNodes.filter((node) => levels[currentLevel].nodeIds.includes(node.id))

        // Add edges for this level
        const edgesForLevel = initialEdges.filter((edge) => levels[currentLevel].edgeIds.includes(edge.id))

        setNodes((prev) => [...prev, ...nodesForLevel])
        setEdges((prev) => [...prev, ...edgesForLevel])
        setCurrentLevel((prev) => prev + 1)
      } else {
        setIsComplete(true)
        setIsPlaying(false)
      }
    }, animationSpeed)

    return () => clearTimeout(timer)
  }, [isPlaying, currentLevel, levels, initialNodes, initialEdges, isComplete, animationSpeed])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center space-x-4">
        <Button variant="outline" size="icon" onClick={resetAnimation} title="Reset">
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          variant={isPlaying ? "default" : "outline"}
          size="icon"
          onClick={togglePlay}
          disabled={isComplete && currentLevel >= levels.length}
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <Button variant="outline" size="icon" onClick={speedUp} title="Speed up">
          <FastForward className="h-4 w-4" />
        </Button>
        <div className="text-sm text-muted-foreground">
          {isComplete ? "Complete" : `Step ${currentLevel}/${levels.length}`}
        </div>
        <div className="text-sm text-muted-foreground">Speed: {animationSpeed}ms</div>
      </div>

      <div className="h-[600px] w-full border rounded-md">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-right"
        >
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </div>
  )
}

// Helper function to convert recipe tree to ReactFlow nodes and edges with level information
function convertRecipeToGraph(recipe: RecipeNode) {
  const nodes: Node[] = []
  const edges: Edge[] = []
  const levels: { level: number; nodeIds: string[]; edgeIds: string[] }[] = []
  let nodeId = 0

  // Initialize levels array
  const maxDepth = getMaxDepth(recipe)
  for (let i = 0; i <= maxDepth; i++) {
    levels.push({ level: i, nodeIds: [], edgeIds: [] })
  }

  // Recursive function to process the recipe tree
  function processNode(node: RecipeNode, x: number, y: number, depth: number, parentId?: string): string {
    const id = `node-${nodeId++}`

    // Add the current node
    nodes.push({
      id,
      type: "element",
      position: { x, y },
      data: {
        element: node.element,
        depth: depth,
      },
      sourcePosition: Position.Top,
      targetPosition: Position.Bottom,
    })

    // Add node to its level
    levels[depth].nodeIds.push(id)

    // Connect to parent if exists
    if (parentId) {
      const edgeId = `edge-${parentId}-${id}`
      edges.push({
        id: edgeId,
        source: parentId,
        target: id,
        type: "default",
      })
      levels[depth].edgeIds.push(edgeId)
    }

    // Process children
    if (node.children.length > 0) {
      const childrenWidth = 200 * node.children.length
      let startX = x - childrenWidth / 2 + 100

      node.children.forEach((combination, i) => {
        if (combination.length === 2) {
          // For a pair of elements that combine
          const leftId = processNode(combination[0], startX - 100, y + 150, depth + 1)
          const rightId = processNode(combination[1], startX + 100, y + 150, depth + 1)

          // Add a combination edge
          const combineEdgeId = `combine-${leftId}-${rightId}`
          edges.push({
            id: combineEdgeId,
            source: leftId,
            target: rightId,
            type: "default",
            style: { stroke: "#10b981", strokeWidth: 2 },
          })
          levels[depth + 1].edgeIds.push(combineEdgeId)

          // Connect the combination to the parent
          const resultLeftEdgeId = `result-${leftId}-${id}`
          edges.push({
            id: resultLeftEdgeId,
            source: leftId,
            target: id,
            type: "default",
            style: { stroke: "#10b981", strokeDasharray: "5,5" },
          })
          levels[depth + 1].edgeIds.push(resultLeftEdgeId)

          const resultRightEdgeId = `result-${rightId}-${id}`
          edges.push({
            id: resultRightEdgeId,
            source: rightId,
            target: id,
            type: "default",
            style: { stroke: "#10b981", strokeDasharray: "5,5" },
          })
          levels[depth + 1].edgeIds.push(resultRightEdgeId)
        }

        startX += 300
      })
    }

    return id
  }

  // Start processing from the root
  processNode(recipe, 0, 0, 0)

  return { nodes, edges, levels }
}

// Helper function to get the maximum depth of the recipe tree
function getMaxDepth(node: RecipeNode, currentDepth = 0): number {
  if (node.children.length === 0) {
    return currentDepth
  }

  let maxChildDepth = currentDepth

  node.children.forEach((combination) => {
    combination.forEach((child) => {
      const childDepth = getMaxDepth(child, currentDepth + 1)
      maxChildDepth = Math.max(maxChildDepth, childDepth)
    })
  })

  return maxChildDepth
}
