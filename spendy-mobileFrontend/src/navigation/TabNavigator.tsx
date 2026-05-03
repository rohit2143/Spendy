import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/src/theme";

export default function TabNavigator() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSubtle,
        tabBarStyle: {
          backgroundColor: "#0d1525",
          borderTopColor: colors.border,
          height: 70,
          paddingBottom: 10,
          paddingTop: 8
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons color={color} name="home-outline" size={size} />
          )
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: "Txns",
          tabBarIcon: ({ color, size }) => (
            <Ionicons color={color} name="list-outline" size={size} />
          )
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: "Cats",
          tabBarIcon: ({ color, size }) => (
            <Ionicons color={color} name="pricetags-outline" size={size} />
          )
        }}
      />
      <Tabs.Screen
        name="budgets"
        options={{
          title: "Budget",
          tabBarIcon: ({ color, size }) => (
            <Ionicons color={color} name="wallet-outline" size={size} />
          )
        }}
      />
    </Tabs>
  );
}
