import { api } from "@/src/services/api";
import type { Budget, BudgetPayload } from "@/src/types/budget";

export const budgetService = {
  async getBudgets(userId: number, params?: { budgetYear?: number; budgetMonth?: number }) {
    const response = await api.get<Budget[]>(`/users/${userId}/budgets`, {
      params
    });
    return response.data;
  },

  async getBudgetById(userId: number, budgetId: number) {
    const response = await api.get<Budget>(`/users/${userId}/budgets/${budgetId}`);
    return response.data;
  },

  async createBudget(userId: number, payload: BudgetPayload) {
    const response = await api.post<Budget>(`/users/${userId}/budgets`, payload);
    return response.data;
  },

  async updateBudget(userId: number, budgetId: number, payload: BudgetPayload) {
    const response = await api.put<Budget>(`/users/${userId}/budgets/${budgetId}`, payload);
    return response.data;
  },

  async deleteBudget(userId: number, budgetId: number) {
    await api.delete(`/users/${userId}/budgets/${budgetId}`);
    return budgetId;
  }
};
