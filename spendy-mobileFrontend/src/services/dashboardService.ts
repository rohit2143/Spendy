import { api } from "@/src/services/api";
import type { SummaryResponse } from "@/src/types/dashboard";
import type { Transaction } from "@/src/types/transaction";

export const dashboardService = {
  async getSummary(userId: number, year: number, month: number) {
    const response = await api.get<SummaryResponse>(`/users/${userId}/dashboard/summary`, {
      params: { year, month }
    });
    return response.data;
  },

  async getRecentTransactions(userId: number) {
    const response = await api.get<Transaction[]>(`/users/${userId}/dashboard/recent-transactions`);
    return response.data;
  }
};