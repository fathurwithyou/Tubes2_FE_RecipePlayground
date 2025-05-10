"use client";
import { useState, useEffect } from "react";
import ReactFlow, { type Node, type Edge, Controls, Background, useNodesState, useEdgesState, Position } from "reactflow";
import "reactflow/dist/style.css";
import ElementNode from "@/components/element-node";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, FastForward } from "lucide-react";

interface Element {
  id: number;
  name: string;
  emoji?: string;
  isBasic: boolean;
}

interface RecipeNode {
  element: Element;
  children: RecipeNode[][];
}

interface RecipeTreeProps {
  recipe: RecipeNode;
}

const nodeTypes = {
  element: ElementNode,
};

const NODE_WIDTH = 150;
const NODE_HEIGHT = 60;
const HORIZONTAL_SPACING = 180;
const VERTICAL_SPACING = 120;

export default function RecipeTree({ recipe }: RecipeTreeProps) {
  const { nodes: initialNodes, edges: initialEdges, levels } = convertRecipeToGraph(recipe);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1000);

  const resetAnimation = () => {
    setNodes([]);
    setEdges([]);
    setCurrentLevel(0);
    setIsComplete(false);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const speedUp = () => {
    setAnimationSpeed((prev) => Math.max(prev / 2, 250));
  };

  useEffect(() => {
    if (!isPlaying || isComplete) return;

    const timer = setTimeout(() => {
      if (currentLevel < levels.length) {
        const nodesForLevel = initialNodes.filter((node) => levels[currentLevel].nodeIds.includes(node.id));

        const edgesForLevel = initialEdges.filter((edge) => levels[currentLevel].edgeIds.includes(edge.id));

        setNodes((prev) => [...prev, ...nodesForLevel]);
        setEdges((prev) => [...prev, ...edgesForLevel]);
        setCurrentLevel((prev) => prev + 1);
      } else {
        setIsComplete(true);
        setIsPlaying(false);
      }
    }, animationSpeed);

    return () => clearTimeout(timer);
  }, [isPlaying, currentLevel, levels, initialNodes, initialEdges, isComplete, animationSpeed]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPlaying(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center space-x-4 p-3 bg-black/60 rounded-lg border border-purple-900/50">
        <Button
          variant="outline"
          size="icon"
          onClick={resetAnimation}
          title="Reset"
          className="border-purple-800 text-purple-400 hover:bg-purple-900/30 bg-black/60">
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          variant={isPlaying ? "default" : "outline"}
          size="icon"
          onClick={togglePlay}
          disabled={isComplete && currentLevel >= levels.length}
          title={isPlaying ? "Pause" : "Play"}
          className={
            isPlaying
              ? "bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 border-0"
              : "border-purple-800 text-cyan-400 hover:bg-cyan-900/30 bg-black/60"
          }>
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={speedUp}
          title="Speed up"
          className="border-purple-800 text-cyan-400 hover:bg-cyan-900/30 bg-black/60">
          <FastForward className="h-4 w-4" />
        </Button>
        <div className="text-sm font-medium text-gray-300">
          {isComplete ? "Complete" : `Step ${currentLevel}/${levels.length}`}
        </div>
        <div className="text-sm text-gray-400">Speed: {animationSpeed}ms</div>
      </div>

      <div className="h-[600px] w-full border border-purple-900 rounded-md bg-black/60 shadow-lg">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-right"
          proOptions={{ hideAttribution: true }}>
          <Controls />
          <Background color="#9333ea" gap={16} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
}

function convertRecipeToGraph(recipe: RecipeNode) {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const levels: { level: number; nodeIds: string[]; edgeIds: string[] }[] = [];
  let nodeId = 0;

  const treeInfo = analyzeTree(recipe);
  const maxWidth = Math.max(...Object.values(treeInfo.levelWidths));

  for (let i = 0; i <= treeInfo.maxDepth; i++) {
    levels.push({ level: i, nodeIds: [], edgeIds: [] });
  }

  function processNode(
    node: RecipeNode,
    x: number,
    y: number,
    depth: number,
    horizontalIndex: number,
    parentId?: string
  ): string {
    const id = `node-${nodeId++}`;

    const levelWidth = treeInfo.levelWidths[depth];
    const totalWidth = levelWidth * HORIZONTAL_SPACING;
    const startX = -totalWidth / 2;
    const nodeX = startX + horizontalIndex * HORIZONTAL_SPACING;

    nodes.push({
      id,
      type: "element",
      position: { x: nodeX, y },
      data: {
        element: node.element,
        depth: depth,
      },

      sourcePosition: Position.Top,
      targetPosition: Position.Bottom,
    });

    levels[depth].nodeIds.push(id);

    if (parentId) {
      const edgeId = `edge-${parentId}-${id}`;
      edges.push({
        id: edgeId,
        source: parentId,
        target: id,
        type: "default",
        style: { stroke: "#9333ea", strokeWidth: 1.5 },

        sourceHandle: "bottom",
        targetHandle: "top",
      });
      levels[depth].edgeIds.push(edgeId);
    }

    if (node.children.length > 0) {
      const childIndices = treeInfo.nodeChildrenIndices[`${depth}-${horizontalIndex}`] || [];

      node.children.forEach((combination, combinationIndex) => {
        if (combination.length === 2) {
          const leftChildIndex = childIndices[combinationIndex * 2];
          const rightChildIndex = childIndices[combinationIndex * 2 + 1];

          const leftId = processNode(combination[0], 0, y + VERTICAL_SPACING, depth + 1, leftChildIndex);

          const rightId = processNode(combination[1], 0, y + VERTICAL_SPACING, depth + 1, rightChildIndex);

          const combineEdgeId = `combine-${leftId}-${rightId}`;
          edges.push({
            id: combineEdgeId,
            source: leftId,
            target: rightId,
            type: "default",
            style: { stroke: "#06b6d4", strokeWidth: 2 },

            sourceHandle: "top",
            targetHandle: "top",

            label: "+",
            labelStyle: { fill: "#06b6d4", fontWeight: "bold" },
            labelBgStyle: { fill: "rgba(0, 0, 0, 0.7)", fillOpacity: 0.7 },
            labelBgPadding: [4, 2],
            labelBgBorderRadius: 4,
          });
          levels[depth + 1].edgeIds.push(combineEdgeId);

          const resultLeftEdgeId = `result-${leftId}-${id}`;
          edges.push({
            id: resultLeftEdgeId,
            source: leftId,
            target: id,
            type: "default",
            style: { stroke: "#06b6d4", strokeDasharray: "5,5" },
            sourceHandle: "top",
            targetHandle: "bottom",
          });
          levels[depth + 1].edgeIds.push(resultLeftEdgeId);

          const resultRightEdgeId = `result-${rightId}-${id}`;
          edges.push({
            id: resultRightEdgeId,
            source: rightId,
            target: id,
            type: "default",
            style: { stroke: "#06b6d4", strokeDasharray: "5,5" },
            sourceHandle: "top",
            targetHandle: "bottom",
          });
          levels[depth + 1].edgeIds.push(resultRightEdgeId);
        }
      });
    }

    return id;
  }

  processNode(recipe, 0, 0, 0, Math.floor(treeInfo.levelWidths[0] / 2));

  return { nodes, edges, levels };
}

function analyzeTree(recipe: RecipeNode) {
  const levelWidths: Record<number, number> = {};
  const nodeChildrenIndices: Record<string, number[]> = {};
  let maxDepth = 0;

  function countNodesAtLevels(node: RecipeNode, depth: number, horizontalIndex: number) {
    maxDepth = Math.max(maxDepth, depth);

    levelWidths[depth] = (levelWidths[depth] || 0) + 1;

    if (node.children.length > 0) {
      const nodeKey = `${depth}-${horizontalIndex}`;
      nodeChildrenIndices[nodeKey] = [];

      let nextChildIndex = 0;
      if (depth + 1 in levelWidths) {
        nextChildIndex = levelWidths[depth + 1];
      }

      node.children.forEach((combination) => {
        if (combination.length === 2) {
          nodeChildrenIndices[nodeKey].push(nextChildIndex, nextChildIndex + 1);

          countNodesAtLevels(combination[0], depth + 1, nextChildIndex);
          nextChildIndex++;

          countNodesAtLevels(combination[1], depth + 1, nextChildIndex);
          nextChildIndex++;
        }
      });
    }
  }

  countNodesAtLevels(recipe, 0, 0);

  return {
    levelWidths,
    nodeChildrenIndices,
    maxDepth,
  };
}

function getMaxDepth(node: RecipeNode, currentDepth = 0): number {
  if (node.children.length === 0) {
    return currentDepth;
  }

  let maxChildDepth = currentDepth;

  node.children.forEach((combination) => {
    combination.forEach((child) => {
      const childDepth = getMaxDepth(child, currentDepth + 1);
      maxChildDepth = Math.max(maxChildDepth, childDepth);
    });
  });

  return maxChildDepth;
}
