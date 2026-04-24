import { Platform } from "react-native";

export const API_BASE_URL =
  Platform.OS === "android" ? "http://10.0.2.2:8085/api" : "http://localhost:8085/api";

export const AUTH_STORAGE_KEY = "spendy.auth.session";