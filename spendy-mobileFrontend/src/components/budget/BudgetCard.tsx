import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/src/theme";
import { formatCurrency } from "@/src/utils/formatCurrency";
import type { Budget } from "@/src/types/budget";

type Props = {
  item: Budget;
  spent: number;
  onPress?: () => void;
};

export default function BudgetCard({ item, spent, onPress }: Props) {
  const limit = Number(item.limitAmount);
  const remaining = limit - spent;
  const progress = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
  const overBudget = remaining < 0;

  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <Ionicons color={colors.warning} name="wallet-outline" size={18} />
        </View>
        <View style={styles.copy}>
          <Text style={styles.name}>{item.categoryName}</Text>
          <Text style={styles.meta}>
            Limit {formatCurrency(limit)} • Spent {formatCurrency(spent)}
          </Text>
        </View>
        <Ionicons color={colors.textSubtle} name="chevron-forward" size={16} />
      </View>

      <View style={styles.progressBg}>
        <View
          style={[
            styles.progressFill,
            { width: `${progress}%` },
            overBudget && styles.progressOver
          ]}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.progressText}>{Math.round(progress)}% used</Text>
        <Text style={[styles.remaining, overBudget && styles.overBudget]}>
          {overBudget
            ? `${formatCurrency(Math.abs(remaining))} over`
            : `${formatCurrency(remaining)} left`}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginBottom: 10
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,167,38,0.14)"
  },
  copy: {
    flex: 1
  },
  name: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700"
  },
  meta: {
    color: colors.textSubtle,
    fontSize: 11,
    marginTop: 2
  },
  progressBg: {
    height: 8,
    backgroundColor: "#0f1a2a",
    borderRadius: 999,
    overflow: "hidden"
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: colors.accent
  },
  progressOver: {
    backgroundColor: colors.danger
  },
  footer: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  progressText: {
    color: colors.textSubtle,
    fontSize: 12
  },
  remaining: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "700"
  },
  overBudget: {
    color: colors.danger
  }
});
