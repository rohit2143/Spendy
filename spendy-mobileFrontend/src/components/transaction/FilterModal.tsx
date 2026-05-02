import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { colors } from "@/src/theme";
import type { TransactionType } from "@/src/types/transaction";

type Props = {
  selected: TransactionType | "ALL";
  onChange: (value: TransactionType | "ALL") => void;
};

const options: (TransactionType | "ALL")[] = ["ALL", "EXPENSE", "INCOME"];

export default function FilterModal({ selected, onChange }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          onPress={() => onChange(option)}
          style={[styles.chip, selected === option && styles.activeChip]}
        >
          <Text style={[styles.text, selected === option && styles.activeText]}>{option}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: 8,
    paddingHorizontal: 20,
    paddingBottom: 14
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border
  },
  activeChip: {
    backgroundColor: "rgba(0,214,143,0.1)",
    borderColor: colors.accent
  },
  text: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "600"
  },
  activeText: {
    color: colors.accent
  }
});