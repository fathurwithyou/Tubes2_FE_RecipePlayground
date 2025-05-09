"use client"

import { useState, useEffect } from "react"
import { Search, Clock, Hash } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Switch } from "../components/ui/switch"
import { Label } from "../components/ui/label"
import RecipeTree from "../components/recipe-tree"
import { Slider } from "../components/ui/slider"
import { Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { fetchElements, searchRecipes } from "../lib/api"

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
  
    // In a real implementation, this would fetch from your Golang backend
    // For now, we'll use mock data
  useEffect(() => {
    const loadElements = async () => {
      try {
        const fetchedElements = await fetchElements()
        setElements(fetchedElements)
      } catch (err) {
        setError("Failed to load elements from database.")
        console.error(err)
      }
    }
    loadElements()
  }, [])

  const handleSearch = async () => {
  if (!targetElement) {
    setError("Please select a target element")
    return
  }

  setLoading(true)
  setError(null)

  try {
    // Optional delay for testing purposes; remove if not needed
    await new Promise<void>((resolve) => setTimeout(resolve, 1500))

    const params = {
      targetElement,
      startElement: startElement === "basic" ? undefined : startElement,
      algorithm,
      findMultiple,
      maxRecipes: findMultiple ? maxRecipes : undefined,
    }

    const searchResult = await searchRecipes(params)
    setSearchResult(searchResult)
  } catch (err) {
    setError("Failed to search for recipes. Please try again.")
    console.error(err)
  } finally {
    setLoading(false)
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
