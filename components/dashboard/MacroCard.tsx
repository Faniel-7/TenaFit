import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export type MacroType =
  | "protein"
  | "carbs"
  | "fats";

type MacroCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: number;
  target: number;
  type: MacroType;
};

export default function MacroCard({
  icon,
  title,
  value,
  target,
  type,
}: MacroCardProps) {
  const percentage =
    target > 0
      ? Math.round((value / target) * 100)
      : 0;

  return (
    <View style={styles.macroCard}>
      <View style={styles.macroTop}>
        <View
          style={[
            styles.macroIcon,
            type === "protein" && styles.proteinIcon,
            type === "carbs" && styles.carbsIcon,
            type === "fats" && styles.fatsIcon,
          ]}
        >
          <Ionicons
            name={icon}
            size={22}
            color={
              type === "protein"
                ? "#FFC107"
                : type === "carbs"
                ? "#82D94E"
                : "#C060FF"
            }
          />
        </View>

        <Text
          numberOfLines={1}
          style={[
            styles.macroTitle,
            type === "protein" && styles.proteinText,
            type === "carbs" && styles.carbsText,
            type === "fats" && styles.fatsText,
          ]}
        >
          {title}
        </Text>
      </View>

      <Text style={styles.macroValue}>
        {value}
        <Text style={styles.macroTarget}>
          {" "}
          / {target} g
        </Text>
      </Text>

      <View style={styles.macroTrack}>
        <View
          style={[
            styles.macroFill,
            {
              width: `${Math.min(percentage, 100)}%`,
            },
            type === "protein" && styles.proteinFill,
            type === "carbs" && styles.carbsFill,
            type === "fats" && styles.fatsFill,
          ]}
        />
      </View>

      <Text
        style={[
          styles.macroPercentage,
          type === "protein" && styles.proteinText,
          type === "carbs" && styles.carbsText,
          type === "fats" && styles.fatsText,
        ]}
      >
        {percentage}%
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  macroCard: {
    flex: 1,
    minWidth: 0,
    minHeight: 180,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: "#2A303C",
    backgroundColor: "#0D1119",
    padding: 18,
  },

  macroTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    minWidth: 0,
  },

  macroIcon: {
    width: 49,
    height: 49,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },

  proteinIcon: {
    backgroundColor: "#30270B",
    borderWidth: 1,
    borderColor: "#8E7200",
  },

  carbsIcon: {
    backgroundColor: "#102316",
    borderWidth: 1,
    borderColor: "#276B35",
  },

  fatsIcon: {
    backgroundColor: "#24122F",
    borderWidth: 1,
    borderColor: "#7A38A5",
  },

  macroTitle: {
    fontSize: 15,
    fontWeight: "900",
    flexShrink: 1,
  },

  proteinText: {
    color: "#FFC107",
  },

  carbsText: {
    color: "#82D94E",
  },

  fatsText: {
    color: "#C060FF",
  },

  macroValue: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "900",
    marginTop: 14,
  },

  macroTarget: {
    color: "#B4BAC4",
    fontSize: 14,
    fontWeight: "500",
  },

  macroTrack: {
    width: "100%",
    height: 10,
    borderRadius: 6,
    backgroundColor: "#202632",
    overflow: "hidden",
    marginTop: 16,
  },

  macroFill: {
    height: "100%",
    borderRadius: 6,
  },

  proteinFill: {
    backgroundColor: "#FFC107",
  },

  carbsFill: {
    backgroundColor: "#82D94E",
  },

  fatsFill: {
    backgroundColor: "#C060FF",
  },

  macroPercentage: {
    fontSize: 15,
    fontWeight: "900",
    marginTop: 12,
  },
});