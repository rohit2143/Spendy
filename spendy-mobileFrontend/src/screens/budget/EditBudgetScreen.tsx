import { useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import BudgetForm from "@/src/components/budget/BudgetForm";
import Loader from "@/src/components/common/Loader";
import { useAppDispatch, useAppSelector, useAuth } from "@/src/hooks/useAuth";
import {
  clearSelectedBudget,
  deleteBudget,
  fetchBudgetById,
  updateBudget
} from "@/src/store/budgetSlice";

export default function EditBudgetScreen() {
  const dispatch = useAppDispatch();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { selectedBudget, isLoading, isSubmitting } = useAppSelector((state) => state.budgets);

  useEffect(() => {
    if (user?.userId && id) {
      dispatch(fetchBudgetById({ userId: user.userId, budgetId: Number(id) }));
    }

    return () => {
      dispatch(clearSelectedBudget());
    };
  }, [dispatch, id, user?.userId]);

  if (!user || !id || isLoading || !selectedBudget) {
    return <Loader label="Loading budget" />;
  }

  return (
    <BudgetForm
      initialBudget={selectedBudget}
      submitLabel="Update Budget"
      submitting={isSubmitting}
      title="Edit Budget"
      userId={user.userId}
      onDelete={async () => {
        await dispatch(deleteBudget({ userId: user.userId, budgetId: Number(id) })).unwrap();
        router.replace("/(tabs)/budgets" as never);
      }}
      onSubmit={async (values) => {
        await dispatch(
          updateBudget({
            userId: user.userId,
            budgetId: Number(id),
            data: values
          })
        ).unwrap();
        router.back();
      }}
    />
  );
}
