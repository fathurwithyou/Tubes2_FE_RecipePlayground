// Types
export interface Element {
  id: number
  name: string
  emoji?: string
  isBasic: boolean
}

export interface Recipe {
  result: Element
  ingredients: Element[]
}

export interface RecipeNode {
  element: Element
  children: RecipeNode[][]
}

export interface SearchResult {
  recipes: RecipeNode
  visitedNodes: number
  searchTime: number
}

export interface SearchParams {
  targetElement: string
  startElement?: string
  algorithm: "bfs" | "dfs" | "bidirectional"
  findMultiple: boolean
  maxRecipes?: number
}

// API URL - replace with your actual Golang backend URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

// Fetch all elements
export async function fetchElements(): Promise<Element[]> {
  const response = await fetch(`${API_URL}/api/elements`)
  if (!response.ok) {
    throw new Error("Failed to fetch elements")
  }
  return response.json()
}

// Search for recipes
export async function searchRecipes(params: SearchParams): Promise<SearchResult> {
  const response = await fetch(`${API_URL}/api/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  })

  if (!response.ok) {
    throw new Error("Failed to search for recipes")
  }

  return response.json()
}
