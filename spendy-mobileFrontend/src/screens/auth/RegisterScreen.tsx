import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { colors } from "@/src/theme";
import CustomButton from "@/src/components/common/CustomButton";
import CustomInput from "@/src/components/common/CustomInput";
import Header from "@/src/components/common/Header";
import { clearAuthError, register } from "@/src/store/authSlice";
import { useAppDispatch, useAuth } from "@/src/hooks/useAuth";
import { getAuthError } from "@/src/utils/validators";

export default function RegisterScreen() {
  const dispatch = useAppDispatch();
  const { error, isAuthenticated, isLoading } = useAuth();
  const [name, setName] = useState("");
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
    const validationError = getAuthError({ name, email, password });
    setLocalError(validationError);
    if (validationError) return;
    dispatch(register({ name: name.trim(), email: email.trim(), password }));
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Header
        onBack={() => router.back()}
        subtitle="Create your secure spending workspace."
        title="Create account"
      />

      <View style={styles.card}>
        <CustomInput label="Name" onChangeText={setName} placeholder="Rohit Singh" value={name} />
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
          placeholder="At least 6 characters"
          secureTextEntry
          value={password}
        />

        {localError || error ? <Text style={styles.error}>{localError || error}</Text> : null}

        <CustomButton loading={isLoading} onPress={submit} title="Create Account" />
      </View>

      <Pressable onPress={() => router.replace("/auth/login")} style={styles.footerButton}>
        <Text style={styles.footerText}>
          Already have an account? <Text style={styles.footerLink}>Sign in</Text>
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    padding: 24,
    paddingTop: 64
  },
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface
  },
  error: {
    color: colors.danger,
    fontSize: 13,
    marginBottom: 12
  },
  footerButton: {
    alignItems: "center",
    padding: 18
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