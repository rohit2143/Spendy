import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { colors } from "@/src/theme";
import CustomButton from "@/src/components/common/CustomButton";
import CustomInput from "@/src/components/common/CustomInput";
import { clearAuthError, login } from "@/src/store/authSlice";
import { useAppDispatch, useAuth } from "@/src/hooks/useAuth";
import { getAuthError } from "@/src/utils/validators";

export default function LoginScreen() {
  const dispatch = useAppDispatch();
  const { error, isAuthenticated, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (isAuthenticated) router.replace("/(tabs)");
  }, [isAuthenticated]);

  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  const submit = () => {
    const validationError = getAuthError({ email, password });
    setLocalError(validationError);
    if (validationError) return;
    dispatch(login({ email: email.trim(), password }));
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.brandRow}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>S</Text>
        </View>
        <Text style={styles.brand}>Spendy</Text>
      </View>

      <Text style={styles.title}>Welcome back</Text>
      <Text style={styles.subtitle}>Track income, expenses, and budgets with confidence.</Text>

      <CustomInput
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        label="Email"
        onChangeText={setEmail}
        placeholder="you@example.com"
        value={email}
      />
      <CustomInput
        label="Password"
        onChangeText={setPassword}
        placeholder="Your password"
        secureTextEntry
        value={password}
      />

      {localError || error ? <Text style={styles.error}>{localError || error}</Text> : null}

      <CustomButton loading={isLoading} onPress={submit} title="Sign In" />

      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>New to Spendy?</Text>
        <View style={styles.line} />
      </View>

      <Pressable onPress={() => router.push("/auth/register")} style={styles.footerButton}>
        <Text style={styles.footerText}>
          Create your account <Text style={styles.footerLink}>Register</Text>
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: colors.background,
    padding: 24
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 32
  },
  logo: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accent
  },
  logoText: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900"
  },
  brand: {
    color: colors.text,
    fontSize: 26,
    fontWeight: "900"
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 4
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 14,
    marginBottom: 28
  },
  error: {
    color: colors.danger,
    fontSize: 13,
    marginBottom: 12
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 22
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border
  },
  dividerText: {
    color: colors.textSubtle,
    fontSize: 12
  },
  footerButton: {
    alignItems: "center",
    padding: 8
  },
  footerText: {
    color: colors.textMuted,
    fontSize: 13
  },
  footerLink: {
    color: colors.accent,
    fontWeight: "800"
  }
});