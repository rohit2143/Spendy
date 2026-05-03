import { api } from "./api";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "@/src/types/auth";

export const authService = {
  async login(payload: LoginRequest) {
    const response = await api.post<AuthResponse>(
      "/auth/login",
      payload
    );
    return response.data;
  },

  async register(payload: RegisterRequest) {
    const response = await api.post<AuthResponse>(
      "/auth/register",
      payload
    );
    return response.data;
  },
};
