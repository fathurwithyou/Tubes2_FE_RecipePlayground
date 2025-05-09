import { NextResponse } from 'next/server';

// Sample backend data matching the structure from your scraper
const elementsData = {
  elements: [
    {
      name: "Air",
      recipes: [["Fire", "Mist"]],
      tier: 0,
    },
    {
      name: "Earth",
      recipes: null,
      tier: 0,
    },
    {
      name: "Fire",
      recipes: [
        ["Fire", "Alcohol"],
        ["Fire", "Coal"],
      ],
      tier: 0,
    },
    {
      name: "Water",
      recipes: [
        ["Heat", "Ice"],
        ["Heat", "Snow"],
      ],
      tier: 0,
    },
    // Add more elements as needed for testing
  ],
};

export async function GET() {
  return NextResponse.json(elementsData);
}
