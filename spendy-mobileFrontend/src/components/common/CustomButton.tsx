import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import { colors } from "@/src/theme";

type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "ghost" | "danger";
  style?: ViewStyle;
};

export default function CustomButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",
  style
}: Props) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
        style
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? colors.black : colors.text} />
      ) : (
        <Text style={[styles.title, variant === "primary" && styles.primaryTitle]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18
  },
  primary: {
    backgroundColor: colors.accent
  },
  ghost: {
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border
  },
  danger: {
    backgroundColor: "rgba(255,82,82,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,82,82,0.25)"
  },
  disabled: {
    opacity: 0.65
  },
  pressed: {
    transform: [{ scale: 0.99 }],
    opacity: 0.9
  },
  title: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700"
  },
  primaryTitle: {
    color: colors.black
  }
});