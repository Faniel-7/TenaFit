import React from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

type ThemeToggleProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
};

export default function ThemeToggle({
  value,
  onValueChange,
  label = "Dark Mode",
}: ThemeToggleProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        thumbColor={colors.primary}
        trackColor={{ false: "#555", true: colors.primary }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
  },
});