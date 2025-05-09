export interface Element {
  id: number;
  name: string;
  emoji?: string;
  isBasic: boolean;
}

export interface Recipe {
  result: Element;
  ingredients: Element[];
}

export interface RecipeNode {
  element: Element;
  children: RecipeNode[][];
}

export interface SearchResult {
  recipes: RecipeNode;
  visitedNodes: number;
  searchTime: number;
}

export interface SearchParams {
  method: "bfs" | "dfs";
  target: string;
  maxRecipes: number;
}

export async function fetchElements(): Promise<Element[]> {
  const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/elements");
  if (!response.ok) {
    throw new Error("Failed to fetch elements");
  }

  const data = await response.json();
  const elementNames: string[] = data.elements || [];

  return elementNames.map((name, index) => ({
    id: index + 1,
    name: name,
    emoji: getElementEmoji(name),
    isBasic: isBasicElement(name),
  }));
}

function isBasicElement(name: string): boolean {
  const basicElements = ["Air", "Earth", "Fire", "Water"];
  return basicElements.includes(name);
}

function getElementEmoji(name: string): string {
  const emojiMap: Record<string, string> = {
    Air: "💨",
    Earth: "🌍",
    Fire: "🔥",
    Water: "💧",
    Wind: "🌬️",
    Dust: "💨",
    Lava: "🌋",
    Mud: "💩",
    Rain: "🌧️",
    Steam: "♨️",
    Sea: "🌊",
    Pressure: "🔄",
    Stone: "🪨",
    Metal: "⚙️",
    Wood: "🪵",
    Life: "🌱",
    Human: "👤",
    Animal: "🐾",
    Plant: "🌿",
    Tool: "🔨",
    Electricity: "⚡",
    Light: "💡",
    Time: "⏰",
    Glass: "🥃",
    Sand: "🏝️",
    Clay: "🏺",
    Brick: "🧱",
    House: "🏠",
    City: "🏙️",
    Volcano: "🌋",
    Ocean: "🌊",
    Mountain: "⛰️",
    Sky: "🌤️",
    Sun: "☀️",
    Moon: "🌙",
    Star: "⭐",
    Cloud: "☁️",
    Snow: "❄️",
    Ice: "🧊",
    Fog: "🌫️",
    Storm: "⛈️",
    Thunder: "🌩️",
    Lightning: "⚡",
    Rainbow: "🌈",
    Day: "🌞",
    Night: "🌃",
    Darkness: "🌑",
    Energy: "✨",
    Heat: "🔥",
    Cold: "❄️",
    Sound: "🔊",
    Music: "🎵",
    Noise: "📢",
    Airplane: "✈️",
    "Alarm clock": "⏰",
    Alchemist: "🧙",
    Alcohol: "🍸",
    Algae: "🦠",
    Alien: "👽",
    "Acid rain": "🌧️",
  };

  return emojiMap[name] || "🧪";
}

export async function searchRecipes(params: SearchParams): Promise<SearchResult> {
  const { method, target, maxRecipes } = params;
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/solve/${method}/${target}/${maxRecipes}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Recipe not found for the target element");
    }
    throw new Error("Failed to search for recipes");
  }

  const data = await response.json();

  const recipeTree = convertApiResponseToRecipeTree(data.result, target);

  return {
    recipes: recipeTree,
    visitedNodes: 0,
    searchTime: 0,
  };
}

function convertApiResponseToRecipeTree(apiResult: any, targetName: string): RecipeNode {
  const rootElement: Element = {
    id: 0,
    name: targetName,
    emoji: getElementEmoji(targetName),
    isBasic: false,
  };

  if (!apiResult || !apiResult[targetName]) {
    return {
      element: rootElement,
      children: [],
    };
  }

  const recipes = apiResult[targetName];
  const children: RecipeNode[][] = [];

  for (const recipe of recipes) {
    const combination: RecipeNode[] = [];

    for (const ingredient of recipe) {
      if (typeof ingredient === "string") {
        combination.push({
          element: {
            id: 0,
            name: ingredient,
            emoji: getElementEmoji(ingredient),
            isBasic: true,
          },
          children: [],
        });
      } else {
        const [elementName, elementRecipes] = Object.entries(ingredient)[0];

        const subResult: any = {};
        subResult[elementName] = elementRecipes;

        combination.push(convertApiResponseToRecipeTree(subResult, elementName));
      }
    }

    children.push(combination);
  }

  return {
    element: rootElement,
    children: children,
  };
}
