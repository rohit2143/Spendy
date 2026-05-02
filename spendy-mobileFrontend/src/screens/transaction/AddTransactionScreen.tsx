import { router } from "expo-router";
import TransactionForm from "@/src/components/transaction/TransactionForm";
import { useAppDispatch, useAppSelector, useAuth } from "@/src/hooks/useAuth";
import { createTransaction } from "@/src/store/transactionSlice";

export default function AddTransactionScreen() {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { isSubmitting } = useAppSelector((state) => state.transactions);

  if (!user) return null;

  return (
    <TransactionForm
      submitLabel="Save Transaction"
      submitting={isSubmitting}
      title="Add Transaction"
      userId={user.userId}
      onSubmit={async (values) => {
        await dispatch(createTransaction({ userId: user.userId, data: values }));
        router.back();
      }}
    />
  );
}