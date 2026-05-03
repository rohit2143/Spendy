import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getApiError } from "@/src/services/api";
import { budgetService } from "@/src/services/budgetService";
import { transactionService } from "@/src/services/transactionService";
import type { BudgetPayload, BudgetState } from "@/src/types/budget";

const now = new Date();

function getMonthRange(year: number, month: number) {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0);

  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10)
  };
}

const initialState: BudgetState = {
  items: [],
  selectedBudget: null,
  spentByCategory: {},
  isLoading: false,
  isSubmitting: false,
  error: null,
  selectedDate: {
    year: now.getFullYear(),
    month: now.getMonth() + 1
  }
};

export const fetchBudgetsOverview = createAsyncThunk(
  "budgets/fetchBudgetsOverview",
  async (payload: { userId: number; budgetYear: number; budgetMonth: number }, thunkApi) => {
    try {
      const { startDate, endDate } = getMonthRange(payload.budgetYear, payload.budgetMonth);
      const [budgets, transactions] = await Promise.all([
        budgetService.getBudgets(payload.userId, {
          budgetYear: payload.budgetYear,
          budgetMonth: payload.budgetMonth
        }),
        transactionService.getTransactions(payload.userId, {
          type: "EXPENSE",
          startDate,
          endDate
        })
      ]);

      const spentByCategory = transactions.reduce<Record<number, number>>((acc, transaction) => {
        acc[transaction.categoryId] = (acc[transaction.categoryId] ?? 0) + Number(transaction.amount);
        return acc;
      }, {});

      return { budgets, spentByCategory };
    } catch (error) {
      return thunkApi.rejectWithValue(getApiError(error));
    }
  }
);

export const fetchBudgetById = createAsyncThunk(
  "budgets/fetchBudgetById",
  async (payload: { userId: number; budgetId: number }, thunkApi) => {
    try {
      return await budgetService.getBudgetById(payload.userId, payload.budgetId);
    } catch (error) {
      return thunkApi.rejectWithValue(getApiError(error));
    }
  }
);

export const createBudget = createAsyncThunk(
  "budgets/createBudget",
  async (payload: { userId: number; data: BudgetPayload }, thunkApi) => {
    try {
      return await budgetService.createBudget(payload.userId, payload.data);
    } catch (error) {
      return thunkApi.rejectWithValue(getApiError(error));
    }
  }
);

export const updateBudget = createAsyncThunk(
  "budgets/updateBudget",
  async (payload: { userId: number; budgetId: number; data: BudgetPayload }, thunkApi) => {
    try {
      return await budgetService.updateBudget(payload.userId, payload.budgetId, payload.data);
    } catch (error) {
      return thunkApi.rejectWithValue(getApiError(error));
    }
  }
);

export const deleteBudget = createAsyncThunk(
  "budgets/deleteBudget",
  async (payload: { userId: number; budgetId: number }, thunkApi) => {
    try {
      return await budgetService.deleteBudget(payload.userId, payload.budgetId);
    } catch (error) {
      return thunkApi.rejectWithValue(getApiError(error));
    }
  }
);

const budgetSlice = createSlice({
  name: "budgets",
  initialState,
  reducers: {
    setBudgetMonth(state, action: PayloadAction<{ year: number; month: number }>) {
      state.selectedDate = action.payload;
    },
    clearSelectedBudget(state) {
      state.selectedBudget = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBudgetsOverview.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBudgetsOverview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.budgets;
        state.spentByCategory = action.payload.spentByCategory;
      })
      .addCase(fetchBudgetsOverview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = String(action.payload ?? "Unable to load budgets.");
      })
      .addCase(fetchBudgetById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBudgetById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedBudget = action.payload;
      })
      .addCase(fetchBudgetById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = String(action.payload ?? "Unable to load budget.");
      })
      .addCase(createBudget.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(createBudget.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.items = [action.payload, ...state.items];
      })
      .addCase(createBudget.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = String(action.payload ?? "Unable to create budget.");
      })
      .addCase(updateBudget.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(updateBudget.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.selectedBudget = action.payload;
        state.items = state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
      })
      .addCase(updateBudget.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = String(action.payload ?? "Unable to update budget.");
      })
      .addCase(deleteBudget.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(deleteBudget.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
        if (state.selectedBudget?.id === action.payload) {
          state.selectedBudget = null;
        }
      })
      .addCase(deleteBudget.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = String(action.payload ?? "Unable to delete budget.");
      });
  }
});

export const { setBudgetMonth, clearSelectedBudget } = budgetSlice.actions;
export default budgetSlice.reducer;
