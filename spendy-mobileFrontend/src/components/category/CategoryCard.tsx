import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/src/theme";
import type { Category } from "@/src/types/category";

type Props = {
  item: Category;
  onPress?: () => void;
};

export default function CategoryCard({ item, onPress }: Props) {
  const isExpense = item.type === "EXPENSE";

  return (
    <Pressable onPress={onPress} style={styles.card}>
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
      <View style={styles.copy}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.type}>{item.type}</Text>
      </View>
      <Ionicons color={colors.textSubtle} name="chevron-forward" size={16} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginBottom: 10
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center"
  },
  copy: {
    flex: 1
  },
  name: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700"
  },
  type: {
    color: colors.textSubtle,
    fontSize: 11,
    marginTop: 2
  }
});