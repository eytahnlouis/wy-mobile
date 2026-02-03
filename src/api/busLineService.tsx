import apiClient from "./client";

export interface BusLine {
  id: number;
  route_id: string;
  name: string;
}

export const busLineService = {
  getAll: async (): Promise<BusLine[]> => {
    const response = await apiClient.get("/gtfs/buslines/");
    return response.data;
  },

  getById: async (id: number): Promise<BusLine> => {
    const response = await apiClient.get(`/gtfs/buslines/${id}/`);
    return response.data;
  },
};
