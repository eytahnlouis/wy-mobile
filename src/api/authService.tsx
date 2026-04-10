import apiClient from "./client";
import * as SecureStore from "expo-secure-store";

//  JWT Authentication Service
export const login = {
  register: async ({
    username,
    email,
    password,
    isDriver,
    license_plate,
  }: {
    username: string;
    email: string;
    password: string;
    isDriver: boolean;
    license_plate: string;
  }) => {
    const response = await apiClient.post("/auth/register/", {
      username,
      email,
      password,
      role: isDriver ? "2" : "1", // 1 pour passager, 2 pour conducteur
      license_plate: isDriver ? license_plate : null,
    });
    return response.data;
  },
  login: async ({ email, password }: { email: string; password: string }) => {
    const response = await apiClient.post("/auth/login/", {
      username: email,
      password,
    });

    const { access, refresh } = response.data;

    await SecureStore.setItemAsync("userToken", access);
    await SecureStore.setItemAsync("refreshToken", refresh);

    return response.data;
  },
  logout: async () => {
    await SecureStore.deleteItemAsync("userToken");
    await SecureStore.deleteItemAsync("refreshToken");
  },
};
