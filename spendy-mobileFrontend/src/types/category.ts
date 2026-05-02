export type CategoryType = "INCOME" | "EXPENSE";

export type Category = {
  id: number;
  name: string;
  type: CategoryType;
  userId: number;
};

export type CategoryPayload = {
  name: string;
  type: CategoryType;
};
