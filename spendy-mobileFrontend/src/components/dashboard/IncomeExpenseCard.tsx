import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/src/theme";
import { formatCurrency } from "@/src/utils/formatCurrency";

type Props = {
  title: string;
  value: number;
  icon: keyof typeof Ionicons.glyphMap;
  tone: "income" | "expense" | "info";
};

const toneMap = {
  income: {
    value: colors.accent,
    iconBg: "rgba(0,214,143,0.12)"
  },
  expense: {
    value: colors.danger,
    iconBg: "rgba(255,82,82,0.12)"
  },
  info: {
    value: colors.info,
    iconBg: "rgba(100,130,255,0.12)"
  }
};

export default function IncomeExpenseCard({ title, value, icon, tone }: Props) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconWrap, { backgroundColor: toneMap[tone].iconBg }]}>
        <Ionicons color={toneMap[tone].value} name={icon} size={16} />
      </View>
      <Text style={styles.label}>{title}</Text>
      <Text style={[styles.value, { color: toneMap[tone].value }]}>{formatCurrency(value)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 14
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10
  },
  label: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase"
  },
  value: {
    fontSize: 18,
    fontWeight: "800",
    marginTop: 4
  }
});