import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authService } from "@/src/services/authService";
import { getApiError, setAuthToken } from "@/src/services/api";
import { AUTH_STORAGE_KEY } from "@/src/utils/constants";
import type { AuthResponse, AuthState, LoginRequest, RegisterRequest } from "@/src/types/auth";

const initialState: AuthState = {
  token: null,
  tokenType: "Bearer",
  user: null,
  isLoading: false,
  isRestoring: true,
  error: null
};

function applySession(state: AuthState, session: AuthResponse) {
  state.token = session.token;
  state.tokenType = session.tokenType || "Bearer";
  state.user = {
    userId: session.userId,
    name: session.name,
    email: session.email
  };
  state.error = null;
  setAuthToken(session.token, state.tokenType);
}

async function persistSession(session: AuthResponse) {
  await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export const restoreSession = createAsyncThunk("auth/restoreSession", async () => {
  const rawSession = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
  return rawSession ? (JSON.parse(rawSession) as AuthResponse) : null;
});

export const login = createAsyncThunk("auth/login", async (payload: LoginRequest, thunkApi) => {
  try {
    const session = await authService.login(payload);
    await persistSession(session);
    return session;
  } catch (error) {
    return thunkApi.rejectWithValue(getApiError(error));
  }
});

export const register = createAsyncThunk(
  "auth/register",
  async (payload: RegisterRequest, thunkApi) => {
    try {
      const session = await authService.register(payload);
      await persistSession(session);
      return session;
    } catch (error) {
      return thunkApi.rejectWithValue(getApiError(error));
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
  setAuthToken(null);
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(restoreSession.pending, (state) => {
        state.isRestoring = true;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.isRestoring = false;
        if (action.payload) applySession(state, action.payload);
      })
      .addCase(restoreSession.rejected, (state) => {
        state.isRestoring = false;
        state.token = null;
        state.user = null;
        setAuthToken(null);
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        applySession(state, action.payload);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = String(action.payload ?? "Login failed.");
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        applySession(state, action.payload);
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = String(action.payload ?? "Registration failed.");
      })
      .addCase(logout.fulfilled, (state) => {
        state.token = null;
        state.user = null;
        state.error = null;
      });
  }
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;