import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getUserProfile } from "../../storage/profileStorage";
import { UserProfile } from "../../types/userProfile";
import {
  createDailyPlan,
  DailyPlan,
  PlannedMeal,
} from "../../logic/mealPlanner";
import { useTheme } from "../../context/ThemeContext";

const mealIcons: Record<
  PlannedMeal["meal"],
  keyof typeof Ionicons.glyphMap
> = {
  breakfast: "sunny-outline",
  lunch: "restaurant-outline",
  dinner: "moon-outline",
  snack: "nutrition-outline",
};

const mealColors: Record<
  PlannedMeal["meal"],
  string
> = {
  breakfast: "#F59E0B",
  lunch: "#22C55E",
  dinner: "#8B5CF6",
  snack: "#38BDF8",
};

export default function PlanScreen() {
  const { width } = useWindowDimensions();
  const { colors, isDark } = useTheme();

  const [profile, setProfile] =
    useState<UserProfile | null>(null);
  const [plan, setPlan] = useState<DailyPlan | null>(null);
  const [loading, setLoading] = useState(true);

  const contentWidth = Math.min(
    width > 767 ? 1120 : 620,
    width - 36
  );

  useEffect(() => {
    let mounted = true;

    const loadPlan = async () => {
      try {
        const savedProfile = await getUserProfile();

        if (!mounted) {
          return;
        }

        if (!savedProfile) {
          router.replace("/onboarding/personal-info");
          return;
        }

        setProfile(savedProfile);
        setPlan(createDailyPlan(savedProfile));
      } catch (error) {
        console.error("Failed to create daily plan:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadPlan();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading || !profile || !plan) {
    return (
      <View
        style={[
          styles.loadingScreen,
          { backgroundColor: colors.background },
        ]}
      >
        <View
          style={[
            styles.loadingIcon,
            {
              backgroundColor: isDark
                ? "#22271A"
                : "#F1F7D9",
            },
          ]}
        >
          <Ionicons
            name="nutrition-outline"
            size={30}
            color={colors.primary}
          />
        </View>

        <ActivityIndicator
          size="small"
          color={colors.primary}
          style={styles.loadingIndicator}
        />

        <Text
          style={[
            styles.loadingTitle,
            { color: colors.text },
          ]}
        >
          Building your plan
        </Text>

        <Text
          style={[
            styles.loadingText,
            { color: colors.subtext },
          ]}
        >
          Creating recommendations from your profile.
        </Text>
      </View>
    );
  }

  const goalText =
    profile.goal === "lose"
      ? "weight loss"
      : profile.goal === "gain"
      ? "weight gain"
      : "maintenance";

  const totalDifference =
    plan.targetCalories - plan.totalCalories;

  return (
    <View
      style={[
        styles.screen,
        { backgroundColor: colors.background },
      ]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View
          style={[
            styles.content,
            { width: contentWidth },
          ]}
        >
          <View style={styles.header}>
            <View style={styles.headerText}>
              <View style={styles.eyebrowRow}>
                <View
                  style={[
                    styles.eyebrowIcon,
{
                      backgroundColor: isDark
                        ? "#22271A"
                        : "#F1F7D9",
                    },
                  ]}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={15}
                    color={colors.primary}
                  />
                </View>

                <Text
                  style={[
                    styles.eyebrow,
                    { color: colors.subtext },
                  ]}
                >
                  TODAY'S PLAN
                </Text>
              </View>

              <Text
                style={[
                  styles.title,
                  { color: colors.text },
                ]}
              >
                Eat with intention.
              </Text>

              <Text
                style={[
                  styles.subtitle,
                  { color: colors.subtext },
                ]}
              >
                Personalized for your {goalText} goal.
              </Text>
            </View>

            <View
              style={[
                styles.todayBadge,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <Ionicons
                name="calendar"
                size={17}
                color={colors.primary}
              />

              <Text
                style={[
                  styles.todayText,
                  { color: colors.text },
                ]}
              >
                Today
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.targetCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.targetMain}>
              <View
                style={[
                  styles.targetIcon,
                  {
                    backgroundColor: isDark
                      ? "#252315"
                      : "#FFF7D9",
                  },
                ]}
              >
                <Ionicons
                  name="flame-outline"
                  size={23}
                  color={colors.secondary}
                />
              </View>

              <View style={styles.targetInfo}>
                <Text
                  style={[
                    styles.cardEyebrow,
                    { color: colors.subtext },
                  ]}
                >
                  DAILY CALORIE TARGET
                </Text>

                <View style={styles.calorieRow}>
                  <Text
                    style={[
                      styles.calories,
                      { color: colors.text },
                    ]}
                  >
                    {plan.targetCalories}
                  </Text>

                  <Text
                    style={[
                      styles.calorieUnit,
                      { color: colors.subtext },
                    ]}
                  >
                    kcal
                  </Text>
                </View>

                <Text
                  style={[
                    styles.targetDescription,
                    { color: colors.subtext },
                  ]}
                >
                  Calculated from your age, body
                  measurements, activity level and goal.
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.goalPill,
                {
                  backgroundColor: isDark
                    ? "#22271A"
                    : "#F1F7D9",
                },
              ]}
            >
              <View
                style={[
                  styles.goalDot,
                  { backgroundColor: colors.primary },
                ]}
              />
<Text
                style={[
                  styles.goalPillText,
                  { color: colors.text },
                ]}
              >
                {goalText}
              </Text>
            </View>
          </View>

          <View style={styles.macroGrid}>
            <MacroCard
              icon="fitness-outline"
              label="Protein"
              value={`${plan.targetProtein}g`}
              colors={colors}
            />

            <MacroCard
              icon="leaf-outline"
              label="Carbs"
              value={`${plan.targetCarbohydrates}g`}
              colors={colors}
            />

            <MacroCard
              icon="water-outline"
              label="Fat"
              value={`${plan.targetFat}g`}
              colors={colors}
            />

            <MacroCard
              icon="nutrition-outline"
              label="Fiber"
              value={`${plan.targetFiber}g`}
              colors={colors}
            />
          </View>

          <SectionHeader
            title="Recommended meals"
            subtitle="Portions are calculated from your daily nutrition target."
            colors={colors}
          />

          {plan.meals.map((meal) => (
            <MealRecommendationCard
              key={meal.meal}
              meal={meal}
              colors={colors}
              isDark={isDark}
            />
          ))}

          <View
            style={[
              styles.summaryCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.summaryLeft}>
              <Text
                style={[
                  styles.summaryEyebrow,
                  { color: colors.subtext },
                ]}
              >
                PLAN TOTAL
              </Text>

              <View style={styles.summaryCaloriesRow}>
                <Text
                  style={[
                    styles.summaryCalories,
                    { color: colors.text },
                  ]}
                >
                  {plan.totalCalories}
                </Text>

                <Text
                  style={[
                    styles.summaryUnit,
                    { color: colors.subtext },
                  ]}
                >
                  kcal
                </Text>
              </View>
            </View>

            <View style={styles.summaryRight}>
              <Text
                style={[
                  styles.summaryTargetLabel,
                  { color: colors.subtext },
                ]}
              >
                Target
              </Text>

              <Text
                style={[
                  styles.summaryTargetValue,
                  { color: colors.text },
                ]}
              >
                {plan.targetCalories} kcal
              </Text>

              <Text
                style={[
                  styles.summaryDifference,
                  {
                    color:
                      totalDifference >= 0
                        ? colors.success
                        : colors.warning,
                  },
                ]}
              >
                {totalDifference >= 0 ? "+" : ""}
                {totalDifference} kcal
              </Text>
            </View>
          </View>

          <SectionHeader
            title="Workout"
            subtitle="Your activity for today"
            colors={colors}
          />

          <Pressable
            onPress={() =>
              router.push("/dashboard/workouts")
            }
            style={({ pressed }) => [
              styles.workoutCard,
              {
                backgroundColor: colors.card,
borderColor: colors.border,
                opacity: pressed ? 0.78 : 1,
              },
            ]}
          >
            <View
              style={[
                styles.workoutIcon,
                {
                  backgroundColor: isDark
                    ? "#22271A"
                    : "#F1F7D9",
                },
              ]}
            >
              <Ionicons
                name="barbell-outline"
                size={25}
                color={colors.primary}
              />
            </View>

            <View style={styles.workoutInfo}>
              <Text
                style={[
                  styles.workoutTitle,
                  { color: colors.text },
                ]}
              >
                Today's workout
              </Text>

              <Text
                style={[
                  styles.workoutDescription,
                  { color: colors.subtext },
                ]}
              >
                View your personalized workout
                recommendations based on your profile.
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.subtext}
            />
          </Pressable>

          <SectionHeader
            title="Daily checklist"
            subtitle="Simple actions to keep your day on track."
            colors={colors}
          />

          <ChecklistItem
            icon="restaurant-outline"
            title="Complete your recommended meals"
            colors={colors}
          />

          <ChecklistItem
            icon="water-outline"
            title="Reach your water goal"
            colors={colors}
          />

          <ChecklistItem
            icon="walk-outline"
            title="Reach your daily activity target"
            colors={colors}
          />

          <ChecklistItem
            icon="barbell-outline"
            title="Complete your workout"
            colors={colors}
          />

          <ChecklistItem
            icon="checkmark-circle-outline"
            title="Stay within your daily nutrition targets"
            colors={colors}
          />

          <Pressable
            onPress={() => router.replace("/home")}
            style={({ pressed }) => [
              styles.backButton,
              {
                borderColor: colors.border,
                backgroundColor: colors.card,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Ionicons
              name="arrow-back"
              size={18}
              color={colors.text}
            />

            <Text
              style={[
                styles.backText,
                { color: colors.text },
              ]}
            >
              Back to Home
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function MacroCard({
  icon,
  label,
  value,
  colors,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  colors: {
    text: string;
    subtext: string;
    card: string;
    border: string;
    primary: string;
  };
}) {
  return (
    <View
      style={[
        styles.macroCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <Ionicons
        name={icon}
        size={19}
        color={colors.primary}
      />

      <Text
        style={[
          styles.macroValue,
          { color: colors.text },
        ]}
      >
        {value}
      </Text>

      <Text
        style={[
          styles.macroLabel,
          { color: colors.subtext },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

function SectionHeader({
title,
  subtitle,
  colors,
}: {
  title: string;
  subtitle: string;
  colors: {
    text: string;
    subtext: string;
  };
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text
        style={[
          styles.sectionTitle,
          { color: colors.text },
        ]}
      >
        {title}
      </Text>

      <Text
        style={[
          styles.sectionSubtitle,
          { color: colors.subtext },
        ]}
      >
        {subtitle}
      </Text>
    </View>
  );
}

function MealRecommendationCard({
  meal,
  colors,
  isDark,
}: {
  meal: PlannedMeal;
  colors: {
    text: string;
    subtext: string;
    card: string;
    border: string;
    primary: string;
  };
  isDark: boolean;
}) {
  const accent = mealColors[meal.meal];

  return (
    <View
      style={[
        styles.mealCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.mealHeader}>
        <View
          style={[
            styles.mealIcon,
            {
              backgroundColor: isDark
                ? `${accent}18`
                : `${accent}14`,
            },
          ]}
        >
          <Ionicons
            name={mealIcons[meal.meal]}
            size={23}
            color={accent}
          />
        </View>

        <View style={styles.mealInfo}>
          <Text
            style={[
              styles.mealTitle,
              { color: colors.text },
            ]}
          >
            {meal.title}
          </Text>

          <Text
            style={[
              styles.mealCalories,
              { color: colors.subtext },
            ]}
          >
            {meal.calories} kcal
          </Text>
        </View>

        <View
          style={[
            styles.mealTarget,
            {
              backgroundColor: isDark
                ? "#202228"
                : "#F3F4F6",
            },
          ]}
        >
          <Text
            style={[
              styles.mealTargetLabel,
              { color: colors.subtext },
            ]}
          >
            TARGET
          </Text>

          <Text
            style={[
              styles.mealTargetValue,
              { color: colors.text },
            ]}
          >
            {meal.targetCalories} kcal
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.foodList,
          { borderTopColor: colors.border },
        ]}
      >
        {meal.portions.map((portion) => (
          <View
            key={portion.food.id}
            style={styles.foodItem}
          >
            <View
              style={[
                styles.foodDot,
                { backgroundColor: colors.primary },
              ]}
            />

            <View style={styles.foodInfo}>
              <Text
                style={[
                  styles.foodName,
                  { color: colors.text },
                ]}
              >
                {portion.food.nameEnglish}
              </Text>

              <Text
                style={[
                  styles.foodDetails,
                  { color: colors.subtext },
                ]}
              >
                {portion.grams} g ·{" "}
                {portion.nutrition.calories} kcal ·{" "}
                {portion.nutrition.protein}g protein
              </Text>
            </View>
          </View>
        ))}

        {meal.portions.length === 0 && (
          <View style={styles.noFoodRow}>
            <Ionicons
              name="information-circle-outline"
              size={17}
              color={colors.subtext}
            />

            <Text
              style={[
                styles.noFoodText,
                { color: colors.subtext },
              ]}
            >
              No suitable foods found for this meal.
            </Text>
          </View>
        )}
      </View>
<View
        style={[
          styles.mealMacros,
          { borderTopColor: colors.border },
        ]}
      >
        <MacroValue
          label="Protein"
          value={`${meal.protein}g`}
          colors={colors}
        />

        <MacroValue
          label="Carbs"
          value={`${meal.carbohydrates}g`}
          colors={colors}
        />

        <MacroValue
          label="Fat"
          value={`${meal.fat}g`}
          colors={colors}
        />

        <MacroValue
          label="Fiber"
          value={`${meal.fiber}g`}
          colors={colors}
        />
      </View>
    </View>
  );
}

function MacroValue({
  label,
  value,
  colors,
}: {
  label: string;
  value: string;
  colors: {
    text: string;
    subtext: string;
  };
}) {
  return (
    <View style={styles.mealMacro}>
      <Text
        style={[
          styles.mealMacroValue,
          { color: colors.text },
        ]}
      >
        {value}
      </Text>

      <Text
        style={[
          styles.mealMacroLabel,
          { color: colors.subtext },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

function ChecklistItem({
  icon,
  title,
  colors,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  colors: {
    text: string;
    subtext: string;
    card: string;
    border: string;
    primary: string;
  };
}) {
  return (
    <View
      style={[
        styles.checkItem,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <View
        style={[
          styles.checkIcon,
          {
            backgroundColor: "rgba(215,245,44,0.10)",
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={19}
          color={colors.primary}
        />
      </View>

      <Text
        style={[
          styles.checkText,
          { color: colors.text },
        ]}
      >
        {title}
      </Text>

      <View
        style={[
          styles.emptyCircle,
          { borderColor: colors.border },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    minWidth: 0,
  },

  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 28,
    paddingBottom: 48,
  },

  content: {
    alignSelf: "center",
  },

  loadingScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  loadingIcon: {
    width: 62,
    height: 62,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingIndicator: {
    marginTop: 16,
  },

  loadingTitle: {
    fontSize: 19,
    fontWeight: "900",
    marginTop: 12,
  },

  loadingText: {
    fontSize: 12,
    marginTop: 6,
    textAlign: "center",
  },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 22,
  },

  headerText: {
    flex: 1,
    paddingRight: 15,
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
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  eyebrow: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.5,
  },

  title: {
    fontSize: 29,
    lineHeight: 35,
    fontWeight: "900",
    letterSpacing: -0.7,
  },

  subtitle: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
  },

  todayBadge: {
    minHeight: 42,
    borderRadius: 13,
    borderWidth: 1,
    paddingHorizontal: 11,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },

  todayText: {
    fontSize: 11,
    fontWeight: "800",
    marginLeft: 6,
  },

  targetCard: {
    borderRadius: 23,
    borderWidth: 1,
    padding: 18,
    marginBottom: 12,
  },

  targetMain: {
    flexDirection: "row",
    alignItems: "center",
  },

  targetIcon: {
    width: 52,
    height: 52,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },
targetInfo: {
    flex: 1,
  },

  cardEyebrow: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.3,
  },

  calorieRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 2,
  },

  calories: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "900",
    letterSpacing: -1,
  },

  calorieUnit: {
    fontSize: 12,
    fontWeight: "800",
    marginLeft: 6,
    marginBottom: 5,
  },

  targetDescription: {
    fontSize: 10,
    lineHeight: 15,
    marginTop: 3,
  },

  goalPill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 15,
  },

  goalDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },

  goalPillText: {
    fontSize: 10,
    fontWeight: "800",
  },

  macroGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 27,
  },

  macroCard: {
    width: "24%",
    minWidth: 120,
    minHeight: 96,
    borderWidth: 1,
    borderRadius: 17,
    padding: 13,
    marginRight: 7,
    marginBottom: 7,
  },

  macroValue: {
    fontSize: 17,
    fontWeight: "900",
    marginTop: 10,
  },

  macroLabel: {
    fontSize: 9,
    fontWeight: "700",
    marginTop: 2,
  },

  sectionHeader: {
    marginBottom: 11,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "900",
    letterSpacing: -0.3,
  },

  sectionSubtitle: {
    fontSize: 10,
    lineHeight: 16,
    marginTop: 3,
  },

  mealCard: {
    borderRadius: 21,
    borderWidth: 1,
    marginBottom: 11,
    overflow: "hidden",
  },

  mealHeader: {
    minHeight: 84,
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },

  mealIcon: {
    width: 47,
    height: 47,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  mealInfo: {
    flex: 1,
  },

  mealTitle: {
    fontSize: 15,
    fontWeight: "900",
  },

  mealCalories: {
    fontSize: 10,
    fontWeight: "700",
    marginTop: 3,
  },

  mealTarget: {
    minWidth: 72,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 7,
    alignItems: "flex-end",
  },

  mealTargetLabel: {
    fontSize: 7,
    fontWeight: "900",
    letterSpacing: 0.8,
  },

  mealTargetValue: {
    fontSize: 10,
    fontWeight: "900",
    marginTop: 2,
  },

  foodList: {
    borderTopWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },

  foodItem: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 43,
  },

  foodDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 10,
  },

  foodInfo: {
    flex: 1,
  },

  foodName: {
    fontSize: 11,
    fontWeight: "800",
  },

  foodDetails: {
    fontSize: 9,
    marginTop: 2,
  },

  noFoodRow: {
    minHeight: 40,
    flexDirection: "row",
    alignItems: "center",
  },

  noFoodText: {
    fontSize: 10,
    marginLeft: 7,
  },

  mealMacros: {
    minHeight: 62,
    borderTopWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },

  mealMacro: {
    alignItems: "center",
    minWidth: 65,
  },

  mealMacroValue: {
    fontSize: 11,
    fontWeight: "900",
  },

  mealMacroLabel: {
    fontSize: 8,
    fontWeight: "700",
    marginTop: 3,
  },

  summaryCard: {
    minHeight: 92,
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
    marginBottom: 28,
  },

  summaryLeft: {
    flex: 1,
  },

  summaryEyebrow: {
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1.2,
  },

  summaryCaloriesRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 3,
  },

  summaryCalories: {
    fontSize: 27,
    fontWeight: "900",
  },

  summaryUnit: {
    fontSize: 10,
    fontWeight: "800",
    marginLeft: 5,
    marginBottom: 4,
  },

  summaryRight: {
    alignItems: "flex-end",
  },

  summaryTargetLabel: {
    fontSize: 8,
    fontWeight: "700",
  },
summaryTargetValue: {
    fontSize: 12,
    fontWeight: "900",
    marginTop: 3,
  },

  summaryDifference: {
    fontSize: 9,
    fontWeight: "900",
    marginTop: 4,
  },

  workoutCard: {
    minHeight: 94,
    borderRadius: 20,
    borderWidth: 1,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },

  workoutIcon: {
    width: 49,
    height: 49,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  workoutInfo: {
    flex: 1,
    paddingRight: 10,
  },

  workoutTitle: {
    fontSize: 14,
    fontWeight: "900",
  },

  workoutDescription: {
    fontSize: 10,
    lineHeight: 15,
    marginTop: 4,
  },

  checkItem: {
    minHeight: 62,
    borderRadius: 17,
    borderWidth: 1,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  checkIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  checkText: {
    flex: 1,
    fontSize: 11,
    fontWeight: "700",
    lineHeight: 16,
  },

  emptyCircle: {
    width: 21,
    height: 21,
    borderRadius: 11,
    borderWidth: 1.5,
    marginLeft: 10,
  },

  backButton: {
    minHeight: 50,
    borderRadius: 15,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },

  backText: {
    fontSize: 12,
    fontWeight: "800",
    marginLeft: 7,
  },
});