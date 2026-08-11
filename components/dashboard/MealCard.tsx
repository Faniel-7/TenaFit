import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export type MealType =
  | "breakfast"
  | "lunch"
  | "dinner"
  | "snacks";

export type Meal = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  calories: number | null;
  type: MealType;
};

type MealCardProps = {
  meals?: Meal[];
  onViewAll?: () => void;
};

const defaultMeals: Meal[] = [
  {
    icon: "sunny-outline",
    title: "Breakfast",
    description: "Oatmeal, Banana, Protein Shake",
    calories: 420,
    type: "breakfast",
  },
  {
    icon: "sunny-outline",
    title: "Lunch",
    description: "Chicken, Rice, Vegetables",
    calories: 580,
    type: "lunch",
  },
  {
    icon: "moon-outline",
    title: "Dinner",
    description: "No meals added",
    calories: null,
    type: "dinner",
  },
  {
    icon: "nutrition-outline",
    title: "Snacks",
    description: "No snacks added",
    calories: null,
    type: "snacks",
  },
];

export default function MealCard({
  meals = defaultMeals,
  onViewAll,
}: MealCardProps) {
  const totalCalories = meals.reduce(
    (total, meal) =>
      total + (meal.calories ?? 0),
    0
  );

  return (
    <View style={styles.mealsCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>
          TODAY'S MEALS
        </Text>

        <Pressable onPress={onViewAll}>
          <Text style={styles.viewAll}>
            View all
          </Text>
        </Pressable>
      </View>

      {meals.map((meal) => (
        <MealRow
          key={meal.type}
          {...meal}
        />
      ))}

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>
          TOTAL CONSUMED
        </Text>

        <Text style={styles.totalValue}>
          {totalCalories.toLocaleString()}{" "}
          <Text style={styles.totalUnit}>
            kcal
          </Text>
        </Text>
      </View>
    </View>
  );
}

function MealRow({
  icon,
  title,
  description,
  calories,
  type,
}: Meal) {
  return (
    <Pressable style={styles.mealRow}>
      <View
        style={[
          styles.mealIcon,
          type === "breakfast" &&
            styles.breakfastIcon,
          type === "lunch" &&
            styles.lunchIcon,
          type === "dinner" &&
            styles.dinnerIcon,
          type === "snacks" &&
            styles.snacksIcon,
        ]}
      >
        <Ionicons
          name={icon}
          size={21}
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
          {calories === null
            ? "--"
            : calories}
        </Text>

        <Text style={styles.calorieUnit}>
          kcal
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={21}
        color="#FFC107"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  mealsCard: {
    flex: 1.25,
    minWidth: 0,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: "#2A303C",
    backgroundColor: "#0D1119",
    padding: 20,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 13,
  },

  cardTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },

  viewAll: {
    color: "#FFC107",
    fontSize: 13,
    fontWeight: "800",
  },

  mealRow: {
    minHeight: 76,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#222833",
  },

  mealIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    flexShrink: 0,
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
    minWidth: 0,
  },

  mealTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  mealDescription: {
    color: "#9CA3AF",
    fontSize: 12,
    marginTop: 3,
  },

  mealCalories: {
    alignItems: "flex-end",
    marginRight: 10,
    flexShrink: 0,
  },

  calorieNumber: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  calorieUnit: {
    color: "#9CA3AF",
    fontSize: 11,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 17,
  },

  totalLabel: {
    color: "#9CA3AF",
    fontSize: 13,
    fontWeight: "700",
  },

  totalValue: {
    color: "#FFC107",
    fontSize: 22,
    fontWeight: "900",
  },

  totalUnit: {
    fontSize: 13,
  },
});