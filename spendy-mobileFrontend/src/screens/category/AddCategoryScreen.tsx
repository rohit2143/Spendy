import { router } from "expo-router";
import CategoryForm from "@/src/components/category/CategoryForm";
import { useAppDispatch, useAppSelector, useAuth } from "@/src/hooks/useAuth";
import { createCategory } from "@/src/store/categorySlice";

export default function AddCategoryScreen() {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { isSubmitting } = useAppSelector((state) => state.categories);

  if (!user) return null;

  return (
    <CategoryForm
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
