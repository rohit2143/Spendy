import { useEffect, useMemo } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import BalanceCard from "@/src/components/dashboard/BalanceCard";
import ExpenseChart from "@/src/components/dashboard/ExpenseChart";
import IncomeExpenseCard from "@/src/components/dashboard/IncomeExpenseCard";
import RecentTransactions from "@/src/components/dashboard/RecentTransactions";
import Loader from "@/src/components/common/Loader";
import { useAppDispatch, useAppSelector, useAuth } from "@/src/hooks/useAuth";
import { colors } from "@/src/theme";
import { fetchDashboard, setDashboardMonth } from "@/src/store/dashboardSlice";
import { formatCurrency } from "@/src/utils/formatCurrency";
import { getMonthLabel } from "@/src/utils/formatDate";

const chartPalette = ["#00d68f", "#6482ff", "#ffa726", "#ff5252", "#9c6bff", "#00bcd4"];

export default function DashboardScreen() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isRestoring, user } = useAuth();
  const { summary, recentTransactions, isLoading, error, selectedDate } = useAppSelector(
    (state) => state.dashboard
  );

  useEffect(() => {
    if (!isRestoring && !isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [isAuthenticated, isRestoring]);

  useEffect(() => {
    if (user?.userId) {
      dispatch(
        fetchDashboard({
          userId: user.userId,
          year: selectedDate.year,
          month: selectedDate.month
        })
      );
    }
  }, [dispatch, selectedDate.month, selectedDate.year, user?.userId]);

  const expenseChartData = useMemo(() => {
    const grouped = recentTransactions
      .filter((item) => item.type === "EXPENSE")
      .reduce<Record<string, number>>((acc, item) => {
        acc[item.categoryName] = (acc[item.categoryName] ?? 0) + Number(item.amount);
        return acc;
      }, {});

    return Object.entries(grouped)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([label, value], index) => ({
        label,
        value,
        color: chartPalette[index % chartPalette.length]
      }));
  }, [recentTransactions]);

  const budgetProgress = useMemo(() => {
    if (!summary?.totalBudget) return 0;
    return Math.min((summary.totalExpense / summary.totalBudget) * 100, 100);
  }, [summary]);

  const changeMonth = (delta: number) => {
    const next = new Date(selectedDate.year, selectedDate.month - 1 + delta, 1);
    dispatch(
      setDashboardMonth({
        year: next.getFullYear(),
        month: next.getMonth() + 1
      })
    );
  };

  if (isRestoring) {
    return <Loader label="Loading dashboard" />;
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={() =>
            user?.userId &&
            dispatch(
              fetchDashboard({
                userId: user.userId,
                year: selectedDate.year,
                month: selectedDate.month
              })
            )
          }
          tintColor={colors.accent}
        />
      }
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good evening</Text>
          <Text style={styles.name}>{user?.name ?? "Spendy User"}</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase() ?? "S"}</Text>
        </View>
      </View>

      <View style={styles.monthRow}>
        <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.monthButton}>
          <Ionicons color={colors.textMuted} name="chevron-back" size={18} />
        </TouchableOpacity>
        <View style={styles.monthCopy}>
          <Text style={styles.monthLabel}>Overview</Text>
          <Text style={styles.monthValue}>
            {getMonthLabel(selectedDate.month, selectedDate.year)}
          </Text>
        </View>
        <TouchableOpacity onPress={() => changeMonth(1)} style={styles.monthButton}>
          <Ionicons color={colors.textMuted} name="chevron-forward" size={18} />
        </TouchableOpacity>
      </View>

      <BalanceCard balance={summary?.balance ?? 0} remainingBudget={summary?.remainingBudget ?? 0} />

      <View style={styles.statsRow}>
        <IncomeExpenseCard
          icon="arrow-up-outline"
          title="Income"
          tone="income"
          value={summary?.totalIncome ?? 0}
        />
        <IncomeExpenseCard
          icon="arrow-down-outline"
          title="Expense"
          tone="expense"
          value={summary?.totalExpense ?? 0}
        />
      </View>

      <View style={styles.statsRow}>
        <IncomeExpenseCard
          icon="wallet-outline"
          title="Budget"
          tone="info"
          value={summary?.totalBudget ?? 0}
        />
        <IncomeExpenseCard
          icon="receipt-outline"
          title="Transactions"
          tone="info"
          value={summary?.transactionCount ?? 0}
        />
      </View>

      <View style={styles.budgetCard}>
        <Text style={styles.sectionCardTitle}>Budget Progress</Text>
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${budgetProgress}%` }]} />
        </View>
        <View style={styles.progressMeta}>
          <Text style={styles.progressText}>
            Spent {formatCurrency(summary?.totalExpense ?? 0)} of{" "}
            {formatCurrency(summary?.totalBudget ?? 0)}
          </Text>
          <Text style={styles.progressPct}>{Math.round(budgetProgress)}%</Text>
        </View>
      </View>

      <ExpenseChart data={expenseChartData} />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        <Text style={styles.sectionLink}>Latest</Text>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      <RecentTransactions transactions={recentTransactions} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background
  },
  content: {
    paddingTop: 56
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  greeting: {
    color: colors.textMuted,
    fontSize: 12
  },
  name: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "800",
    marginTop: 2
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center"
  },
  avatarText: {
    color: "#08120d",
    fontWeight: "900"
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
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginHorizontal: 20,
    marginBottom: 10
  },
  budgetCard: {
    marginHorizontal: 20,
    marginTop: 6,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border
  },
  sectionCardTitle: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 12
  },
  progressBg: {
    height: 8,
    backgroundColor: "#0f1a2a",
    borderRadius: 4,
    overflow: "hidden"
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.accent,
    borderRadius: 4
  },
  progressMeta: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  progressText: {
    color: colors.textSubtle,
    fontSize: 12,
    flex: 1,
    paddingRight: 10
  },
  progressPct: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "800"
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  sectionTitle: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: "700"
  },
  sectionLink: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "700"
  },
  error: {
    color: colors.danger,
    fontSize: 13,
    marginHorizontal: 20,
    marginBottom: 8
  }
});
