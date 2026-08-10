import React from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type MacroType = "protein" | "carbs" | "fats";

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  current: number;
  target: number;
  type: MacroType;
};

export default function MacroCard({
  icon,
  title,
  current,
  target,
  type,
}: Props) {
  const percentage =
    target > 0
      ? Math.min((current / target) * 100, 100)
      : 0;

  const color =
    type === "protein"
      ? "#FFC107"
      : type === "carbs"
      ? "#82D94E"
      : "#C060FF";

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
            size={23}
            color={color}
          />
        </View>

        <Text
          style={[
            styles.macroTitle,
            { color },
          ]}
        >
          {title}
        </Text>
      </View>

      <Text style={styles.macroValue}>
        {current}
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
              width: `${percentage}%`,
              backgroundColor: color,
            },
          ]}
        />
      </View>

      <Text
        style={[
          styles.macroPercentage,
          { color },
        ]}
      >
        {Math.round(percentage)}%
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  macroCard: {
    flex: 1,
    minHeight: 215,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#2A303C",
    backgroundColor: "#0D1119",
    padding: 22,
  },

  macroTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
  },

  macroIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
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
    fontSize: 19,
    fontWeight: "900",
  },

  macroValue: {
    color: "#FFFFFF",
    fontSize: 31,
    fontWeight: "900",
    marginTop: 15,
  },

  macroTarget: {
    color: "#B4BAC4",
    fontSize: 17,
    fontWeight: "500",
  },

  macroTrack: {
    height: 13,
    borderRadius: 8,
    backgroundColor: "#202632",
    overflow: "hidden",
    marginTop: 19,
  },

  macroFill: {
    height: "100%",
    borderRadius: 8,
  },

  macroPercentage: {
    fontSize: 18,
    fontWeight: "900",
    marginTop: 16,
  },
});