import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type GoalCardProps = {
  mobile?: boolean;
  consumed?: number;
  goal?: number;
};

export default function GoalCard({
  mobile = false,
  consumed = 1240,
  goal = 1850,
}: GoalCardProps) {
  const percentage = Math.round((consumed / goal) * 100);

  return (
    <View
      style={[
        styles.goalCard,
        mobile && styles.mobileGoalCard,
      ]}
    >
      <View
        style={[
          styles.goalContent,
          mobile && styles.mobileGoalContent,
        ]}
      >
        <View style={styles.sectionHeading}>
          <Ionicons
            name="radio-button-on-outline"
            size={22}
            color="#FFC107"
          />

          <Text style={styles.goalHeading}>
            TODAY'S GOAL
          </Text>
        </View>

        <View style={styles.calorieRow}>
          <Text
            style={[
              styles.calories,
              mobile && styles.mobileCalories,
            ]}
          >
            {consumed.toLocaleString()}
          </Text>

          <Text
            style={[
              styles.kcal,
              mobile && styles.mobileKcal,
            ]}
          >
            kcal
          </Text>
        </View>

        <Text
          style={[
            styles.goalLabel,
            mobile && styles.mobileGoalLabel,
          ]}
        >
          Daily Calorie Goal
        </Text>

        <View
          style={[
            styles.progressTrack,
            mobile && styles.mobileProgressTrack,
          ]}
        >
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min(percentage, 100)}%`,
              },
            ]}
          />
        </View>

        <View
          style={[
            styles.goalStats,
            mobile && styles.mobileGoalStats,
          ]}
        >
          <Text style={styles.consumedText}>
            <Text style={styles.yellowText}>
              {consumed.toLocaleString()} kcal
            </Text>{" "}
            consumed
          </Text>

          <Text style={styles.goalStatText}>
            {goal.toLocaleString()} kcal goal
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.circularProgress,
          mobile && styles.mobileCircularProgress,
        ]}
      >
        <View style={styles.circularInner}>
          <Ionicons
            name="flame"
            size={mobile ? 24 : 30}
            color="#FFC107"
          />

          <Text
            style={[
              styles.percentText,
              mobile && styles.mobilePercentText,
            ]}
          >
            {percentage}%
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
    width: "100%",
    minHeight: 280,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: "#2A303C",
    backgroundColor: "#0D1119",
    padding: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    overflow: "hidden",
  },

  goalContent: {
    flex: 1,
    minWidth: 0,
  },

  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 23,
  },

  goalHeading: {
    color: "#FFC107",
    fontSize: 17,
    fontWeight: "900",
  },

  calorieRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },

  calories: {
    color: "#FFFFFF",
    fontSize: 60,
    fontWeight: "900",
    letterSpacing: -3,
  },

  kcal: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "800",
    marginLeft: 8,
  },

  goalLabel: {
    color: "#A9AFBA",
    fontSize: 17,
    marginTop: 2,
    marginBottom: 17,
  },

  progressTrack: {
    width: "90%",
    height: 13,
    borderRadius: 8,
    backgroundColor: "#202632",
    overflow: "hidden",
  },
progressFill: {
    height: "100%",
    backgroundColor: "#FFC107",
    borderRadius: 8,
  },

  goalStats: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 13,
  },

  consumedText: {
    color: "#A9AFBA",
    fontSize: 13,
  },

  yellowText: {
    color: "#FFC107",
    fontWeight: "900",
  },

  goalStatText: {
    color: "#A9AFBA",
    fontSize: 13,
  },

  circularProgress: {
    width: 185,
    height: 185,
    borderRadius: 93,
    borderWidth: 15,
    borderColor: "#FFC107",
    borderLeftColor: "#252C38",
    borderBottomColor: "#252C38",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 25,
    flexShrink: 0,
  },

  circularInner: {
    alignItems: "center",
  },

  percentText: {
    color: "#FFFFFF",
    fontSize: 38,
    fontWeight: "900",
    marginTop: 3,
  },

  ofGoal: {
    color: "#B5BAC3",
    fontSize: 14,
    marginTop: -2,
  },

  mobileGoalCard: {
    minHeight: 250,
    padding: 20,
    marginBottom: 16,
    borderRadius: 22,
  },

  mobileGoalContent: {
    flex: 1,
    minWidth: 0,
  },

  mobileCalories: {
    fontSize: 43,
    letterSpacing: -2,
  },

  mobileKcal: {
    fontSize: 16,
    marginLeft: 5,
  },

  mobileGoalLabel: {
    fontSize: 14,
    marginBottom: 14,
    flexShrink: 1,
  },

  mobileProgressTrack: {
    width: "100%",
    height: 10,
  },

  mobileGoalStats: {
    width: "100%",
    marginTop: 11,
  },

  mobileCircularProgress: {
    width: 125,
    height: 125,
    borderRadius: 63,
    borderWidth: 11,
    marginLeft: 12,
    flexShrink: 0,
  },

  mobilePercentText: {
    fontSize: 28,
  },
});