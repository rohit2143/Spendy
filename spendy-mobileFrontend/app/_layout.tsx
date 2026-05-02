import { useEffect } from "react";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import "react-native-reanimated";

import RootNavigator from "@/src/navigation/RootNavigator";
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
      <RootNavigator />
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
