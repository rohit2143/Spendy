import type { Transaction } from "@/src/types/transaction";

export type SummaryResponse = {
  year: number;
  month: number;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  totalBudget: number;
  remainingBudget: number;
  transactionCount: number;
};

export type DashboardChartItem = {
  label: string;
  value: number;
  color: string;
};

export type DashboardState = {
  summary: SummaryResponse | null;
  recentTransactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  selectedDate: {
    year: number;
    month: number;
  };
};