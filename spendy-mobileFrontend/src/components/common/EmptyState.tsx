import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/src/theme";

type Props = {
  title: string;
  message?: string;
  icon?: keyof typeof Ionicons.glyphMap;
};

export default function EmptyState({ title, message, icon = "file-tray-outline" }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={28} color={colors.accent} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 8
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,214,143,0.1)"
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700"
  },
  message: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: "center"
  }
});