import { useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import CustomButton from "@/src/components/common/CustomButton";
import CustomInput from "@/src/components/common/CustomInput";
import Header from "@/src/components/common/Header";
import Loader from "@/src/components/common/Loader";
import { categoryService } from "@/src/services/categoryService";
import { colors } from "@/src/theme";
import { getMonthLabel } from "@/src/utils/formatDate";
import type { Budget } from "@/src/types/budget";
import type { Category } from "@/src/types/category";

type Props = {
  title: string;
  userId: number;
  submitLabel: string;
  submitting?: boolean;
  initialBudget?: Budget | null;
  initialYear?: number;
  initialMonth?: number;
  onSubmit: (values: {
    categoryId: number;
    limitAmount: number;
    budgetYear: number;
    budgetMonth: number;
  }) => Promise<void> | void;
  onDelete?: () => Promise<void> | void;
};

export default function BudgetForm({
  title,
  userId,
  submitLabel,
  submitting = false,
  initialBudget,
  initialYear,
  initialMonth,
  onSubmit,
  onDelete
}: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState("");
  const [values, setValues] = useState({
    categoryId: initialBudget?.categoryId ?? null,
    limitAmount: initialBudget?.limitAmount ? String(initialBudget.limitAmount) : "",
    budgetYear: initialBudget?.budgetYear ?? initialYear ?? new Date().getFullYear(),
    budgetMonth: initialBudget?.budgetMonth ?? initialMonth ?? new Date().getMonth() + 1
  });

  const loadCategories = useCallback(async () => {
    const data = await categoryService.getCategories(userId, "EXPENSE");
    setCategories(data);
    setValues((prev) => ({
      ...prev,
      categoryId:
        prev.categoryId && data.some((item) => item.id === prev.categoryId)
          ? prev.categoryId
          : data[0]?.id ?? null
    }));
  }, [userId]);

  useEffect(() => {
    let active = true;
    setLoadingCategories(true);
    setError("");

    loadCategories()
      .catch(() => {
        if (!active) return;
        setError("Unable to load expense categories.");
      })
      .finally(() => {
        if (active) {
          setLoadingCategories(false);
        }
      });

    return () => {
      active = false;
    };
  }, [loadCategories]);

  useFocusEffect(
    useCallback(() => {
      loadCategories().catch(() => {
        setError("Unable to load expense categories.");
      });
    }, [loadCategories])
  );

  const changeMonth = (delta: number) => {
    const next = new Date(values.budgetYear, values.budgetMonth - 1 + delta, 1);
    setValues((prev) => ({
      ...prev,
      budgetYear: next.getFullYear(),
      budgetMonth: next.getMonth() + 1
    }));
  };

  const submit = async () => {
    if (!values.categoryId) {
      setError("Select an expense category.");
      return;
    }

    if (!values.limitAmount.trim() || Number(values.limitAmount) <= 0) {
      setError("Enter a valid budget amount.");
      return;
    }

    setError("");

    try {
      await onSubmit({
        categoryId: values.categoryId,
        limitAmount: Number(values.limitAmount),
        budgetYear: values.budgetYear,
        budgetMonth: values.budgetMonth
      });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to save budget.");
    }
  };

  const remove = async () => {
    if (!onDelete) return;

    try {
      setError("");
      await onDelete();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to delete budget.");
    }
  };

  if (loadingCategories) {
    return <Loader label="Loading budget form" />;
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Header onBack={() => router.back()} title={title} />

      <View style={styles.monthCard}>
        <Text style={styles.sectionTitle}>Budget Month</Text>
        <View style={styles.monthRow}>
          <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.monthButton}>
            <Ionicons color={colors.textMuted} name="chevron-back" size={18} />
          </TouchableOpacity>
          <Text style={styles.monthValue}>
            {getMonthLabel(values.budgetMonth, values.budgetYear)}
          </Text>
          <TouchableOpacity onPress={() => changeMonth(1)} style={styles.monthButton}>
            <Ionicons color={colors.textMuted} name="chevron-forward" size={18} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Expense Category</Text>
        <TouchableOpacity onPress={() => router.push("/category/add?type=EXPENSE" as never)}>
          <Text style={styles.linkText}>Add Category</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.categoryGrid}>
        {categories.map((category) => {
          const selected = values.categoryId === category.id;
          return (
            <TouchableOpacity
              key={category.id}
              onPress={() => setValues((prev) => ({ ...prev, categoryId: category.id }))}
              style={[styles.categoryChip, selected && styles.categoryChipActive]}
            >
              <Text style={[styles.categoryChipText, selected && styles.categoryChipTextActive]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {categories.length ? null : (
        <Text style={styles.helperText}>
          Create at least one expense category before setting a budget.
        </Text>
      )}

      <View style={styles.formCard}>
        <CustomInput
          keyboardType="decimal-pad"
          label="Monthly Limit"
          onChangeText={(limitAmount) => setValues((prev) => ({ ...prev, limitAmount }))}
          placeholder="2500"
          value={values.limitAmount}
        />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <CustomButton loading={submitting} onPress={submit} title={submitLabel} />
      {onDelete ? (
        <CustomButton
          disabled={submitting}
          onPress={remove}
          style={styles.deleteButton}
          title="Delete Budget"
          variant="danger"
        />
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background
  },
  content: {
    padding: 20,
    paddingTop: 56,
    paddingBottom: 90
  },
  monthCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 18
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10
  },
  sectionTitle: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "700"
  },
  linkText: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: "700"
  },
  monthRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  monthButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.surfaceSoft,
    alignItems: "center",
    justifyContent: "center"
  },
  monthValue: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800"
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 16
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border
  },
  categoryChipActive: {
    borderColor: colors.accent,
    backgroundColor: "rgba(0,214,143,0.12)"
  },
  categoryChipText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "700"
  },
  categoryChipTextActive: {
    color: colors.accent
  },
  formCard: {
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
  helperText: {
    color: colors.textSubtle,
    fontSize: 12,
    marginBottom: 14
  },
  deleteButton: {
    marginTop: 10
  }
});
