import { api } from "@/src/services/api";
import type {
  ImportStatus,
  Transaction,
  TransactionSource,
  TransactionType
} from "@/src/types/transaction";
export type TransactionPayload = {
  categoryId: number;
  amount: number;
  type: TransactionType;
  source: TransactionSource;
  importStatus: ImportStatus;
  transactionDate: string;
  description: string;
  merchant?: string;
  externalMessageId?: string;
  rawMessage?: string;
};
export const transactionService = {
  async getTransactions(
    userId: number,
    params?: {
      type?: TransactionType | "ALL";
      startDate?: string;
      endDate?: string;
    }
  ) {
    const response = await api.get<Transaction[]>(`/users/${userId}/transactions`, {
      params: {
        type: params?.type && params.type !== "ALL" ? params.type : undefined,
        startDate: params?.startDate,
        endDate: params?.endDate
      }
    });
    return response.data;
  },
  async getTransactionById(userId: number, transactionId: number) {
    const response = await api.get<Transaction>(`/users/${userId}/transactions/${transactionId}`);
    return response.data;
  },
  async createTransaction(userId: number, payload: TransactionPayload) {
    const response = await api.post<Transaction>(`/users/${userId}/transactions`, payload);
    return response.data;
  },
  async updateTransaction(userId: number, transactionId: number, payload: TransactionPayload) {
    const response = await api.put<Transaction>(
      `/users/${userId}/transactions/${transactionId}`,
      payload
    );
    return response.data;
  },
  async deleteTransaction(userId: number, transactionId: number) {
    await api.delete(`/users/${userId}/transactions/${transactionId}`);
    return transactionId;
  }
};