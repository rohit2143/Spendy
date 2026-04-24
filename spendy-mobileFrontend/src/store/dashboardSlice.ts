import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { dashboardService } from "@/src/services/dashboardService";
import { getApiError } from "@/src/services/api";
import type { DashboardState } from "@/src/types/dashboard";

const now = new Date();

const initialState: DashboardState = {
  summary: null,
  recentTransactions: [],
  isLoading: false,
  error: null,
  selectedDate: {
    year: now.getFullYear(),
    month: now.getMonth() + 1
  }
};

export const fetchDashboard = createAsyncThunk(
  "dashboard/fetchDashboard",
  async (payload: { userId: number; year: number; month: number }, thunkApi) => {
    try {
      const [summary, recentTransactions] = await Promise.all([
        dashboardService.getSummary(payload.userId, payload.year, payload.month),
        dashboardService.getRecentTransactions(payload.userId)
      ]);

      return { summary, recentTransactions };
    } catch (error) {
      return thunkApi.rejectWithValue(getApiError(error));
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setDashboardMonth(state, action: PayloadAction<{ year: number; month: number }>) {
      state.selectedDate = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.summary = action.payload.summary;
        state.recentTransactions = action.payload.recentTransactions;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = String(action.payload ?? "Unable to load dashboard.");
      });
  }
});

export const { setDashboardMonth } = dashboardSlice.actions;
export default dashboardSlice.reducer;
