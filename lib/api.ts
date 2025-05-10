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
    Allergy: "🤧",
    Alligator: "🐊",
    Alpaca: "🦙",
    Ambulance: "🚑",
    Angel: "😇",
    Angler: "🎣",
    Ant: "🐜",
    "Ant farm": "🐜🏠",
    Antarctica: "❄️🌍",
    Anthill: "🐜🏠",
    Apron: "👗",
    Aquarium: "🐠🐟",
    Archeologist: "🦴🧑‍🔬",
    Archipelago: "🏝️🏝️🏝️",
    Arctic: "❄️🏔️",
    Armadillo: "🦔",
    Armor: "🛡️",
    Arrow: "➡️",
    Ash: "🌑",
    Astronaut: "👩‍🚀",
    Astronomer: "🔭",
    Atmosphere: "🌌",
    "Atomic bomb": "💥",
    Aurora: "🌌",
    Avalanche: "🌨️",
    Aviary: "🐦🏠",
    Axe: "🪓",
    Bacon: "🥓",
    Bacteria: "🦠",
    Baker: "🍞",
    Bakery: "🥐",
    Banana: "🍌",
    "Banana bread": "🍌🍞",
    Bandage: "🩹",
    Bank: "🏦",
    Barn: "🏚️",
    Barrel: "🛢️",
    Bat: "🦇",
    Batter: "🥣",
    Battery: "🔋",
    Bayonet: "🔪",
    Bbq: "🍖",
    Beach: "🏖️",
    Beaver: "🦫",
    Bee: "🐝",
    Beehive: "🐝🏠",
    Beekeeper: "👨‍🌾🐝",
    Beer: "🍺",
    Bell: "🔔",
    Bicycle: "🚲",
    Big: "📏",
    Binoculars: "🔭",
    Bird: "🐦",
    Birdcage: "🐦🏠",
    Birdhouse: "🐦🏠",
    "Black hole": "🕳️",
    Blade: "🗡️",
    Blender: "🥤",
    Blizzard: "❄️🌪️",
    Blood: "🩸",
    "Blood bag": "🩸💉",
    Boat: "🚤",
    Boiler: "🔥💧",
    Bone: "🦴",
    "Bonsai tree": "🌳🪴",
    Book: "📚",
    Bottle: "🍾",
    Boulder: "🪨",
    Bow: "🏹",
    Box: "📦",
    Bread: "🍞",
    Bridge: "🌉",
    Broom: "🧹",
    Bucket: "🪣",
    Bullet: "🔫",
    "Bulletproof vest": "🦸‍♂️🦸‍♀️",
    Bus: "🚍",
    Butcher: "🥩",
    Butter: "🧈",
    Butterfly: "🦋",
    "Butterfly net": "🦋🎣",
    Cactus: "🌵",
    Cage: "🪤",
    Cake: "🎂",
    Camel: "🐪",
    Campfire: "🔥🏕️",
    Candle: "🕯️",
    "Candy cane": "🍬🍭",
    Cannon: "🔫",
    Canvas: "🖼️",
    Car: "🚗",
    Caramel: "🍮",
    "Carbon dioxide": "💨",
    Carrot: "🥕",
    Cart: "🛒",
    Cashmere: "🧣",
    Castle: "🏰",
    Cat: "🐱",
    Catnip: "🌿🐱",
    Cauldron: "🍲",
    Cave: "⛏️",
    Caviar: "🍣",
    Centaur: "🦄🤺",
    Cereal: "🥣",
    Chain: "⛓️",
    Chainsaw: "🪚",
    Chameleon: "🦎",
    Charcoal: "🪵🔥",
    Cheese: "🧀",
    Cheeseburger: "🍔",
    Chicken: "🐔",
    "Chicken coop": "🐔🏠",
    "Chicken soup": "🍲🐔",
    "Chicken wing": "🍗",
    Chill: "❄️😎",
    Chimney: "🏠🔥",
    Chocolate: "🍫",
    "Chocolate milk": "🍫🥛",
    "Christmas stocking": "🧦🎄",
    "Christmas tree": "🎄🎅",
    Cigarette: "🚬",
    Circus: "🎪",
    Clock: "🕰️",
    Closet: "🚪",
    Coal: "🪨🔥",
    Coconut: "🥥",
    "Coconut milk": "🥥🥛",
    Coffin: "⚰️",
    "Combustion engine": "🔥💥",
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
    visitedNodes: data.visited_node_count,
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
