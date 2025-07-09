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

export interface Grain {
  name: string;
  amount: string;
}

export interface Hop {
  name: string;
  amount: string;
  time: string; // e.g. "60 min", "dry hop", etc.
}

export interface Yeast {
  name: string;
  temperature?: string; // e.g. "18–22°C" or optional if not always known
}

export interface BeerRecipe {
  id: string;
  created_at: string;
  name: string;
  style: string;
  description?: string;

  targetABV?: number;
  targetIBU?: number;
  targetSRM?: number | string;
  originalGravity?: string;
  finalGravity?: string;
  batchSize?: string;
  boilTimeMin?: number;
  mashTempC?: number;
  mashTimeMin?: number;

  imageUrl?: string;
  notes?: string;
  brewedCount?: number;

  user_id: string;

  grains: Grain[];
  hops: Hop[];
  yeasts: Yeast[];
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
