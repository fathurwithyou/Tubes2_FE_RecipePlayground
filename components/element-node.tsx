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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className={`px-4 py-2 rounded-md shadow-md border ${
        element.isBasic ? "bg-green-100 border-green-300" : "bg-white border-gray-200"
      }`}
    >
      <Handle type="target" position={Position.Top} />
      <div className="flex items-center gap-2">
        <span className="text-lg">{element.emoji}</span>
        <span className="font-medium">{element.name}</span>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </motion.div>
  )
}

export default memo(ElementNode)
