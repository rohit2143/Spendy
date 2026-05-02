export type TransactionType = "INCOME" | "EXPENSE";

export type TransactionSource = "MANUAL" | "SMS" | "BANK_IMPORT";

export type ImportStatus = "MANUAL" | "IMPORTED" | "FAILED";

export type Transaction = {
  id: number;
  userId: number;
  categoryId: number;
  categoryName: string;
  amount: number;
  type: TransactionType;
  source: TransactionSource;
  importStatus: ImportStatus;
  transactionDate: string;
  description: string;
  merchant?: string | null;
  externalMessageId?: string | null;
  rawMessage?: string | null;
  createdAt: string;
};