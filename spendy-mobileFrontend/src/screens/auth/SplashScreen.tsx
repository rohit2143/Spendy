import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { colors } from "@/src/theme";
import Loader from "@/src/components/common/Loader";
import { restoreSession } from "@/src/store/authSlice";
import { useAppDispatch, useAuth } from "@/src/hooks/useAuth";

export default function SplashScreen() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isRestoring } = useAuth();

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  useEffect(() => {
    if (!isRestoring) {
      router.replace(isAuthenticated ? "/(tabs)" : "/auth/login");
    }
  }, [isAuthenticated, isRestoring]);

  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Text style={styles.logoText}>S</Text>
      </View>
      <Text style={styles.title}>Spendy</Text>
      <Text style={styles.subtitle}>Money clarity, every month</Text>
      <View style={styles.loader}>
        <Loader label="Restoring your wallet" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#061020",
    padding: 24
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accent,
    marginBottom: 12
  },
  logoText: {
    color: colors.text,
    fontSize: 36,
    fontWeight: "900"
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: "900"
  },
  subtitle: {
    color: colors.textSubtle,
    fontSize: 14,
    marginTop: 4
  },
  loader: {
    width: "100%",
    height: 80,
    marginTop: 24
  }
});