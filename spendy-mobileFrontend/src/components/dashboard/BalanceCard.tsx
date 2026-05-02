import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/src/theme";
import { formatCurrency } from "@/src/utils/formatCurrency";

type Props = {
  balance: number;
  remainingBudget: number;
};

export default function BalanceCard({ balance, remainingBudget }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>Total Balance</Text>
      <Text style={styles.amount}>{formatCurrency(balance)}</Text>
      <View style={styles.badge}>
        <Ionicons name="wallet-outline" size={12} color={colors.accent} />
        <Text style={styles.badgeText}>
          Budget left {formatCurrency(Math.max(remainingBudget, 0))}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 20,
    backgroundColor: "#0d2040",
    borderWidth: 1,
    borderColor: "#1e3054"
  },
  label: {
    color: "#5a7090",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase"
  },
  amount: {
    color: colors.text,
    fontSize: 32,
    fontWeight: "900",
    marginTop: 6,
    marginBottom: 10
  },
  badge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0,214,143,0.12)",
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  badgeText: {
    color: "#7bdcb5",
    fontSize: 12,
    fontWeight: "600"
  }
});