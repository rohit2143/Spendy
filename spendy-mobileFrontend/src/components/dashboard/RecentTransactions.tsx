import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/src/theme";
import type { Transaction } from "@/src/types/transaction";
import { formatCurrency } from "@/src/utils/formatCurrency";
import { formatDate } from "@/src/utils/formatDate";

type Props = {
  transactions: Transaction[];
};

export default function RecentTransactions({ transactions }: Props) {
  return (
    <View style={styles.wrapper}>
      {transactions.length ? (
        transactions.map((transaction) => {
          const isExpense = transaction.type === "EXPENSE";

          return (
            <View key={transaction.id} style={styles.item}>
              <View
                style={[
                  styles.iconWrap,
                  { backgroundColor: isExpense ? "rgba(255,82,82,0.12)" : "rgba(0,214,143,0.12)" }
                ]}
              >
                <Ionicons
                  color={isExpense ? colors.danger : colors.accent}
                  name={isExpense ? "arrow-down-outline" : "arrow-up-outline"}
                  size={18}
                />
              </View>
              <View style={styles.info}>
                <Text numberOfLines={1} style={styles.name}>
                  {transaction.description}
                </Text>
                <Text style={styles.category}>{transaction.categoryName}</Text>
              </View>
              <View style={styles.amountWrap}>
                <Text style={[styles.amount, { color: isExpense ? colors.danger : colors.accent }]}>
                  {isExpense ? "-" : "+"}
                  {formatCurrency(transaction.amount)}
                </Text>
                <Text style={styles.date}>{formatDate(transaction.transactionDate)}</Text>
              </View>
            </View>
          );
        })
      ) : (
        <Text style={styles.empty}>No recent transactions yet.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    paddingBottom: 100
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#0f1a2a"
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center"
  },
  info: {
    flex: 1
  },
  name: {
    color: "#d0d8ee",
    fontSize: 13,
    fontWeight: "700"
  },
  category: {
    color: colors.textSubtle,
    fontSize: 11,
    marginTop: 2
  },
  amountWrap: {
    alignItems: "flex-end"
  },
  amount: {
    fontSize: 14,
    fontWeight: "800"
  },
  date: {
    color: "#4a5a70",
    fontSize: 10,
    marginTop: 2
  },
  empty: {
    color: colors.textSubtle,
    fontSize: 13
  }
});