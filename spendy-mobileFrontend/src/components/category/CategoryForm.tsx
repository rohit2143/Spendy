import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import CustomButton from "@/src/components/common/CustomButton";
import CustomInput from "@/src/components/common/CustomInput";
import Header from "@/src/components/common/Header";
import { colors } from "@/src/theme";
import type { Category, CategoryType } from "@/src/types/category";

type Props = {
  title: string;
  submitLabel: string;
  submitting?: boolean;
  initialCategory?: Category | null;
  initialType?: CategoryType;
  onSubmit: (values: { name: string; type: CategoryType }) => void;
  onDelete?: () => void;
};

export default function CategoryForm({
  title,
  submitLabel,
  submitting = false,
  initialCategory,
  initialType,
  onSubmit,
  onDelete
}: Props) {
  const [name, setName] = useState(initialCategory?.name ?? "");
  const [type, setType] = useState<CategoryType>(initialCategory?.type ?? initialType ?? "EXPENSE");
  const [error, setError] = useState("");

  const submit = () => {
    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }

    setError("");
    onSubmit({ name: name.trim(), type });
  };

  return (
    <View style={styles.screen}>
      <Header onBack={() => router.back()} title={title} />

      <View style={styles.toggleRow}>
        {(["EXPENSE", "INCOME"] as CategoryType[]).map((option) => {
          const active = type === option;
          return (
            <TouchableOpacity
              key={option}
              onPress={() => setType(option)}
              style={[
                styles.toggleOption,
                active && (option === "EXPENSE" ? styles.expenseActive : styles.incomeActive)
              ]}
            >
              <Text
                style={[
                  styles.toggleText,
                  active && (option === "EXPENSE" ? styles.expenseText : styles.incomeText)
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.card}>
        <CustomInput
          label="Category Name"
          onChangeText={setName}
          placeholder="Food, Salary, Rent..."
          value={name}
        />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <CustomButton loading={submitting} onPress={submit} title={submitLabel} />
      {onDelete ? (
        <CustomButton
          disabled={submitting}
          onPress={onDelete}
          style={styles.deleteButton}
          title="Delete Category"
          variant="danger"
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    paddingTop: 56
  },
  toggleRow: {
    flexDirection: "row",
    backgroundColor: "#0d1525",
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#1a2438"
  },
  toggleOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center"
  },
  expenseActive: {
    backgroundColor: "rgba(255,82,82,0.15)"
  },
  incomeActive: {
    backgroundColor: "rgba(0,214,143,0.12)"
  },
  toggleText: {
    color: colors.textSubtle,
    fontSize: 13,
    fontWeight: "700"
  },
  expenseText: {
    color: colors.danger
  },
  incomeText: {
    color: colors.accent
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 12
  },
  error: {
    color: colors.danger,
    fontSize: 13,
    marginBottom: 12
  },
  deleteButton: {
    marginTop: 10
  }
});
