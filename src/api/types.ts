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

export interface Device {
  id: number;
  created_at: string;
  brewery_id: number;
  name: string;
  secret_key: string;
}

export type BrewStatus = "pending" | "started" | "ended";

// This models the recipe snapshot inside a Brew:
export interface RecipeSnapshot {
  user_id: string;
  name: string;
  style: string;
  description?: string;
  targetABV?: number;
  targetIBU?: number;
  boilTimeMin?: number;
  mashTempC?: number;
  mashTimeMin?: number;
  grains: Grain[];
  hops: Hop[];
  yeasts: Yeast[];
  notes?: string | null;
  // add more recipe fields if your snapshot has them
}

export interface Brew {
  id: string;
  brewery_id: string;
  user_id: string;
  recipe_id: string;

  recipe_snapshot: RecipeSnapshot;

  created_at: string;
  ended_at?: string | null;
  status: BrewStatus;
  notes?: string | null;

  original_gravity?: number | null;
  final_gravity?: number | null;
  abv?: number | null;
  secret_key?: string | null;

  mash_status?: BrewStatus;
  mash_start?: string | null;
  mash_end?: string | null;

  boil_status?: BrewStatus;
  boil_start?: string | null;
  boil_end?: string | null;
}

export interface BrewTempLog {
  id: string;
  brew_id: string;
  temperature_celsius: number;
  recorded_at: string;
}
