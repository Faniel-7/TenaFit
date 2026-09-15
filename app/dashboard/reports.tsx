import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DashboardPage, {
  DashboardSection,
} from "../../components/dashboard/DashboardPage";
import { useAppData } from "../../context/AppDataContext";
import { useTheme } from "../../context/ThemeContext";

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

  const { colors } = useTheme();

  const caloriesRemaining = Math.max(goals.calories - data.calories, 0);
  const proteinRemaining = Math.max(goals.protein - data.protein, 0);
  const carbsRemaining = Math.max(goals.carbs - data.carbs, 0);
  const fatRemaining = Math.max(goals.fat - data.fat, 0);
  const waterRemaining = Math.max(goals.water - data.water, 0);
  const stepsRemaining = Math.max(goals.steps - data.steps, 0);

  const completedGoals = [
    calorieProgress >= 1,
    proteinProgress >= 1,
    carbsProgress >= 1,
    fatProgress >= 1,
    waterProgress >= 1,
    stepsProgress >= 1,
  ].filter(Boolean).length;

  const getStatus = () => {
    if (overallProgress >= 80) {
      return {
        title: "Excellent progress",
        text: "You're doing a great job staying consistent with today's targets.",
        icon: "checkmark-circle-outline" as const,
      };
    }

    if (overallProgress >= 50) {
      return {
        title: "Good progress",
        text: "You're on your way. Keep tracking your meals, water, and activity.",
        icon: "trending-up-outline" as const,
      };
    }

    return {
      title: "Keep building your day",
      text: "There is still plenty of time to work toward your nutrition and activity goals.",
      icon: "analytics-outline" as const,
    };
  };

  const status = getStatus();

  const MetricCard = ({
    icon,
    title,
    current,
    goal,
    remaining,
    unit,
    progress,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    current: string;
    goal: string;
    remaining: string;
    unit: string;
    progress: number;
  }) => (
    <View
      style={[
        styles.metricCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.metricTop}>
        <View
          style={[
            styles.metricIcon,
            { backgroundColor: `${colors.primary}18` },
          ]}
        >
          <Ionicons name={icon} size={20} color={colors.primary} />
        </View>

        <View style={styles.metricTextContainer}>
          <Text style={[styles.metricTitle, { color: colors.text }]}>
            {title}
          </Text>
          <Text style={[styles.metricRemaining, { color: colors.subtext }]}>
            {remaining}
          </Text>
        </View>
      </View>

      <View style={styles.metricValues}>
        <Text style={[styles.metricCurrent, { color: colors.text }]}>
          {current}
          <Text style={[styles.metricUnit, { color: colors.subtext }]}>
            {" "}
            {unit}
          </Text>
        </Text>

        <Text style={[styles.metricGoal, { color: colors.subtext }]}>
          / {goal} {unit}
        </Text>
      </View>

      <View
        style={[
          styles.progressTrack,
          { backgroundColor: colors.border },
        ]}
      >
        <View
          style={[
            styles.progressFill,
            {
              width: `${Math.min(progress * 100, 100)}%`,
              backgroundColor: colors.primary,
            },
          ]}
        />
      </View>
    </View>
  );

  return (
    <DashboardPage
      title="Reports"
subtitle="Review your nutrition and activity for today."
      icon="document-text-outline"
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <DashboardSection
          title="Daily overview"
          subtitle="Your progress across today's targets."
        >
          <View
            style={[
              styles.overviewCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.progressCircle,
                { borderColor: colors.primary },
              ]}
            >
              <Text
                style={[
                  styles.progressPercentage,
                  { color: colors.text },
                ]}
              >
                {overallProgress}%
              </Text>

              <Text
                style={[
                  styles.progressComplete,
                  { color: colors.subtext },
                ]}
              >
                complete
              </Text>
            </View>

            <View style={styles.overviewInfo}>
              <Text
                style={[
                  styles.overviewTitle,
                  { color: colors.text },
                ]}
              >
                Today's performance
              </Text>

              <Text
                style={[
                  styles.overviewDescription,
                  { color: colors.subtext },
                ]}
              >
                {completedGoals} of 6 daily targets reached
              </Text>

              <View
                style={[
                  styles.overviewTrack,
                  { backgroundColor: colors.border },
                ]}
              >
                <View
                  style={[
                    styles.overviewFill,
                    {
                      width: `${overallProgress}%`,
                      backgroundColor: colors.primary,
                    },
                  ]}
                />
              </View>
            </View>
          </View>
        </DashboardSection>

        <DashboardSection
          title="Nutrition"
          subtitle="Calories and macronutrients tracked today."
        >
          <View style={styles.grid}>
            <MetricCard
              icon="flame-outline"
              title="Calories"
              current={Math.round(data.calories).toString()}
              goal={Math.round(goals.calories).toString()}
              remaining={`${Math.round(caloriesRemaining)} kcal left`}
              unit="kcal"
              progress={calorieProgress}
            />

            <MetricCard
              icon="fitness-outline"
              title="Protein"
              current={Math.round(data.protein).toString()}
              goal={Math.round(goals.protein).toString()}
              remaining={`${Math.round(proteinRemaining)} g left`}
              unit="g"
              progress={proteinProgress}
            />

            <MetricCard
              icon="nutrition-outline"
              title="Carbs"
              current={Math.round(data.carbs).toString()}
              goal={Math.round(goals.carbs).toString()}
              remaining={`${Math.round(carbsRemaining)} g left`}
              unit="g"
              progress={carbsProgress}
            />

            <MetricCard
              icon="water-outline"
              title="Fat"
              current={Math.round(data.fat).toString()}
              goal={Math.round(goals.fat).toString()}
              remaining={`${Math.round(fatRemaining)} g left`}
              unit="g"
              progress={fatProgress}
            />
          </View>
        </DashboardSection>

        <DashboardSection
          title="Hydration & activity"
          subtitle="Your movement and hydration progress."
        >
          <View style={styles.grid}>
            <MetricCard
              icon="water-outline"
              title="Water"
              current={data.water.toFixed(2)}
              goal={goals.water.toFixed(2)}
              remaining={`${waterRemaining.toFixed(2)} L left`}
              unit="L"
              progress={waterProgress}
            />

            <MetricCard
              icon="walk-outline"
              title="Steps"
              current={Math.round(data.steps).toLocaleString()}
              goal={Math.round(goals.steps).toLocaleString()}
              remaining={`${Math.round(stepsRemaining).toLocaleString()} left`}
              unit="steps"
              progress={stepsProgress}
            />
          </View>
        </DashboardSection>

        <DashboardSection
          title="Today's meals"
          subtitle="Foods recorded in your daily tracker."
        >
          <View
            style={[
              styles.mealSummary,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.mealIcon,
                { backgroundColor: `${colors.primary}18` },
              ]}
            >
              <Ionicons
                name="restaurant-outline"
                size={22}
                color={colors.primary}
              />
            </View>

            <View style={styles.mealSummaryText}>
              <Text
                style={[
                  styles.mealSummaryTitle,
                  { color: colors.text },
                ]}
              >
                {meals.length}{" "}
                {meals.length === 1 ? "meal" : "meals"} recorded
              </Text>

              <Text
                style={[
                  styles.mealSummaryDescription,
                  { color: colors.subtext },
                ]}
              >
                {Math.round(data.calories)} kcal recorded today
              </Text>
            </View>
          </View>

          {meals.length > 0 ? (
            <View
              style={[
                styles.mealList,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              {meals.map((meal, index) => (
                <View
                  key={meal.id}
                  style={[
                    styles.mealRow,
                    index < meals.length - 1 && {
                      borderBottomWidth: 1,
                      borderBottomColor: colors.border,
                    },
                  ]}
                >
                  <View style={styles.mealInfo}>
                    <Text
                      style={[
                        styles.mealName,
                        { color: colors.text },
                      ]}
                      numberOfLines={1}
                    >
                      {meal.food.nameEnglish}
                    </Text>

                    <Text
                      style={[
                        styles.mealType,
                        { color: colors.subtext },
                      ]}
                    >
                      {meal.mealType}
                    </Text>
                  </View>

                  <Text
                    style={[
                      styles.mealCalories,
                      { color: colors.primary },
                    ]}
                  >
                    {Math.round(meal.calories)} kcal
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <View
              style={[
                styles.emptyMeals,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <Ionicons
                name="restaurant-outline"
                size={24}
                color={colors.subtext}
              />

              <Text
                style={[
                  styles.emptyMealsTitle,
                  { color: colors.text },
                ]}
              >
                No meals recorded yet
              </Text>

              <Text
                style={[
                  styles.emptyMealsText,
                  { color: colors.subtext },
                ]}
              >
                Add your first meal to start building today's report.
              </Text>
            </View>
          )}
        </DashboardSection>

        <DashboardSection
          title="Daily status"
          subtitle="A quick interpretation of your current progress."
        >
          <View
            style={[
              styles.statusCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.statusIcon,
                { backgroundColor: `${colors.primary}18` },
              ]}
            >
              <Ionicons
                name={status.icon}
                size={24}
                color={colors.primary}
              />
            </View>

            <View style={styles.statusInfo}>
              <Text
                style={[
                  styles.statusTitle,
                  { color: colors.text },
                ]}
              >
                {status.title}
              </Text>

              <Text
                style={[
                  styles.statusDescription,
                  { color: colors.subtext },
                ]}
              >
                {status.text}
              </Text>
            </View>
          </View>
        </DashboardSection>
      </ScrollView>
    </DashboardPage>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 30,
  },

  overviewCard: {
    minHeight: 150,
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },

  progressCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 7,
    alignItems: "center",
    justifyContent: "center",
  },

  progressPercentage: {
    fontSize: 22,
    fontWeight: "900",
  },

  progressComplete: {
    fontSize: 9,
    fontWeight: "700",
    marginTop: 2,
    textTransform: "uppercase",
  },

  overviewInfo: {
    flex: 1,
    marginLeft: 20,
  },

  overviewTitle: {
    fontSize: 16,
    fontWeight: "900",
  },

  overviewDescription: {
    fontSize: 11,
    marginTop: 6,
  },

  overviewTrack: {
    height: 8,
    borderRadius: 8,
    overflow: "hidden",
    marginTop: 15,
  },

  overviewFill: {
    height: "100%",
    borderRadius: 8,
  },

  grid: {
    gap: 12,
  },

  metricCard: {
    minHeight: 135,
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
  },

  metricTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  metricIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  metricTextContainer: {
    flex: 1,
    marginLeft: 12,
  },

  metricTitle: {
    fontSize: 13,
    fontWeight: "900",
  },

  metricRemaining: {
    fontSize: 10,
    marginTop: 3,
  },

  metricValues: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 15,
  },

  metricCurrent: {
    fontSize: 20,
    fontWeight: "900",
  },

  metricUnit: {
    fontSize: 10,
    fontWeight: "700",
  },

  metricGoal: {
    fontSize: 10,
    marginLeft: 5,
  },
progressTrack: {
    height: 7,
    borderRadius: 7,
    overflow: "hidden",
    marginTop: 12,
  },

  progressFill: {
    height: "100%",
    borderRadius: 7,
  },

  mealSummary: {
    minHeight: 80,
    borderRadius: 18,
    borderWidth: 1,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  mealIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  mealSummaryText: {
    flex: 1,
    marginLeft: 13,
  },

  mealSummaryTitle: {
    fontSize: 14,
    fontWeight: "900",
  },

  mealSummaryDescription: {
    fontSize: 10,
    marginTop: 4,
  },

  mealList: {
    marginTop: 10,
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
  },

  mealRow: {
    minHeight: 60,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  mealInfo: {
    flex: 1,
    marginRight: 12,
  },

  mealName: {
    fontSize: 12,
    fontWeight: "800",
  },

  mealType: {
    fontSize: 9,
    marginTop: 4,
    textTransform: "capitalize",
  },

  mealCalories: {
    fontSize: 11,
    fontWeight: "900",
  },

  emptyMeals: {
    minHeight: 125,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    marginTop: 10,
  },

  emptyMealsTitle: {
    fontSize: 13,
    fontWeight: "900",
    marginTop: 9,
  },

  emptyMealsText: {
    fontSize: 10,
    textAlign: "center",
    marginTop: 5,
    lineHeight: 15,
  },

  statusCard: {
    minHeight: 100,
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  statusIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  statusInfo: {
    flex: 1,
    marginLeft: 14,
  },

  statusTitle: {
    fontSize: 14,
    fontWeight: "900",
  },

  statusDescription: {
    fontSize: 10,
    lineHeight: 15,
    marginTop: 5,
  },
});