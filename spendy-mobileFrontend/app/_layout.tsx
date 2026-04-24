import { useEffect } from "react";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";
import { Provider } from "react-redux";
import "react-native-reanimated";

import { store } from "@/src/store";
import { restoreSession } from "@/src/store/authSlice";
import { useAppDispatch } from "@/src/hooks/useAuth";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

function AppInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="auth/login"
          options={{ presentation: "card" }}
        />
        <Stack.Screen
          name="auth/register"
          options={{ presentation: "card" }}
        />
        <Stack.Screen
          name="modal"
          options={{
            presentation: "modal",
            headerShown: true,
            title: "Modal",
          }}
        />
      </Stack>

      <StatusBar style="light" />
    </>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <ThemeProvider value={DarkTheme}>
        <AppInitializer />
      </ThemeProvider>
    </Provider>
  );
}