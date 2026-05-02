import { Stack } from "expo-router";

export default function RootNavigator() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="auth" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="transaction/add"
        options={{ presentation: "card" }}
      />
      <Stack.Screen
        name="transaction/[id]"
        options={{ presentation: "card" }}
      />
      <Stack.Screen
        name="category/add"
        options={{ presentation: "card" }}
      />
      <Stack.Screen
        name="category/[id]"
        options={{ presentation: "card" }}
      />
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
    </Stack>
  );
}
