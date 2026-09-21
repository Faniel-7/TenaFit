import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAppData } from "../../context/AppDataContext";
import { useTheme } from "../../context/ThemeContext";

type IconName = keyof typeof Ionicons.glyphMap;

export default function ReportsScreen() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const { colors, isDark } = useTheme();

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

  const isMobile = width < 700;

  const safeOverall = Math.max(
    0,
    Math.min(Number(overallProgress) || 0, 100)
  );

  const caloriesRemaining = Math.max(
    goals.calories - data.calories,
    0
  );

  const proteinRemaining = Math.max(
    goals.protein - data.protein,
    0
  );

  const carbsRemaining = Math.max(
    goals.carbs - data.carbs,
    0
  );

  const fatRemaining = Math.max(
    goals.fat - data.fat,
    0
  );

  const waterRemaining = Math.max(
    goals.water - data.water,
    0
  );

  const stepsRemaining = Math.max(
    goals.steps - data.steps,
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

  const getStatus = () => {
    if (safeOverall >= 80) {
      return {
        title: "Strong day so far",
        text:
          "You're staying consistent across your nutrition and activity targets.",
        icon: "checkmark-circle-outline" as IconName,
      };
    }

    if (safeOverall >= 50) {
      return {
        title: "You're making progress",
        text:
          "Keep tracking your meals, hydration, and movement to build a stronger day.",
        icon: "trending-up-outline" as IconName,
      };
    }

    return {
      title: "Build your day",
      text:
        "There is still time to work toward your nutrition and activity targets.",
      icon: "analytics-outline" as IconName,
    };
  };

  const status = getStatus();

  const MetricCard = ({
    icon,
    title,
    current,
    target,
    remaining,
    unit,
    progress,
    accent,
  }: {
    icon: IconName;
    title: string;
    current: string;
    target: string;
    remaining: string;
    unit: string;
    progress: number;
    accent?: string;
  }) => {
    const safeProgress = Math.max(
      0,
      Math.min(Number(progress) || 0, 1)
    );

    const metricAccent = accent || colors.primary;

    return (
      <View style={styles.metricCard}>
        <View style={styles.metricTop}>
          <View
            style={[
              styles.metricIcon,
              {
                backgroundColor:
                  metricAccent + "18",
              },
            ]}
          >
            <Ionicons
              name={icon}
              size={20}
              color={metricAccent}
            />
          </View>

          <View style={styles.metricHeaderText}>
            <Text style={styles.metricTitle}>
              {title}
            </Text>

            <Text style={styles.metricRemaining}>
              {remaining}
            </Text>
          </View>
        </View>

        <View style={styles.metricValues}>
          <Text style={styles.metricCurrent}>
            {current}
            <Text style={styles.metricUnit}>
              {" "}
              {unit}
            </Text>
          </Text>

          <Text style={styles.metricTarget}>
            / {target} {unit}
          </Text>
        </View>
<View style={styles.progressTrack}>
          {safeProgress > 0 && (
            <View
              style={[
                styles.progressFill,
                {
                  width: `${safeProgress * 100}%`,
                  backgroundColor:
                    metricAccent,
                },
              ]}
            />
          )}
        </View>

        <Text style={styles.metricPercent}>
          {Math.round(safeProgress * 100)}%
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            maxWidth: 1120,
            paddingHorizontal: isMobile
              ? 18
              : 28,
          },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.headerText}>
            <View style={styles.eyebrowRow}>
              <View style={styles.eyebrowIcon}>
                <Ionicons
                  name="document-text"
                  size={15}
                  color={colors.primary}
                />
              </View>

              <Text style={styles.eyebrow}>
                DAILY REPORT
              </Text>
            </View>

            <Text style={styles.title}>
              Your day at a glance.
            </Text>

            <Text style={styles.subtitle}>
              See how your nutrition, hydration,
              and movement are coming together.
            </Text>
          </View>

          <View style={styles.headerIcon}>
            <Ionicons
              name="analytics-outline"
              size={27}
              color={colors.primary}
            />
          </View>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.heroEyebrow}>
                OVERALL PROGRESS
              </Text>

              <Text style={styles.heroTitle}>
                {status.title}
              </Text>
            </View>

            <View
              style={[
                styles.heroPercentage,
                {
                  backgroundColor:
                    colors.primary + "18",
                },
              ]}
            >
              <Text
                style={[
                  styles.heroPercentageText,
                  { color: colors.primary },
                ]}
              >
                {safeOverall}%
              </Text>
            </View>
          </View>

          <View style={styles.heroProgressTrack}>
            {safeOverall > 0 && (
              <View
                style={[
                  styles.heroProgressFill,
                  {
                    width: `${safeOverall}%`,
                    backgroundColor:
                      colors.primary,
                  },
                ]}
              />
            )}
          </View>

          <View style={styles.heroBottom}>
            <View style={styles.heroBottomItem}>
              <Ionicons
                name="checkmark-circle-outline"
                size={17}
                color={colors.success}
              />

              <Text style={styles.heroBottomText}>
                {completedGoals} of 6 targets reached
              </Text>
            </View>

            <Text style={styles.heroDescription}>
              {status.text}
            </Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Nutrition
            </Text>

            <Text style={styles.sectionSubtitle}>
              Your calories and macronutrients today.
            </Text>
          </View>

          <View style={styles.sectionIcon}>
            <Ionicons
              name="nutrition-outline"
              size={18}
              color={colors.primary}
            />
          </View>
        </View>
<View
          style={[
            styles.metricGrid,
            isMobile &&
              styles.metricGridMobile,
          ]}
        >
          <MetricCard
            icon="flame-outline"
            title="Calories"
            current={Math.round(
              data.calories
            ).toLocaleString()}
            target={Math.round(
              goals.calories
            ).toLocaleString()}
            remaining={ `${Math.round(
              caloriesRemaining
            )} kcal left` }
            unit="kcal"
            progress={calorieProgress}
            accent="#FF8A3D"
          />

          <MetricCard
            icon="fitness-outline"
            title="Protein"
            current={Math.round(
              data.protein
            ).toString()}
            target={Math.round(
              goals.protein
            ).toString()}
            remaining={ `${Math.round(
              proteinRemaining
            )} g left` }
            unit="g"
            progress={proteinProgress}
            accent="#8B7CFF"
          />

          <MetricCard
            icon="nutrition-outline"
            title="Carbs"
            current={Math.round(
              data.carbs
            ).toString()}
            target={Math.round(
              goals.carbs
            ).toString()}
            remaining={ `${Math.round(
              carbsRemaining
            )} g left` }
            unit="g"
            progress={carbsProgress}
            accent="#F4C430"
          />

          <MetricCard
            icon="water-outline"
            title="Fat"
            current={Math.round(
              data.fat
            ).toString()}
            target={Math.round(
              goals.fat
            ).toString()}
            remaining={ `${Math.round(
              fatRemaining
            )} g left` }
            unit="g"
            progress={fatProgress}
            accent="#4DB8FF"
          />
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Activity & hydration
            </Text>

            <Text style={styles.sectionSubtitle}>
              Your movement and water intake today.
            </Text>
          </View>

          <View style={styles.sectionIcon}>
            <Ionicons
              name="walk-outline"
              size={18}
              color={colors.primary}
            />
          </View>
        </View>

        <View
          style={[
            styles.metricGrid,
            isMobile &&
              styles.metricGridMobile,
          ]}
        >
          <MetricCard
            icon="water"
            title="Water"
            current={data.water.toFixed(2)}
            target={goals.water.toFixed(2)}
            remaining={ `${waterRemaining.toFixed(
              2
            )} L left` }
            unit="L"
            progress={waterProgress}
            accent="#4DB8FF"
          />

          <MetricCard
            icon="footsteps-outline"
            title="Steps"
            current={Math.round(
              data.steps
            ).toLocaleString()}
            target={Math.round(
              goals.steps
            ).toLocaleString()}
            remaining={ `${Math.round(
              stepsRemaining
            ).toLocaleString()} left` }
            unit="steps"
            progress={stepsProgress}
            accent={colors.primary}
          />
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Meals
            </Text>

            <Text style={styles.sectionSubtitle}>
              Everything you've logged today.
            </Text>
          </View>

          <Pressable
            onPress={() =>
router.push("/dashboard/meals")
            }
            style={styles.sectionAction}
          >
            <Text
              style={[
                styles.sectionActionText,
                { color: colors.primary },
              ]}
            >
              View meals
            </Text>

            <Ionicons
              name="chevron-forward"
              size={15}
              color={colors.primary}
            />
          </Pressable>
        </View>

        <View style={styles.mealSummaryCard}>
          <View
            style={[
              styles.mealSummaryIcon,
              {
                backgroundColor:
                  colors.primary + "18",
              },
            ]}
          >
            <Ionicons
              name="restaurant-outline"
              size={23}
              color={colors.primary}
            />
          </View>

          <View style={styles.mealSummaryText}>
            <Text style={styles.mealSummaryTitle}>
              {meals.length}{" "}
              {meals.length === 1
                ? "meal"
                : "meals"}{" "}
              recorded
            </Text>

            <Text
              style={styles.mealSummaryDescription}
            >
              {Math.round(data.calories)} kcal
              recorded today
            </Text>
          </View>

          <View style={styles.mealSummaryBadge}>
            <Ionicons
              name={
                meals.length > 0
                  ? "checkmark"
                  : "add"
              }
              size={16}
              color={
                meals.length > 0
                  ? colors.success
                  : colors.subtext
              }
            />
          </View>
        </View>

        {meals.length > 0 ? (
          <View style={styles.mealsList}>
            {meals.slice(0, 5).map((meal) => (
              <View
                key={meal.id}
                style={styles.mealRow}
              >
                <View
                  style={[
                    styles.mealRowIcon,
                    {
                      backgroundColor:
                        colors.background,
                    },
                  ]}
                >
                  <Ionicons
                    name="restaurant-outline"
                    size={17}
                    color={colors.primary}
                  />
                </View>

                <View style={styles.mealRowText}>
                  <Text
                    style={styles.mealRowTitle}
                    numberOfLines={1}
                  >
                    {meal.food.name}
                  </Text>

                  <Text
                    style={
                      styles.mealRowDescription
                    }
                  >
                    {meal.mealType} ·{" "}
                    {Math.round(
                      meal.calories
                    )}{" "}
                    kcal
                  </Text>
                </View>

                <Text
                  style={styles.mealRowCalories}
                >
                  {Math.round(
                    meal.calories
                  )} kcal
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyMeals}>
            <View
              style={[
                styles.emptyMealsIcon,
                {
                  backgroundColor:
                    colors.background,
                },
              ]}
            >
              <Ionicons
                name="restaurant-outline"
                size={25}
                color={colors.subtext}
              />
            </View>

            <Text style={styles.emptyMealsTitle}>
              No meals recorded yet
            </Text>

            <Text
              style={styles.emptyMealsText}
            >
              Add your first meal to start
              building today's report.
            </Text>
<Pressable
              onPress={() =>
                router.push("/dashboard/meals")
              }
              style={[
                styles.emptyMealsButton,
                {
                  backgroundColor:
                    colors.primary,
                },
              ]}
            >
              <Ionicons
                name="add"
                size={17}
                color="#111111"
              />

              <Text
                style={styles.emptyMealsButtonText}
              >
                Add meal
              </Text>
            </Pressable>
          </View>
        )}

        <View style={styles.insightCard}>
          <View style={styles.insightIcon}>
            <Ionicons
              name={status.icon}
              size={23}
              color={colors.primary}
            />
          </View>

          <View style={styles.insightContent}>
            <Text style={styles.insightEyebrow}>
              TODAY'S INSIGHT
            </Text>

            <Text style={styles.insightTitle}>
              {status.title}
            </Text>

            <Text style={styles.insightText}>
              {status.text}
            </Text>
          </View>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "transparent",
  },

  scrollContent: {
    width: "100%",
    alignSelf: "center",
    paddingTop:
      Platform.OS === "web" ? 28 : 20,
    paddingBottom: 50,
  },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  headerText: {
    flex: 1,
    paddingRight: 18,
  },

  eyebrowRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 9,
  },

  eyebrowIcon: {
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: "#D7F52C18",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  eyebrow: {
    color: "#D7F52C",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.2,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 31,
    fontWeight: "900",
    letterSpacing: -0.8,
  },

  subtitle: {
    color: "#A1A1AA",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 6,
    maxWidth: 620,
  },

  headerIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: "#15161A",
    borderWidth: 1,
    borderColor: "#2A2B31",
    alignItems: "center",
    justifyContent: "center",
  },

  heroCard: {
    backgroundColor: "#15161A",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#2A2B31",
    padding: 22,
    marginBottom: 29,
  },

  heroTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  heroEyebrow: {
    color: "#A1A1AA",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.2,
  },

  heroTitle: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "900",
    marginTop: 5,
  },

  heroPercentage: {
    minWidth: 65,
    height: 48,
    paddingHorizontal: 12,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  heroPercentageText: {
    fontSize: 16,
    fontWeight: "900",
  },

  heroProgressTrack: {
    height: 9,
    borderRadius: 10,
    backgroundColor: "#2A2B31",
    overflow: "hidden",
    marginTop: 20,
  },

  heroProgressFill: {
    height: "100%",
    borderRadius: 10,
  },

  heroBottom: {
    marginTop: 17,
  },

  heroBottomItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  heroBottomText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
    marginLeft: 7,
  },

  heroDescription: {
    color: "#A1A1AA",
    fontSize: 11,
    lineHeight: 17,
    marginTop: 6,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 13,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: -0.3,
  },
sectionSubtitle: {
    color: "#A1A1AA",
    fontSize: 11,
    marginTop: 3,
  },

  sectionIcon: {
    width: 35,
    height: 35,
    borderRadius: 11,
    backgroundColor: "#15161A",
    borderWidth: 1,
    borderColor: "#2A2B31",
    alignItems: "center",
    justifyContent: "center",
  },

  sectionAction: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 7,
    paddingLeft: 8,
  },

  sectionActionText: {
    fontSize: 10,
    fontWeight: "900",
    marginRight: 2,
  },

  metricGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 17,
  },

  metricGridMobile: {
    flexDirection: "row",
  },

  metricCard: {
    width: "48.5%",
    minHeight: 157,
    backgroundColor: "#15161A",
    borderWidth: 1,
    borderColor: "#2A2B31",
    borderRadius: 18,
    padding: 15,
    marginRight: 10,
    marginBottom: 10,
  },

  metricTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  metricIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  metricHeaderText: {
    flex: 1,
    marginLeft: 10,
  },

  metricTitle: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
  },

  metricRemaining: {
    color: "#A1A1AA",
    fontSize: 9,
    marginTop: 3,
  },

  metricValues: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 15,
  },

  metricCurrent: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
  },

  metricUnit: {
    color: "#A1A1AA",
    fontSize: 9,
    fontWeight: "700",
  },

  metricTarget: {
    color: "#A1A1AA",
    fontSize: 9,
    marginBottom: 3,
    marginLeft: 4,
  },

  progressTrack: {
    height: 6,
    borderRadius: 8,
    backgroundColor: "#2A2B31",
    overflow: "hidden",
    marginTop: 13,
  },

  progressFill: {
    height: "100%",
    borderRadius: 8,
  },

  metricPercent: {
    color: "#A1A1AA",
    fontSize: 9,
    fontWeight: "800",
    textAlign: "right",
    marginTop: 6,
  },

  mealSummaryCard: {
    backgroundColor: "#15161A",
    borderWidth: 1,
    borderColor: "#2A2B31",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 9,
  },

  mealSummaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  mealSummaryText: {
    flex: 1,
    marginLeft: 12,
  },

  mealSummaryTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },

  mealSummaryDescription: {
    color: "#A1A1AA",
    fontSize: 10,
    marginTop: 4,
  },

  mealSummaryBadge: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: "#0B0B0D",
    alignItems: "center",
    justifyContent: "center",
  },

  mealsList: {
    backgroundColor: "#15161A",
    borderWidth: 1,
    borderColor: "#2A2B31",
    borderRadius: 18,
    paddingHorizontal: 15,
  },

  mealRow: {
    minHeight: 65,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#2A2B31",
  },

  mealRowIcon: {
    width: 37,
    height: 37,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },

  mealRowText: {
    flex: 1,
    marginLeft: 10,
  },

  mealRowTitle: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
  },

  mealRowDescription: {
    color: "#A1A1AA",
    fontSize: 9,
    marginTop: 3,
    textTransform: "capitalize",
  },

  mealRowCalories: {
    color: "#A1A1AA",
    fontSize: 9,
    fontWeight: "800",
    marginLeft: 8,
  },

  emptyMeals: {
    backgroundColor: "#15161A",
    borderWidth: 1,
    borderColor: "#2A2B31",
    borderRadius: 18,
    padding: 28,
    alignItems: "center",
  },

  emptyMealsIcon: {
    width: 58,
    height: 58,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyMealsTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
    marginTop: 13,
  },
emptyMealsText: {
    color: "#A1A1AA",
    fontSize: 10,
    lineHeight: 16,
    textAlign: "center",
    maxWidth: 330,
    marginTop: 5,
  },

  emptyMealsButton: {
    minHeight: 42,
    paddingHorizontal: 18,
    borderRadius: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },

  emptyMealsButtonText: {
    color: "#111111",
    fontSize: 11,
    fontWeight: "900",
    marginLeft: 5,
  },

  insightCard: {
    backgroundColor: "#15161A",
    borderWidth: 1,
    borderColor: "#2A2B31",
    borderRadius: 18,
    padding: 17,
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 29,
  },

  insightIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: "#D7F52C18",
    alignItems: "center",
    justifyContent: "center",
  },

  insightContent: {
    flex: 1,
    marginLeft: 12,
  },

  insightEyebrow: {
    color: "#D7F52C",
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1,
  },

  insightTitle: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
    marginTop: 3,
  },

  insightText: {
    color: "#A1A1AA",
    fontSize: 10,
    lineHeight: 16,
    marginTop: 4,
  },

  bottomSpace: {
    height: 30,
  },
});