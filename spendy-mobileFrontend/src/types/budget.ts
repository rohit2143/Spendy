import type { CategoryType } from "@/src/types/category";

export type Budget = {
  id: number;
  userId: number;
  categoryId: number;
  categoryName: string;
  categoryType: CategoryType;
  limitAmount: number;
  budgetYear: number;
  budgetMonth: number;
};

export type BudgetPayload = {
  categoryId: number;
  limitAmount: number;
  budgetYear: number;
  budgetMonth: number;
};

export type BudgetState = {
  items: Budget[];
  selectedBudget: Budget | null;
  spentByCategory: Record<number, number>;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  selectedDate: {
    year: number;
    month: number;
  };
};
