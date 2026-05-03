import { router } from "expo-router";
import BudgetForm from "@/src/components/budget/BudgetForm";
import { useAppDispatch, useAppSelector, useAuth } from "@/src/hooks/useAuth";
import { createBudget } from "@/src/store/budgetSlice";

export default function AddBudgetScreen() {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { isSubmitting, selectedDate } = useAppSelector((state) => state.budgets);

  if (!user) return null;

  return (
    <BudgetForm
      initialMonth={selectedDate.month}
      initialYear={selectedDate.year}
      submitLabel="Save Budget"
      submitting={isSubmitting}
      title="Add Budget"
      userId={user.userId}
      onSubmit={async (values) => {
        await dispatch(createBudget({ userId: user.userId, data: values })).unwrap();
        router.back();
      }}
    />
  );
}
