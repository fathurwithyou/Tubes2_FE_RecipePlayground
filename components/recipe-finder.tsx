"use client"

import { useState, useEffect } from "react"
import { Search, Clock, Hash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import RecipeTree from "@/components/recipe-tree"
import { Slider } from "@/components/ui/slider"
import { Loader2 } from "lucide-react"
import { motion } from "framer-motion"

// Types
interface Element {
  id: number
  name: string
  emoji?: string
  isBasic: boolean
}

interface Recipe {
  result: Element
  ingredients: Element[]
}

interface RecipeNode {
  element: Element
  children: RecipeNode[][]
}

interface SearchResult {
  recipes: RecipeNode
  visitedNodes: number
  searchTime: number
}

export default function RecipeFinder() {
  const [elements, setElements] = useState<Element[]>([])
  const [startElement, setStartElement] = useState<string>("")
  const [targetElement, setTargElement] = useState<string>("")
  const [algorithm, setAlgorithm] = useState<"bfs" | "dfs" | "bidirectional">("bfs")
  const [findMultiple, setFindMultiple] = useState<boolean>(false)
  const [maxRecipes, setMaxRecipes] = useState<number>(5)
  const [loading, setLoading] = useState<boolean>(false)
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Fetch elements on component mount
  useEffect(() => {
    // In a real implementation, this would fetch from your Golang backend
    // For now, we'll use mock data
    const mockElements: Element[] = [
      { id: 1, name: "Air", emoji: "💨", isBasic: true },
      { id: 2, name: "Earth", emoji: "🌍", isBasic: true },
      { id: 3, name: "Fire", emoji: "🔥", isBasic: true },
      { id: 4, name: "Water", emoji: "💧", isBasic: true },
      { id: 5, name: "Lava", emoji: "🌋", isBasic: false },
      { id: 6, name: "Mud", emoji: "💩", isBasic: false },
      { id: 7, name: "Steam", emoji: "♨️", isBasic: false },
      { id: 8, name: "Pressure", emoji: "🔄", isBasic: false },
      { id: 9, name: "Stone", emoji: "🪨", isBasic: false },
      { id: 10, name: "Clay", emoji: "🧱", isBasic: false },
      { id: 11, name: "Sand", emoji: "🏝️", isBasic: false },
      { id: 12, name: "Brick", emoji: "🧱", isBasic: false },
    ]
    setElements(mockElements)
  }, [])

  const handleSearch = async () => {
    if (!targetElement) {
      setError("Please select a target element")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // In a real implementation, this would call your Golang backend
      // For now, we'll simulate a response
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock search result
      const mockResult: SearchResult = {
        recipes: createMockRecipeTree(),
        visitedNodes: 42,
        searchTime: 0.35,
      }

      setSearchResult(mockResult)
    } catch (err) {
      setError("Failed to search for recipes. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // This function creates a mock recipe tree for demonstration
  const createMockRecipeTree = (): RecipeNode => {
    const brick = elements.find((e) => e.name === "Brick") || elements[11]
    const mud = elements.find((e) => e.name === "Mud") || elements[5]
    const fire = elements.find((e) => e.name === "Fire") || elements[2]
    const clay = elements.find((e) => e.name === "Clay") || elements[9]
    const stone = elements.find((e) => e.name === "Stone") || elements[8]
    const water = elements.find((e) => e.name === "Water") || elements[3]
    const earth = elements.find((e) => e.name === "Earth") || elements[1]
    const lava = elements.find((e) => e.name === "Lava") || elements[4]
    const air = elements.find((e) => e.name === "Air") || elements[0]
    const pressure = elements.find((e) => e.name === "Pressure") || elements[7]
    const sand = elements.find((e) => e.name === "Sand") || elements[10]

    return {
      element: brick,
      children: [
        [
          {
            element: mud,
            children: [
              [
                {
                  element: water,
                  children: [],
                },
                {
                  element: earth,
                  children: [],
                },
              ],
            ],
          },
          {
            element: fire,
            children: [],
          },
        ],
        [
          {
            element: clay,
            children: [],
          },
          {
            element: stone,
            children: [
              [
                {
                  element: lava,
                  children: [
                    [
                      {
                        element: earth,
                        children: [],
                      },
                      {
                        element: fire,
                        children: [],
                      },
                    ],
                  ],
                },
                {
                  element: air,
                  children: [],
                },
              ],
              [
                {
                  element: earth,
                  children: [],
                },
                {
                  element: pressure,
                  children: [],
                },
              ],
            ],
          },
        ],
      ],
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Search Parameters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <Label htmlFor="algorithm">Algorithm</Label>
                <Tabs
                  defaultValue="bfs"
                  className="mt-2"
                  onValueChange={(value) => setAlgorithm(value as "bfs" | "dfs" | "bidirectional")}
                >
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="bfs">BFS</TabsTrigger>
                    <TabsTrigger value="dfs">DFS</TabsTrigger>
                    <TabsTrigger value="bidirectional">Bidirectional</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div>
                <Label htmlFor="target">Target Element</Label>
                <Select onValueChange={setTargElement}>
                  <SelectTrigger id="target" className="mt-2">
                    <SelectValue placeholder="Select element" />
                  </SelectTrigger>
                  <SelectContent>
                    {elements
                      .filter((e) => !e.isBasic)
                      .map((element) => (
                        <SelectItem key={element.id} value={element.name}>
                          {element.emoji} {element.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="start">Starting Elements (Optional)</Label>
                <Select onValueChange={setStartElement}>
                  <SelectTrigger id="start" className="mt-2">
                    <SelectValue placeholder="Default: All basic elements" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">All Basic Elements</SelectItem>
                    {elements
                      .filter((e) => e.isBasic)
                      .map((element) => (
                        <SelectItem key={element.id} value={element.name}>
                          {element.emoji} {element.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch id="multiple" checked={findMultiple} onCheckedChange={setFindMultiple} />
                <Label htmlFor="multiple">Find Multiple Recipes</Label>
              </div>

              {findMultiple && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="max-recipes">Maximum Recipes: {maxRecipes}</Label>
                  </div>
                  <Slider
                    id="max-recipes"
                    min={1}
                    max={20}
                    step={1}
                    value={[maxRecipes]}
                    onValueChange={(value) => setMaxRecipes(value[0])}
                  />
                </div>
              )}

              <Button className="w-full mt-6" onClick={handleSearch} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Find Recipes
                  </>
                )}
              </Button>

              {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {searchResult && (
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Search Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Search time: {searchResult.searchTime.toFixed(3)}s
                  </span>
                </div>
                <div className="flex items-center">
                  <Hash className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Nodes visited: {searchResult.visitedNodes}</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <RecipeTree recipe={searchResult.recipes} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
