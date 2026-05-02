import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/src/theme";
import type { Transaction } from "@/src/types/transaction";
import { formatCurrency } from "@/src/utils/formatCurrency";
import { formatDate } from "@/src/utils/formatDate";

type Props = {
  item: Transaction;
  onPress?: () => void;
};

export default function TransactionCard({ item, onPress }: Props) {
  const isExpense = item.type === "EXPENSE";

  return (
    <Pressable onPress={onPress} style={styles.item}>
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
          {item.description}
        </Text>
        <Text numberOfLines={1} style={styles.meta}>
          {item.categoryName}
          {item.merchant ? ` · ${item.merchant}` : ""}
        </Text>
      </View>
      <View style={styles.right}>
        <Text style={[styles.amount, { color: isExpense ? colors.danger : colors.accent }]}>
          {isExpense ? "-" : "+"}
          {formatCurrency(item.amount)}
        </Text>
        <Text style={styles.date}>{formatDate(item.transactionDate)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
    fontSize: 14,
    fontWeight: "700"
  },
  meta: {
    color: colors.textSubtle,
    fontSize: 11,
    marginTop: 2
  },
  right: {
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
  }
});