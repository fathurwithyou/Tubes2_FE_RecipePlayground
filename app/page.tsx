"use client";

import { useState } from "react";
import RecipeFinder from "@/components/recipe-finder";
import { ThemeProvider } from "@/components/theme-provider";
import { motion } from "framer-motion";
import { ArrowRight, Github, Code, Search, Cpu, Layers, Users, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [showMainApp, setShowMainApp] = useState(false);

  const handleGetStarted = () => {
    setShowMainApp(true);
    setTimeout(() => {
      document.getElementById("main-app")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="theme">
      <div className="bg-gradient-to-br from-gray-900 via-slate-900 to-zinc-900 min-h-screen">
        <section className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
          <div className="max-w-5xl w-full">
            <div className="text-center mb-12">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-8 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full blur-xl bg-gradient-to-r from-purple-500 to-cyan-500 opacity-70"></div>
                  <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-black border-2 border-purple-500">
                    <span className="text-4xl">🧪</span>
                  </div>
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-4xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                Little Alchemy 2
                <br />
                Recipe Finder
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
                Discover the perfect combinations to create any element in Little Alchemy 2 using advanced graph search
                algorithms. Visualize the recipe trees and find multiple paths to your desired elements with optimized
                multithreading performance.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}>
                <Button
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-8 py-6 rounded-lg text-lg font-medium shadow-lg">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.5 }}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="p-6 rounded-lg bg-black/30 border border-purple-900 backdrop-blur-sm">
                  <div className="mb-4 bg-purple-900/30 w-12 h-12 rounded-full flex items-center justify-center">
                    <Search className="h-6 w-6 text-purple-400" />
                  </div>
                  <h3 className="text-purple-400 font-medium text-xl mb-2">BFS Algorithm</h3>
                  <p className="text-gray-300">
                    Breadth-First Search finds the shortest recipe paths by exploring all possible combinations level by level.
                  </p>
                </div>

                <div className="p-6 rounded-lg bg-black/30 border border-cyan-900 backdrop-blur-sm">
                  <div className="mb-4 bg-cyan-900/30 w-12 h-12 rounded-full flex items-center justify-center">
                    <Cpu className="h-6 w-6 text-cyan-400" />
                  </div>
                  <h3 className="text-cyan-400 font-medium text-xl mb-2">DFS Algorithm</h3>
                  <p className="text-gray-300">
                    Depth-First Search explores deep recipe combinations first, finding complex paths to create elements.
                  </p>
                </div>

                <div className="p-6 rounded-lg bg-black/30 border border-purple-900 backdrop-blur-sm">
                  <div className="mb-4 bg-purple-900/30 w-12 h-12 rounded-full flex items-center justify-center">
                    <Layers className="h-6 w-6 text-purple-400" />
                  </div>
                  <h3 className="text-purple-400 font-medium text-xl mb-2">Multithreading</h3>
                  <p className="text-gray-300">
                    Optimized with multithreading to efficiently search for multiple recipes in parallel, delivering faster
                    results.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-lg bg-black/30 border border-cyan-900 backdrop-blur-sm mb-12">
                <div className="flex items-center mb-4">
                  <div className="bg-cyan-900/30 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                    <Code className="h-6 w-6 text-cyan-400" />
                  </div>
                  <h3 className="text-cyan-400 font-medium text-xl">Animated Visualization</h3>
                </div>
                <p className="text-gray-300">
                  Watch the recipe tree build step by step with beautiful animations showing how elements combine. Our backend
                  uses multithreading to optimize the search for multiple recipes, making the process faster and more efficient.
                  The visualization helps you understand the complex combinations needed to create your desired elements.
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.5 }}
                className="mb-12">
                <div className="p-6 rounded-lg bg-gradient-to-r from-purple-900/30 to-cyan-900/30 border border-purple-800 backdrop-blur-sm">
                  <div className="flex items-center mb-6">
                    <div className="bg-purple-900/30 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                      <Users className="h-6 w-6 text-purple-400" />
                    </div>
                    <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 font-medium text-2xl">
                      Contributors
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Contributor 1 */}
                    <div className="p-4 rounded-lg bg-black/40 border border-purple-900/50 backdrop-blur-sm">
                      <div className="flex flex-col items-center text-center mb-3">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-purple-800 flex items-center justify-center mb-3">
                          <span className="text-white font-bold text-xl">AR</span>
                        </div>
                        <h4 className="text-white font-medium text-lg">Adiel Rum</h4>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-300">
                          <Mail className="h-4 w-4 mr-2 text-purple-400" />
                          <span className="text-sm truncate">10123004@mahasiswa.itb.ac.id</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-black/40 border border-cyan-900/50 backdrop-blur-sm">
                      <div className="flex flex-col items-center text-center mb-3">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-600 to-cyan-800 flex items-center justify-center mb-3">
                          <span className="text-white font-bold text-xl">MF</span>
                        </div>
                        <h4 className="text-white font-medium text-lg">Muhammad Fathur Rizky</h4>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-300">
                          <Mail className="h-4 w-4 mr-2 text-cyan-400" />
                          <span className="text-sm truncate">13523105@std.stei.itb.ac.id</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-black/40 border border-purple-900/50 backdrop-blur-sm">
                      <div className="flex flex-col items-center text-center mb-3">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-purple-800 flex items-center justify-center mb-3">
                          <span className="text-white font-bold text-xl">AW</span>
                        </div>
                        <h4 className="text-white font-medium text-lg">Ahmad Wafi Idzharulhaqq</h4>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-300">
                          <Mail className="h-4 w-4 mr-2 text-purple-400" />
                          <span className="text-sm truncate">13523131@std.stei.itb.ac.id</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="text-center text-gray-400 text-sm">
              <p className="mb-2">Created for Tubes 2 - Little Alchemy 2 Recipe Playground</p>
              <div className="flex items-center justify-center">
                <a
                  href="https://github.com/fathurwithyou/Tubes2_BE_RecipePlayground"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-purple-400 hover:text-purple-300 transition-colors">
                  <Github className="h-4 w-4 mr-1" /> Backend Repository
                </a>
                <span className="mx-2">•</span>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-cyan-400 hover:text-cyan-300 transition-colors">
                  <Github className="h-4 w-4 mr-1" /> Frontend Repository
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="main-app" className="p-4 md:p-8">
          <div className="container mx-auto max-w-6xl">
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 md:text-4xl">
                Little Alchemy 2 Recipe Finder
              </h1>
              <p className="text-gray-300">Find recipes using BFS and DFS algorithms with multithreading optimization</p>
            </div>
            <RecipeFinder />
          </div>
        </section>
      </div>
    </ThemeProvider>
  );
}
