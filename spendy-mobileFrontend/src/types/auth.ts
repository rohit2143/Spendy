export type AuthUser = {
  userId: number;
  name: string;
  email: string;
};

export type AuthResponse = AuthUser & {
  token: string;
  tokenType: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = LoginRequest & {
  name: string;
};

export type AuthState = {
  token: string | null;
  tokenType: string;
  user: AuthUser | null;
  isLoading: boolean;
  isRestoring: boolean;
  error: string | null;
};