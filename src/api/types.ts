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
  targetABV?: number;
  targetIBU?: number;
}

export interface Ingredient {
  name: string;
  amount: string; // e.g., "5kg", "20g", "10L"
  type: "grain" | "hops" | "yeast" | "adjunct" | "water";
}

export interface BrewingStep {
  stepNumber: number;
  action: string; // e.g., "Mash", "Boil", "Ferment"
  temperatureC?: number;
  durationMin?: number;
  notes?: string;
}
