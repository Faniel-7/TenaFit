import React from "react";
import { StyleSheet, Switch, Text, View } from "react-native";

type ThemeToggleProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
};

export default function ThemeToggle({
  value,
  onValueChange,
  label = "Dark mode",
}: ThemeToggleProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A",
  },
});