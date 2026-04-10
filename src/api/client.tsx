import axios from "axios";
import * as SecureStore from "expo-secure-store";

const BASE_URL = "http://127.0.0.1:8000/api";

const apiClient = axios.create({
  baseURL: BASE_URL,
  // headers: {
  //   "Content-Type": "application/json",
  // },
});

// Intercepteur pour ajouter automatiquement le Token JWT s'il existe
apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("userToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
