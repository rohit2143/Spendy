import { useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import Loader from "@/src/components/common/Loader";
import CategoryForm from "@/src/components/category/CategoryForm";
import { useAppDispatch, useAppSelector, useAuth } from "@/src/hooks/useAuth";
import {
  clearSelectedCategory,
  deleteCategory,
  fetchCategoryById,
  updateCategory
} from "@/src/store/categorySlice";

export default function EditCategoryScreen() {
  const dispatch = useAppDispatch();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { selectedCategory, isLoading, isSubmitting } = useAppSelector(
    (state) => state.categories
  );

  useEffect(() => {
    if (user?.userId && id) {
      dispatch(fetchCategoryById({ userId: user.userId, categoryId: Number(id) }));
    }

    return () => {
      dispatch(clearSelectedCategory());
    };
  }, [dispatch, id, user?.userId]);

  if (!user || !id || isLoading || !selectedCategory) {
    return <Loader label="Loading category" />;
  }

  return (
    <CategoryForm
      initialCategory={selectedCategory}
      onDelete={async () => {
        await dispatch(deleteCategory({ userId: user.userId, categoryId: Number(id) }));
        router.replace("/(tabs)/categories" as never);
      }}
      onSubmit={async (values) => {
        await dispatch(
          updateCategory({
            userId: user.userId,
            categoryId: Number(id),
            data: values
          })
        );
        router.back();
      }}
      submitLabel="Update Category"
      submitting={isSubmitting}
      title="Edit Category"
    />
  );
}