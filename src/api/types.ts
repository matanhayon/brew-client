// types/brewery.ts

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "brewer" | "viewer";
  joinedAt: string; // ISO 8601 date
  breweryName?: string;

  equipment?: BrewingEquipment[];
  recipes?: BeerRecipe[];
  favoriteBeers?: Beer[];
}

export interface BrewingEquipment {
  id: string;
  name: string;
  type: "fermenter" | "boilKettle" | "mashTun" | "controller" | "custom";
  status: "online" | "offline" | "maintenance";
  volumeLiters: number;
  firmwareVersion?: string;
}

export interface Beer {
  id: string;
  name: string;
  style: string;
  abv: number; // Alcohol by volume
  ibu: number; // Bitterness
  description?: string;
  brewedOn?: string; // ISO 8601 date
  recipeId?: string;
}

export interface BeerRecipe {
  id: string;
  name: string;
  style: string;
  description?: string;
  createdBy: string; // userId

  ingredients: Ingredient[];
  steps: BrewingStep[];

  targetABV?: number; // Alcohol by Volume
  targetIBU?: number; // Bitterness
  targetSRM?: number | string; // Color (can be a range like "4–10")
  originalGravity?: string; // OG e.g. "1.055–1.065"
  finalGravity?: string; // FG e.g. "varies with yeast"

  batchSize?: string; // e.g. "1 gal", "5 gal"
  boilTimeMin?: number; // e.g. 60
  mashTempC?: number; // Average mash temp
  mashTimeMin?: number; // e.g. 60

  imageUrl?: string;

  // Optional article or reference
  notes?: string; // Author’s personal notes or insights
  brewedCount?: number; // Times brewed by community
}

export const INGREDIENT_TYPES = [
  "grain",
  "hops",
  "yeast",
  "adjunct",
  "water",
] as const;

export type IngredientType = (typeof INGREDIENT_TYPES)[number];

export interface Ingredient {
  name: string;
  amount: string; // e.g., "5kg", "20g", "10L"
  type: IngredientType;
}

export interface BrewingStep {
  stepNumber: number;
  action: string; // e.g., "Mash", "Boil", "Ferment"
  temperatureC?: number;
  durationMin?: number;
  notes?: string;
}
