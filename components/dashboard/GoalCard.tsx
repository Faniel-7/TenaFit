import React from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  calories: number;
  consumed: number;
};

export default function GoalCard({
  calories,
  consumed,
}: Props) {
  const percentage =
    calories > 0
      ? Math.min((consumed / calories) * 100, 100)
      : 0;

  return (
    <View style={styles.goalCard}>
      <View style={styles.goalContent}>
        <View style={styles.sectionHeading}>
          <Ionicons
            name="radio-button-on-outline"
            size={25}
            color="#FFC107"
          />

          <Text style={styles.goalHeading}>
            TODAY'S GOAL
          </Text>
        </View>

        <View style={styles.calorieRow}>
          <Text style={styles.calories}>
            {calories.toLocaleString()}
          </Text>

          <Text style={styles.kcal}>
            kcal
          </Text>
        </View>

        <Text style={styles.goalLabel}>
          Daily Calorie Goal
        </Text>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${percentage}%`,
              },
            ]}
          />
        </View>

        <View style={styles.goalStats}>
          <Text style={styles.consumedText}>
            <Text style={styles.yellowText}>
              {consumed.toLocaleString()} kcal
            </Text>{" "}
            consumed
          </Text>

          <Text style={styles.goalStatText}>
            {calories.toLocaleString()} kcal goal
          </Text>
        </View>
      </View>

      <View style={styles.circularProgress}>
        <View style={styles.circularInner}>
          <Ionicons
            name="flame"
            size={30}
            color="#FFC107"
          />

          <Text style={styles.percentText}>
            {Math.round(percentage)}%
          </Text>

          <Text style={styles.ofGoal}>
            of goal
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  goalCard: {
    minHeight: 300,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "#2D3340",
    backgroundColor: "#0D1119",
    padding: 32,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    overflow: "hidden",
  },

  goalContent: {
    flex: 1,
  },

  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 30,
  },

  goalHeading: {
    color: "#FFC107",
    fontSize: 21,
    fontWeight: "900",
  },

  calorieRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },

  calories: {
    color: "#FFFFFF",
    fontSize: 72,
    fontWeight: "900",
    letterSpacing: -3,
  },

  kcal: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "800",
    marginLeft: 10,
  },

  goalLabel: {
    color: "#A9AFBA",
    fontSize: 19,
    marginTop: 3,
    marginBottom: 20,
  },

  progressTrack: {
    width: "82%",
    height: 16,
    borderRadius: 10,
    backgroundColor: "#202632",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#FFC107",
    borderRadius: 10,
  },

  goalStats: {
    width: "82%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 17,
  },

  consumedText: {
    color: "#A9AFBA",
    fontSize: 15,
  },

  yellowText: {
    color: "#FFC107",
    fontWeight: "900",
  },

  goalStatText: {
    color: "#A9AFBA",
    fontSize: 15,
  },

  circularProgress: {
    width: 210,
    height: 210,
    borderRadius: 105,
    borderWidth: 18,
    borderColor: "#FFC107",
    borderLeftColor: "#252C38",
    borderBottomColor: "#252C38",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 35,
  },

  circularInner: {
    alignItems: "center",
  },

  percentText: {
    color: "#FFFFFF",
    fontSize: 43,
    fontWeight: "900",
    marginTop: 4,
  },

  ofGoal: {
    color: "#B5BAC3",
    fontSize: 16,
    marginTop: -3,
  },
});