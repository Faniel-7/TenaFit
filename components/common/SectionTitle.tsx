import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";

type SectionTitleProps = {
  title: string;
  subtitle?: string;
  rightLabel?: string;
  style?: ViewStyle;
};

export default function SectionTitle({
  title,
  subtitle,
  rightLabel,
  style,
}: SectionTitleProps) {
  return (
    <View style={[styles.row, style]}>
      <View style={styles.left}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      {rightLabel ? <Text style={styles.right}>{rightLabel}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  left: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#64748B",
  },
  right: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2563EB",
  },
});