import axios from "axios";
import type { Device } from "./types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/devices",
});

// Get devices by brewery id (pass as query param)
export const getDevicesByBrewery = async (breweryId: number) => {
  return api.get<Device[]>("/by-brewery", {
    params: { brewery_id: breweryId },
  });
};

// Create new device
export const createDevice = async (device: {
  name: string;
  brewery_id: number;
}) => {
  return api.post<Device>("/create", device);
};

// Update device status
export const updateDevice = async (id: number, device: { status: string }) => {
  return api.patch<Device>(`/${id}/status`, device);
};

// Remove device
export const removeDevice = async (id: number) => {
  return api.delete(`/${id}`);
};
