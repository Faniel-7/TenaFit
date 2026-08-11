import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MealType } from "../../data/dashboardData";

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  calories: number | null;
  type: MealType;
};

export default function MealRow({
  icon,
  title,
  description,
  calories,
  type,
}: Props) {
  return (
    <Pressable style={styles.mealRow}>
      <View
        style={[
          styles.mealIcon,
          type === "breakfast" && styles.breakfastIcon,
          type === "lunch" && styles.lunchIcon,
          type === "dinner" && styles.dinnerIcon,
          type === "snacks" && styles.snacksIcon,
        ]}
      >
        <Ionicons
          name={icon}
          size={22}
          color="#FFC107"
        />
      </View>

      <View style={styles.mealInfo}>
        <Text style={styles.mealTitle}>
          {title}
        </Text>

        <Text
          style={styles.mealDescription}
          numberOfLines={1}
        >
          {description}
        </Text>
      </View>

      <View style={styles.mealCalories}>
        <Text style={styles.calorieNumber}>
          {calories ?? "--"}
        </Text>

        <Text style={styles.calorieUnit}>
          kcal
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={22}
        color="#FFC107"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  mealRow: {
    minHeight: 85,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#222833",
  },

  mealIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  breakfastIcon: {
    backgroundColor: "#30270B",
  },

  lunchIcon: {
    backgroundColor: "#132516",
  },

  dinnerIcon: {
    backgroundColor: "#101E38",
  },

  snacksIcon: {
    backgroundColor: "#32151A",
  },

  mealInfo: {
    flex: 1,
  },

  mealTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
  },

  mealDescription: {
    color: "#9CA3AF",
    fontSize: 13,
    marginTop: 4,
  },

  mealCalories: {
    alignItems: "flex-end",
    marginRight: 14,
  },

  calorieNumber: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },

  calorieUnit: {
    color: "#9CA3AF",
    fontSize: 12,
  },
});