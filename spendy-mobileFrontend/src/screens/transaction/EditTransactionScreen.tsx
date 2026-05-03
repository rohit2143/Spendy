import { useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import Loader from "@/src/components/common/Loader";
import TransactionForm from "@/src/components/transaction/TransactionForm";
import { useAppDispatch, useAppSelector, useAuth } from "@/src/hooks/useAuth";
import {
  clearSelectedTransaction,
  deleteTransaction,
  fetchTransactionById,
  updateTransaction
} from "@/src/store/transactionSlice";

export default function EditTransactionScreen() {
  const dispatch = useAppDispatch();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { selectedTransaction, isLoading, isSubmitting } = useAppSelector(
    (state) => state.transactions
  );

  useEffect(() => {
    if (user?.userId && id) {
      dispatch(fetchTransactionById({ userId: user.userId, transactionId: Number(id) }));
    }

    return () => {
      dispatch(clearSelectedTransaction());
    };
  }, [dispatch, id, user?.userId]);

  if (!user || !id || isLoading || !selectedTransaction) {
    return <Loader label="Loading transaction" />;
  }

  return (
    <TransactionForm
      initialTransaction={selectedTransaction}
      onDelete={async () => {
        await dispatch(deleteTransaction({ userId: user.userId, transactionId: Number(id) })).unwrap();
        router.replace("/transactions");
      }}
      onSubmit={async (values) => {
        await dispatch(
          updateTransaction({
            userId: user.userId,
            transactionId: Number(id),
            data: values
          })
        ).unwrap();
        router.back();
      }}
      submitLabel="Update Transaction"
      submitting={isSubmitting}
      title="Edit Transaction"
      userId={user.userId}
    />
  );
}
