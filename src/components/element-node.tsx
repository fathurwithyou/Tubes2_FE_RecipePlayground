"use client"

import { memo } from "react"
import { Handle, Position } from "reactflow"
import { motion } from "framer-motion"

interface Element {
  id: number
  name: string
  emoji?: string
  isBasic: boolean
}

interface ElementNodeProps {
  data: {
    element: Element
    depth: number
  }
}

function ElementNode({ data }: ElementNodeProps) {
  const { element, depth } = data
  const isBasic = element.isBasic || ["Air", "Earth", "Fire", "Water"].includes(element.name)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className={`px-4 py-2 rounded-md shadow-md border ${
        isBasic
          ? "bg-gradient-to-br from-purple-900/80 to-purple-800/60 border-purple-700 text-white"
          : "bg-gradient-to-br from-cyan-900/80 to-cyan-800/60 border-cyan-700 text-white"
      }`}
    >
      {/* Added id to the handles for specific targeting */}
      <Handle id="top" type="source" position={Position.Top} className="!bg-purple-500" />
      <div className="flex items-center gap-2">
        <span className="text-lg">{element.emoji || "🧪"}</span>
        <span className="font-medium">{element.name}</span>
      </div>
      <Handle id="bottom" type="source" position={Position.Bottom} className="!bg-cyan-500" />

      {/* Add target handles at both top and bottom */}
      <Handle id="top" type="target" position={Position.Top} className="!bg-purple-500" />
      <Handle id="bottom" type="target" position={Position.Bottom} className="!bg-cyan-500" />
    </motion.div>
  )
}

export default memo(ElementNode)
