import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/src/theme";
import type { DashboardChartItem } from "@/src/types/dashboard";
import { formatCurrency } from "@/src/utils/formatCurrency";

type Props = {
  data: DashboardChartItem[];
};

export default function ExpenseChart({ data }: Props) {
  const maxValue = Math.max(...data.map((item) => item.value), 1);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Spending by Category</Text>
      {data.length ? (
        <View style={styles.list}>
          {data.map((item) => (
            <View key={item.label} style={styles.row}>
              <View style={styles.labelRow}>
                <View style={[styles.dot, { backgroundColor: item.color }]} />
                <Text numberOfLines={1} style={styles.label}>
                  {item.label}
                </Text>
              </View>
              <View style={styles.barArea}>
                <View style={styles.barBg}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        backgroundColor: item.color,
                        width: `${Math.max((item.value / maxValue) * 100, 8)}%`
                      }
                    ]}
                  />
                </View>
                <Text style={styles.value}>{formatCurrency(item.value)}</Text>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.empty}>No expense data yet for the selected month.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border
  },
  title: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 14
  },
  list: {
    gap: 12
  },
  row: {
    gap: 8
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5
  },
  label: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "600",
    flex: 1
  },
  barArea: {
    gap: 6
  },
  barBg: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#0f1a2a",
    overflow: "hidden"
  },
  barFill: {
    height: "100%",
    borderRadius: 4
  },
  value: {
    color: colors.textSubtle,
    fontSize: 11
  },
  empty: {
    color: colors.textSubtle,
    fontSize: 13
  }
});
