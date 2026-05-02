import { useEffect } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import EmptyState from "@/src/components/common/EmptyState";
import Loader from "@/src/components/common/Loader";
import CategoryCard from "@/src/components/category/CategoryCard";
import FilterModal from "@/src/components/transaction/FilterModal";
import { useAppDispatch, useAppSelector, useAuth } from "@/src/hooks/useAuth";
import { colors } from "@/src/theme";
import { fetchCategories, setCategoryFilter } from "@/src/store/categorySlice";

export default function CategoryScreen() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isRestoring } = useAuth();
  const { items, filter, isLoading, error } = useAppSelector((state) => state.categories);

  useEffect(() => {
    if (!isRestoring && !isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [isAuthenticated, isRestoring]);

  useEffect(() => {
    if (user?.userId) {
      dispatch(fetchCategories({ userId: user.userId, type: filter }));
    }
  }, [dispatch, filter, user?.userId]);

  if (isRestoring) {
    return <Loader label="Loading categories" />;
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Categories</Text>
          <Text style={styles.subtitle}>Organize how money moves.</Text>
        </View>
        <TouchableOpacity onPress={() => router.push("/category/add" as never)} style={styles.addButton}>
          <Ionicons color={colors.text} name="add" size={20} />
        </TouchableOpacity>
      </View>

      <FilterModal onChange={(value) => dispatch(setCategoryFilter(value))} selected={filter} />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <ScrollView
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() =>
              user?.userId && dispatch(fetchCategories({ userId: user.userId, type: filter }))
            }
            tintColor={colors.accent}
          />
        }
      >
        {items.length ? (
          items.map((item) => (
            <CategoryCard
              item={item}
              key={item.id}
              onPress={() =>
                router.push({
                  pathname: "/category/[id]" as never,
                  params: { id: String(item.id) } as never
                })
              }
            />
          ))
        ) : isLoading ? null : (
          <EmptyState
            icon="pricetags-outline"
            message="Create categories for income and expense transactions."
            title="No categories yet"
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 56
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "800"
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 4
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accent
  },
  error: {
    color: colors.danger,
    fontSize: 13,
    marginHorizontal: 20,
    marginBottom: 8
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 100
  }
});
