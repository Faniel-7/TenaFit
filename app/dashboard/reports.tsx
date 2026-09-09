import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DashboardPage, {
  DashboardCard,
  DashboardSection,
} from "../../components/dashboard/DashboardPage";
import { useAppData } from "../../context/AppDataContext";

export default function ReportsScreen() {
  const {
    data,
    goals,
    calorieProgress,
    proteinProgress,
    carbsProgress,
    fatProgress,
    waterProgress,
    stepsProgress,
    overallProgress,
    meals,
  } = useAppData();

  const caloriesRemaining = Math.max(
    goals.calories - data.calories,
    0
  );

  const proteinRemaining = Math.max(
    goals.protein - data.protein,
    0
  );

  const waterRemaining = Math.max(
    goals.water - data.water,
    0
  );

  const completedGoals = [
    calorieProgress >= 1,
    proteinProgress >= 1,
    carbsProgress >= 1,
    fatProgress >= 1,
    waterProgress >= 1,
    stepsProgress >= 1,
  ].filter(Boolean).length;

  return (
    <DashboardPage
      title="Reports"
      subtitle="Review your nutrition and activity for today."
      icon="document-text-outline"
    >
      <DashboardSection
        title="Daily Report"
        subtitle="Your overall progress across today's targets."
      >
        <View style={styles.overviewCard}>
          <View style={styles.overviewCircle}>
            <Text style={styles.overviewValue}>
              {overallProgress}%
            </Text>

            <Text style={styles.overviewLabel}>
              Complete
            </Text>
          </View>

          <View style={styles.overviewContent}>
            <Text style={styles.overviewTitle}>
              Daily performance
            </Text>

            <Text style={styles.overviewText}>
              {completedGoals} of 6 daily targets reached.
            </Text>

            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${overallProgress}%`,
                  },
                ]}
              />
            </View>
          </View>
        </View>
      </DashboardSection>

      <DashboardSection
        title="Nutrition"
        subtitle="Today's calories and macronutrients."
      >
        <DashboardCard
          icon="flame-outline"
          title="Calories"
          description={`${Math.round(caloriesRemaining)} kcal remaining`}
          value={`${Math.round(data.calories)} / ${Math.round(goals.calories)} kcal`}
        />

        <DashboardCard
          icon="fitness-outline"
          title="Protein"
          description={`${Math.round(proteinRemaining)} g remaining`}
          value={`${Math.round(data.protein)} / ${Math.round(goals.protein)} g`}
        />

        <DashboardCard
          icon="nutrition-outline"
          title="Carbohydrates"
          description={`${Math.round(Math.max(goals.carbs - data.carbs, 0))} g remaining`}
          value={`${Math.round(data.carbs)} / ${Math.round(goals.carbs)} g`}
        />

        <DashboardCard
          icon="water-outline"
          title="Fat"
          description={`${Math.round(Math.max(goals.fat - data.fat, 0))} g remaining`}
          value={`${Math.round(data.fat)} / ${Math.round(goals.fat)} g`}
        />
      </DashboardSection>

      <DashboardSection
        title="Hydration & Activity"
        subtitle="Water and movement tracked today."
      >
        <DashboardCard
          icon="water-outline"
          title="Water"
          description={`${waterRemaining.toFixed(2)} L remaining`}
          value={`${data.water.toFixed(2)} / ${goals.water.toFixed(2)} L`}
        />
        <DashboardCard
          icon="walk-outline"
          title="Steps"
          description={`${Math.max(goals.steps - data.steps, 0).toLocaleString()} steps remaining`}
          value={`${Math.round(data.steps).toLocaleString()} / ${Math.round(goals.steps).toLocaleString()}`}
        />
      </DashboardSection>

      <DashboardSection
        title="Meals"
        subtitle="Foods recorded in today's tracker."
      >
        <View style={styles.mealSummary}>
          <View style={styles.mealSummaryIcon}>
            <Ionicons
              name="restaurant-outline"
              size={23}
              color="#FFC107"
            />
          </View>

          <View style={styles.mealSummaryContent}>
            <Text style={styles.mealSummaryTitle}>
              {meals.length}{" "}
              {meals.length === 1 ? "food" : "foods"} recorded
            </Text>

            <Text style={styles.mealSummaryText}>
              {Math.round(data.calories)} kcal recorded
              from today's meals.
            </Text>
          </View>
        </View>

        {meals.length > 0 && (
          <View style={styles.mealList}>
            {meals.map((meal) => (
              <View
                key={meal.id}
                style={styles.mealRow}
              >
                <View style={styles.mealRowInfo}>
                  <Text
                    style={styles.mealName}
                    numberOfLines={1}
                  >
                    {meal.food.nameEnglish}
                  </Text>

                  <Text style={styles.mealType}>
                    {meal.mealType}
                  </Text>
                </View>

                <Text style={styles.mealCalories}>
                  {Math.round(meal.calories)} kcal
                </Text>
              </View>
            ))}
          </View>
        )}
      </DashboardSection>

      <DashboardSection
        title="Report Status"
        subtitle="A quick interpretation of your current day."
      >
        <View style={styles.statusCard}>
          <View style={styles.statusIcon}>
            <Ionicons
              name={
                overallProgress >= 80
                  ? "checkmark-circle-outline"
                  : "analytics-outline"
              }
              size={25}
              color={
                overallProgress >= 80
                  ? "#54D68C"
                  : "#FFC107"
              }
            />
          </View>

          <View style={styles.statusContent}>
            <Text style={styles.statusTitle}>
              {overallProgress >= 80
                ? "You're having a strong day"
                : overallProgress >= 40
                ? "You're making progress"
                : "Your day is just getting started"}
            </Text>

            <Text style={styles.statusText}>
              Keep tracking your meals, water, and activity
              to build a complete daily record.
            </Text>
          </View>
        </View>
      </DashboardSection>
    </DashboardPage>
  );
}

const styles = StyleSheet.create({
  overviewCard: {
    minHeight: 145,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#242A34",
    backgroundColor: "#10141B",
    padding: 17,
    flexDirection: "row",
    alignItems: "center",
  },

  overviewCircle: {
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 7,
    borderColor: "#FFC107",
    alignItems: "center",
    justifyContent: "center",
  },

  overviewValue: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
  },

  overviewLabel: {
    color: "#737B89",
    fontSize: 8,
    fontWeight: "800",
    marginTop: 2,
  },

  overviewContent: {
    flex: 1,
    marginLeft: 18,
  },

  overviewTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },

  overviewText: {
    color: "#737B89",
    fontSize: 10,
    marginTop: 5,
  },
progressTrack: {
    height: 7,
    borderRadius: 7,
    backgroundColor: "#252B35",
    overflow: "hidden",
    marginTop: 13,
  },

  progressFill: {
    height: "100%",
    borderRadius: 7,
    backgroundColor: "#FFC107",
  },

  mealSummary: {
    minHeight: 78,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#242A34",
    backgroundColor: "#10141B",
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  mealSummaryIcon: {
    width: 47,
    height: 47,
    borderRadius: 14,
    backgroundColor: "#1D1B14",
    alignItems: "center",
    justifyContent: "center",
  },

  mealSummaryContent: {
    flex: 1,
    marginLeft: 13,
  },

  mealSummaryTitle: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },

  mealSummaryText: {
    color: "#737B89",
    fontSize: 9,
    marginTop: 4,
  },

  mealList: {
    marginTop: 9,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#242A34",
    backgroundColor: "#0C1016",
    overflow: "hidden",
  },

  mealRow: {
    minHeight: 52,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#242A34",
  },

  mealRowInfo: {
    flex: 1,
    marginRight: 10,
  },

  mealName: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
  },

  mealType: {
    color: "#737B89",
    fontSize: 8,
    marginTop: 3,
    textTransform: "capitalize",
  },

  mealCalories: {
    color: "#FFC107",
    fontSize: 10,
    fontWeight: "900",
  },

  statusCard: {
    minHeight: 82,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#242A34",
    backgroundColor: "#10141B",
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  statusIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#1D1B14",
    alignItems: "center",
    justifyContent: "center",
  },

  statusContent: {
    flex: 1,
    marginLeft: 13,
  },

  statusTitle: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },

  statusText: {
    color: "#737B89",
    fontSize: 10,
    marginTop: 5,
    lineHeight: 15,
  },
});