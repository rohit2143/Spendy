import axios, { isAxiosError } from "axios";
import { API_BASE_URL } from "@/src/utils/constants";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

export function setAuthToken(token?: string | null, tokenType = "Bearer") {
  if (token?.trim()) {
    api.defaults.headers.common["Authorization"] = `${tokenType} ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

export function getApiError(error: unknown): string {
  if (isAxiosError(error)) {
    if (error.code === "ECONNABORTED") {
      return "Request timed out. Please try again.";
    }

    if (!error.response) {
      return "Network error. Please check your internet connection.";
    }

    const data = error.response.data as {
      message?: string;
      error?: string;
    } | undefined;

    return data?.message ?? data?.error ?? error.message;
  }

  return "Something went wrong. Please try again.";
}