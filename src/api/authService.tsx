import apiClient from "./client";
import * as SecureStore from "expo-secure-store"; 

// Service d'authentification (JWT)
export const login = {
    register : async(userData: any) => {
        const response = await apiClient.post("/auth/register", userData);
        return response.data;
    },
    login : async(credentials: any) => {
        const response = await apiClient.post("/auth/login", credentials);

        const {access, refresh} = response.data; 

        await SecureStore.setItemAsync("userToken", access);
        await SecureStore.setItemAsync("refreshToken", refresh);

        return response.data;
 
    },
    logout : async() => {
        await SecureStore.deleteItemAsync("userToken");
        await SecureStore.deleteItemAsync("refreshToken");
    },
}