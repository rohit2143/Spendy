import { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import CustomButton from "@/src/components/common/CustomButton";
import Header from "@/src/components/common/Header";
import Loader from "@/src/components/common/Loader";
import { categoryService } from "@/src/services/categoryService";
import { colors } from "@/src/theme";
import type { Category } from "@/src/types/category";
import type { ImportStatus, Transaction, TransactionSource, TransactionType } from "@/src/types/transaction";

type FormValues = {
  categoryId: number | null;
  amount: string;
  type: TransactionType;
  transactionDate: string;
  description: string;
  merchant: string;
  source: TransactionSource;
  importStatus: ImportStatus;
};

type Props = {
  title: string;
  userId: number;
  submitting?: boolean;
  submitLabel: string;
  initialValues?: Partial<FormValues>;
  initialTransaction?: Transaction | null;
  onSubmit: (values: {
    categoryId: number;
    amount: number;
    type: TransactionType;
    transactionDate: string;
    description: string;
    merchant?: string;
    source: TransactionSource;
    importStatus: ImportStatus;
    externalMessageId?: string;
    rawMessage?: string;
  }) => void;
  onDelete?: () => void;
};

export default function TransactionForm({
  title,
  userId,
  submitting = false,
  submitLabel,
  initialValues,
  initialTransaction,
  onSubmit,
  onDelete
}: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState("");
  const [values, setValues] = useState<FormValues>({
    categoryId: initialValues?.categoryId ?? initialTransaction?.categoryId ?? null,
    amount:
      initialValues?.amount ??
      (initialTransaction?.amount !== undefined ? String(initialTransaction.amount) : ""),
    type: initialValues?.type ?? initialTransaction?.type ?? "EXPENSE",
    transactionDate:
      initialValues?.transactionDate ??
      initialTransaction?.transactionDate ??
      new Date().toISOString().slice(0, 10),
    description: initialValues?.description ?? initialTransaction?.description ?? "",
    merchant: initialValues?.merchant ?? initialTransaction?.merchant ?? "",
    source: initialValues?.source ?? initialTransaction?.source ?? "MANUAL",
    importStatus: initialValues?.importStatus ?? initialTransaction?.importStatus ?? "MANUAL"
  });

  useEffect(() => {
    let active = true;
    setLoadingCategories(true);
    categoryService
      .getCategories(userId, values.type)
      .then((data) => {
        if (!active) return;
        setCategories(data);
        setLoadingCategories(false);
        if (!data.some((item) => item.id === values.categoryId)) {
          setValues((prev) => ({ ...prev, categoryId: data[0]?.id ?? null }));
        }
      })
      .catch(() => {
        if (!active) return;
        setLoadingCategories(false);
        setError("Unable to load categories.");
      });

    return () => {
      active = false;
    };
  }, [userId, values.type, values.categoryId]);

  const categoryChoices = useMemo(() => categories.slice(0, 8), [categories]);

  const submit = () => {
    if (!values.categoryId) return setError("Select a category.");
    if (!values.amount.trim() || Number(values.amount) <= 0) return setError("Enter a valid amount.");
    if (!values.description.trim()) return setError("Description is required.");

    setError("");
    onSubmit({
      categoryId: values.categoryId,
      amount: Number(values.amount),
      type: values.type,
      transactionDate: values.transactionDate,
      description: values.description.trim(),
      merchant: values.merchant.trim() || undefined,
      source: values.source,
      importStatus: values.importStatus
    });
  };

  if (loadingCategories) {
    return <Loader label="Loading form" />;
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Header onBack={() => router.back()} title={title} />

      <View style={styles.toggleRow}>
        {(["EXPENSE", "INCOME"] as TransactionType[]).map((type) => {
          const active = values.type === type;
          return (
            <TouchableOpacity
              key={type}
              onPress={() => setValues((prev) => ({ ...prev, type, categoryId: null }))}
              style={[styles.toggleOption, active && (type === "EXPENSE" ? styles.expenseActive : styles.incomeActive)]}
            >
              <Text style={[styles.toggleText, active && (type === "EXPENSE" ? styles.expenseText : styles.incomeText)]}>
                {type}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.amountWrap}>
        <Text style={styles.currency}>Rs.</Text>
        <TextInput
          keyboardType="decimal-pad"
          onChangeText={(amount) => setValues((prev) => ({ ...prev, amount }))}
          placeholder="0"
          placeholderTextColor={colors.textSubtle}
          style={styles.amountInput}
          value={values.amount}
        />
      </View>

      <Text style={styles.sectionTitle}>Category</Text>
      <View style={styles.categoryGrid}>
        {categoryChoices.map((category) => {
          const selected = values.categoryId === category.id;
          return (
            <TouchableOpacity
              key={category.id}
              onPress={() => setValues((prev) => ({ ...prev, categoryId: category.id }))}
              style={styles.categoryItem}
            >
              <View style={[styles.categoryIcon, selected && styles.categorySelected]}>
                <Ionicons
                  color={selected ? colors.accent : colors.textMuted}
                  name="pricetag-outline"
                  size={18}
                />
              </View>
              <Text numberOfLines={1} style={styles.categoryText}>
                {category.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.formCard}>
        <FormRow label="Description">
          <TextInput
            onChangeText={(description) => setValues((prev) => ({ ...prev, description }))}
            placeholder="Dinner, cab, salary..."
            placeholderTextColor={colors.textSubtle}
            style={styles.input}
            value={values.description}
          />
        </FormRow>
        <FormRow label="Merchant">
          <TextInput
            onChangeText={(merchant) => setValues((prev) => ({ ...prev, merchant }))}
            placeholder="Optional"
            placeholderTextColor={colors.textSubtle}
            style={styles.input}
            value={values.merchant}
          />
        </FormRow>
        <FormRow label="Date">
          <TextInput
            onChangeText={(transactionDate) => setValues((prev) => ({ ...prev, transactionDate }))}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.textSubtle}
            style={styles.input}
            value={values.transactionDate}
          />
        </FormRow>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <CustomButton loading={submitting} onPress={submit} title={submitLabel} />
      {onDelete ? (
        <CustomButton
          disabled={submitting}
          onPress={onDelete}
          style={styles.deleteButton}
          title="Delete Transaction"
          variant="danger"
        />
      ) : null}
    </ScrollView>
  );
}

function FormRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.formRow}>
      <Text style={styles.formLabel}>{label}</Text>
      <View style={styles.formValue}>{children}</View>
    </View>
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
  amountWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18
  },
  currency: {
    color: colors.accent,
    fontSize: 28,
    fontWeight: "800",
    marginRight: 8
  },
  amountInput: {
    color: colors.text,
    fontSize: 40,
    fontWeight: "900",
    minWidth: 160,
    textAlign: "center"
  },
  sectionTitle: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 10
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 16
  },
  categoryItem: {
    width: "22%",
    alignItems: "center",
    gap: 6
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent"
  },
  categorySelected: {
    borderColor: colors.accent
  },
  categoryText: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: "600",
    textAlign: "center"
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14
  },
  formRow: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#0f1a2a"
  },
  formLabel: {
    color: colors.textMuted,
    fontSize: 12,
    marginBottom: 6
  },
  formValue: {},
  input: {
    color: colors.text,
    fontSize: 14,
    padding: 0
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