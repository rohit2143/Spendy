import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { categoryService } from "@/src/services/categoryService";
import { getApiError } from "@/src/services/api";
import type { Category, CategoryPayload, CategoryType } from "@/src/types/category";

type CategoryState = {
  items: Category[];
  selectedCategory: Category | null;
  filter: CategoryType | "ALL";
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
};

const initialState: CategoryState = {
  items: [],
  selectedCategory: null,
  filter: "ALL",
  isLoading: false,
  isSubmitting: false,
  error: null
};

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (payload: { userId: number; type?: CategoryType | "ALL" }, thunkApi) => {
    try {
      return await categoryService.getCategories(
        payload.userId,
        payload.type && payload.type !== "ALL" ? payload.type : undefined
      );
    } catch (error) {
      return thunkApi.rejectWithValue(getApiError(error));
    }
  }
);

export const fetchCategoryById = createAsyncThunk(
  "categories/fetchCategoryById",
  async (payload: { userId: number; categoryId: number }, thunkApi) => {
    try {
      return await categoryService.getCategoryById(payload.userId, payload.categoryId);
    } catch (error) {
      return thunkApi.rejectWithValue(getApiError(error));
    }
  }
);

export const createCategory = createAsyncThunk(
  "categories/createCategory",
  async (payload: { userId: number; data: CategoryPayload }, thunkApi) => {
    try {
      return await categoryService.createCategory(payload.userId, payload.data);
    } catch (error) {
      return thunkApi.rejectWithValue(getApiError(error));
    }
  }
);

export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async (payload: { userId: number; categoryId: number; data: CategoryPayload }, thunkApi) => {
    try {
      return await categoryService.updateCategory(payload.userId, payload.categoryId, payload.data);
    } catch (error) {
      return thunkApi.rejectWithValue(getApiError(error));
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async (payload: { userId: number; categoryId: number }, thunkApi) => {
    try {
      return await categoryService.deleteCategory(payload.userId, payload.categoryId);
    } catch (error) {
      return thunkApi.rejectWithValue(getApiError(error));
    }
  }
);

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setCategoryFilter(state, action: PayloadAction<CategoryType | "ALL">) {
      state.filter = action.payload;
    },
    clearSelectedCategory(state) {
      state.selectedCategory = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = String(action.payload ?? "Unable to load categories.");
      })
      .addCase(fetchCategoryById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedCategory = action.payload;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = String(action.payload ?? "Unable to load category.");
      })
      .addCase(createCategory.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.items = [action.payload, ...state.items];
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = String(action.payload ?? "Unable to create category.");
      })
      .addCase(updateCategory.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.selectedCategory = action.payload;
        state.items = state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = String(action.payload ?? "Unable to update category.");
      })
      .addCase(deleteCategory.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
        if (state.selectedCategory?.id === action.payload) {
          state.selectedCategory = null;
        }
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = String(action.payload ?? "Unable to delete category.");
      });
  }
});

export const { setCategoryFilter, clearSelectedCategory } = categorySlice.actions;
export default categorySlice.reducer;
