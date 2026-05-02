import { api } from "@/src/services/api";
import type { Category, CategoryPayload, CategoryType } from "@/src/types/category";

export const categoryService = {
  async getCategories(userId: number, type?: CategoryType) {
    const response = await api.get<Category[]>(`/users/${userId}/categories`, {
      params: type ? { type } : undefined
    });
    return response.data;
  },

  async getCategoryById(userId: number, categoryId: number) {
    const response = await api.get<Category>(`/users/${userId}/categories/${categoryId}`);
    return response.data;
  },

  async createCategory(userId: number, payload: CategoryPayload) {
    const response = await api.post<Category>(`/users/${userId}/categories`, payload);
    return response.data;
  },

  async updateCategory(userId: number, categoryId: number, payload: CategoryPayload) {
    const response = await api.put<Category>(`/users/${userId}/categories/${categoryId}`, payload);
    return response.data;
  },

  async deleteCategory(userId: number, categoryId: number) {
    await api.delete(`/users/${userId}/categories/${categoryId}`);
    return categoryId;
  }
};
