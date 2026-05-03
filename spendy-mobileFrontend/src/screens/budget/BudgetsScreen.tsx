import { useCallback, useEffect, useMemo } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import BudgetCard from "@/src/components/budget/BudgetCard";
import EmptyState from "@/src/components/common/EmptyState";
import Loader from "@/src/components/common/Loader";
import { useAppDispatch, useAppSelector, useAuth } from "@/src/hooks/useAuth";
import { fetchBudgetsOverview, setBudgetMonth } from "@/src/store/budgetSlice";
import { colors } from "@/src/theme";
import { formatCurrency } from "@/src/utils/formatCurrency";
import { getMonthLabel } from "@/src/utils/formatDate";

export default function BudgetsScreen() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isRestoring } = useAuth();
  const { items, spentByCategory, selectedDate, isLoading, error } = useAppSelector(
    (state) => state.budgets
  );

  useEffect(() => {
    if (!isRestoring && !isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [isAuthenticated, isRestoring]);

  const load = useCallback(() => {
    if (!user?.userId) return;

    dispatch(
      fetchBudgetsOverview({
        userId: user.userId,
        budgetYear: selectedDate.year,
        budgetMonth: selectedDate.month
      })
    );
  }, [dispatch, selectedDate.month, selectedDate.year, user?.userId]);

  useEffect(() => {
    load();
  }, [load]);

  useFocusEffect(useCallback(() => {
    load();
  }, [load]));

  const totals = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        const limit = Number(item.limitAmount);
        const spent = spentByCategory[item.categoryId] ?? 0;

        acc.limit += limit;
        acc.spent += spent;
        return acc;
      },
      { limit: 0, spent: 0 }
    );
  }, [items, spentByCategory]);

  const changeMonth = (delta: number) => {
    const next = new Date(selectedDate.year, selectedDate.month - 1 + delta, 1);
    dispatch(
      setBudgetMonth({
        year: next.getFullYear(),
        month: next.getMonth() + 1
      })
    );
  };

  if (isRestoring) {
    return <Loader label="Loading budgets" />;
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Budgets</Text>
          <Text style={styles.subtitle}>Plan spending by category and month.</Text>
        </View>
        <TouchableOpacity onPress={() => router.push("/budget/add" as never)} style={styles.addButton}>
          <Ionicons color={colors.text} name="add" size={20} />
        </TouchableOpacity>
      </View>

      <View style={styles.monthRow}>
        <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.monthButton}>
          <Ionicons color={colors.textMuted} name="chevron-back" size={18} />
        </TouchableOpacity>
        <View style={styles.monthCopy}>
          <Text style={styles.monthLabel}>Selected month</Text>
          <Text style={styles.monthValue}>{getMonthLabel(selectedDate.month, selectedDate.year)}</Text>
        </View>
        <TouchableOpacity onPress={() => changeMonth(1)} style={styles.monthButton}>
          <Ionicons color={colors.textMuted} name="chevron-forward" size={18} />
        </TouchableOpacity>
      </View>

      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total budget</Text>
          <Text style={styles.summaryValue}>{formatCurrency(totals.limit)}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Spent so far</Text>
          <Text style={styles.summaryValue}>{formatCurrency(totals.spent)}</Text>
        </View>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <ScrollView
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={load} tintColor={colors.accent} />
        }
      >
        {items.length ? (
          items.map((item) => (
            <BudgetCard
              item={item}
              key={item.id}
              spent={spentByCategory[item.categoryId] ?? 0}
              onPress={() =>
                router.push({
                  pathname: "/budget/[id]" as never,
                  params: { id: String(item.id) } as never
                })
              }
            />
          ))
        ) : isLoading ? null : (
          <EmptyState
            icon="wallet-outline"
            message="Set monthly budgets for your expense categories and track how much is left."
            title="No budgets yet"
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
  monthRow: {
    marginHorizontal: 20,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  monthButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.surfaceSoft,
    alignItems: "center",
    justifyContent: "center"
  },
  monthCopy: {
    alignItems: "center"
  },
  monthLabel: {
    color: colors.textSubtle,
    fontSize: 12
  },
  monthValue: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
    marginTop: 2
  },
  summaryRow: {
    flexDirection: "row",
    gap: 10,
    marginHorizontal: 20,
    marginBottom: 12
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14
  },
  summaryLabel: {
    color: colors.textMuted,
    fontSize: 12
  },
  summaryValue: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "800",
    marginTop: 8
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
