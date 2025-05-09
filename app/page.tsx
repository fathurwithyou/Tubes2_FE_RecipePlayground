import RecipeFinder from "@/components/recipe-finder"
import { ThemeProvider } from "@/components/theme-provider"

export default function Home() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="theme">
      <main className="min-h-screen bg-background p-4 md:p-8">
        <div className="container mx-auto max-w-6xl">
          <h1 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">Little Alchemy 2 Recipe Finder</h1>
          <p className="mb-8 text-muted-foreground">
            Find recipes using BFS and DFS algorithms to create elements in Little Alchemy 2
          </p>
          <RecipeFinder />
        </div>
      </main>
    </ThemeProvider>
  )
}
