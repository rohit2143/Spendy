import { useEffect } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import FilterModal from "@/src/components/transaction/FilterModal";
import TransactionCard from "@/src/components/transaction/TransactionCard";
import EmptyState from "@/src/components/common/EmptyState";
import Loader from "@/src/components/common/Loader";
import { useAppDispatch, useAppSelector, useAuth } from "@/src/hooks/useAuth";
import { colors } from "@/src/theme";
import { fetchTransactions, setTransactionFilters } from "@/src/store/transactionSlice";

export default function TransactionsScreen() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isRestoring } = useAuth();
  const { items, filters, isLoading, error } = useAppSelector((state) => state.transactions);

  useEffect(() => {
    if (!isRestoring && !isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [isAuthenticated, isRestoring]);

  useEffect(() => {
    if (user?.userId) {
      dispatch(fetchTransactions({ userId: user.userId, ...filters }));
    }
  }, [dispatch, filters, user?.userId]);

  if (isRestoring) {
    return <Loader label="Loading transactions" />;
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Transactions</Text>
          <Text style={styles.subtitle}>Track every inflow and outflow.</Text>
        </View>
        <TouchableOpacity onPress={() => router.push("/transaction/add")} style={styles.addButton}>
          <Ionicons color={colors.text} name="add" size={20} />
        </TouchableOpacity>
      </View>

      <FilterModal
        onChange={(type) => dispatch(setTransactionFilters({ type }))}
        selected={filters.type}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <ScrollView
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => user?.userId && dispatch(fetchTransactions({ userId: user.userId, ...filters }))}
            tintColor={colors.accent}
          />
        }
      >
        {items.length ? (
          items.map((item) => (
            <TransactionCard
              item={item}
              key={item.id}
              onPress={() =>
                router.push({
                  pathname: "/transaction/[id]",
                  params: { id: String(item.id) }
                })
              }
            />
          ))
        ) : isLoading ? null : (
          <EmptyState
            icon="receipt-outline"
            message="Add your first transaction to make the dashboard more useful."
            title="No transactions yet"
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