import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getApiError } from "@/src/services/api";
import { transactionService, type TransactionPayload } from "@/src/services/transactionService";
import type { Transaction, TransactionType } from "@/src/types/transaction";

type TransactionFilters = {
  type: TransactionType | "ALL";
  startDate: string;
  endDate: string;
};

type TransactionState = {
  items: Transaction[];
  selectedTransaction: Transaction | null;
  filters: TransactionFilters;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
};

const initialState: TransactionState = {
  items: [],
  selectedTransaction: null,
  filters: {
    type: "ALL",
    startDate: "",
    endDate: ""
  },
  isLoading: false,
  isSubmitting: false,
  error: null
};

export const fetchTransactions = createAsyncThunk(
  "transactions/fetchTransactions",
  async (
    payload: {
      userId: number;
      type?: TransactionType | "ALL";
      startDate?: string;
      endDate?: string;
    },
    thunkApi
  ) => {
    try {
      return await transactionService.getTransactions(payload.userId, payload);
    } catch (error) {
      return thunkApi.rejectWithValue(getApiError(error));
    }
  }
);

export const fetchTransactionById = createAsyncThunk(
  "transactions/fetchTransactionById",
  async (payload: { userId: number; transactionId: number }, thunkApi) => {
    try {
      return await transactionService.getTransactionById(payload.userId, payload.transactionId);
    } catch (error) {
      return thunkApi.rejectWithValue(getApiError(error));
    }
  }
);

export const createTransaction = createAsyncThunk(
  "transactions/createTransaction",
  async (payload: { userId: number; data: TransactionPayload }, thunkApi) => {
    try {
      return await transactionService.createTransaction(payload.userId, payload.data);
    } catch (error) {
      return thunkApi.rejectWithValue(getApiError(error));
    }
  }
);

export const updateTransaction = createAsyncThunk(
  "transactions/updateTransaction",
  async (payload: { userId: number; transactionId: number; data: TransactionPayload }, thunkApi) => {
    try {
      return await transactionService.updateTransaction(
        payload.userId,
        payload.transactionId,
        payload.data
      );
    } catch (error) {
      return thunkApi.rejectWithValue(getApiError(error));
    }
  }
);

export const deleteTransaction = createAsyncThunk(
  "transactions/deleteTransaction",
  async (payload: { userId: number; transactionId: number }, thunkApi) => {
    try {
      return await transactionService.deleteTransaction(payload.userId, payload.transactionId);
    } catch (error) {
      return thunkApi.rejectWithValue(getApiError(error));
    }
  }
);

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    setTransactionFilters(state, action: PayloadAction<Partial<TransactionFilters>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearSelectedTransaction(state) {
      state.selectedTransaction = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = String(action.payload ?? "Unable to load transactions.");
      })
      .addCase(fetchTransactionById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTransactionById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedTransaction = action.payload;
      })
      .addCase(fetchTransactionById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = String(action.payload ?? "Unable to load transaction.");
      })
      .addCase(createTransaction.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.items = [action.payload, ...state.items];
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = String(action.payload ?? "Unable to create transaction.");
      })
      .addCase(updateTransaction.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.selectedTransaction = action.payload;
        state.items = state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = String(action.payload ?? "Unable to update transaction.");
      })
      .addCase(deleteTransaction.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
        if (state.selectedTransaction?.id === action.payload) {
          state.selectedTransaction = null;
        }
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = String(action.payload ?? "Unable to delete transaction.");
      });
  }
});

export const { setTransactionFilters, clearSelectedTransaction } = transactionSlice.actions;
export default transactionSlice.reducer;