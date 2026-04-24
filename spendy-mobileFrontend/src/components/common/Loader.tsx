import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { colors } from "@/src/theme";

type Props = {
  label?: string;
};

export default function Loader({ label = "Loading" }: Props) {
  return (
    <View style={styles.container}>
      <ActivityIndicator color={colors.accent} size="large" />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    gap: 12
  },
  label: {
    color: colors.textMuted,
    fontSize: 13
  }
});