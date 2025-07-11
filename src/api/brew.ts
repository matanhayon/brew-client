import axios from "axios";
import type { BeerRecipe } from "./types";

const API_URL = import.meta.env.VITE_API_URL;

export const getRecipeById = async (id: string): Promise<BeerRecipe> => {
  const res = await axios.get(`${API_URL}/recipes/${id}`);
  return res.data;
};

export const startBrew = async (params: {
  recipe_id: string;
  recipe_snapshot: BeerRecipe;
  brewery_id: string;
  user_id: string;
  notes: string;
  secret_key: string;
}): Promise<{ id: string }> => {
  const res = await axios.post(`${API_URL}/brews/start`, params);
  return res.data;
};

export const testBreweryConnection = async (
  brewery_id: string
): Promise<void> => {
  await axios.get(`${API_URL}/brewery/test-connection`, {
    params: { brewery_id },
  });
};

export const getBrewById = async (id: string | number) => {
  const res = await axios.get(`${API_URL}/brews/watch/${id}`);
  return res.data;
};

export const getBrewTempLogs = async (brewId: string | number) => {
  const res = await axios.get(`${API_URL}/brews/temperature_logs`, {
    params: { brew_id: brewId },
  });
  return res.data;
};

export const endBrew = async (brewId: string | number) => {
  const res = await axios.post(`${API_URL}/brews/end`, {
    brew_id: brewId,
  });
  return res.data;
};
