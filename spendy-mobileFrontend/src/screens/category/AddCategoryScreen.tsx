import { router, useLocalSearchParams } from "expo-router";
import CategoryForm from "@/src/components/category/CategoryForm";
import { useAppDispatch, useAppSelector, useAuth } from "@/src/hooks/useAuth";
import { createCategory } from "@/src/store/categorySlice";
import type { CategoryType } from "@/src/types/category";

export default function AddCategoryScreen() {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { isSubmitting } = useAppSelector((state) => state.categories);
  const { type } = useLocalSearchParams<{ type?: CategoryType }>();

  if (!user) return null;

  return (
    <CategoryForm
      initialType={type === "INCOME" ? "INCOME" : "EXPENSE"}
      submitLabel="Save Category"
      submitting={isSubmitting}
      title="Add Category"
      onSubmit={async (values) => {
        await dispatch(createCategory({ userId: user.userId, data: values }));
        router.back();
      }}
    />
  );
}
