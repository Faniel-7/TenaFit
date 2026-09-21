import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Platform,
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
import { useAppData } from "../../context/AppDataContext";
import { useTheme } from "../../context/ThemeContext";

type IconName = keyof typeof Ionicons.glyphMap;

const mealIcons: Record<PlannedMeal["meal"], IconName> = {
  breakfast: "sunny-outline",
  lunch: "restaurant-outline",
  dinner: "moon-outline",
  snack: "nutrition-outline",
};

const mealColors: Record<
  PlannedMeal["meal"],
  {
    icon: string;
    background: string;
  }
> = {
  breakfast: {
    icon: "#FFD54A",
    background: "#2A2412",
  },
  lunch: {
    icon: "#D7F52C",
    background: "#20280E",
  },
  dinner: {
    icon: "#9FA8DA",
    background: "#171A2B",
  },
  snack: {
    icon: "#67E8F9",
    background: "#10242A",
  },
};

export default function PlanScreen() {
  const { colors, isDark } = useTheme();
  const { width } = useWindowDimensions();
  const { data, goals, meals } = useAppData();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [plan, setPlan] = useState<DailyPlan | null>(null);
  const [loading, setLoading] = useState(true);

  const isCompact = width < 390;
  const isDesktop = width >= 900;

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
      } catch {
        if (mounted) {
          setPlan(null);
        }
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

  const consumedCalories = Math.max(
    0,
    Number(data.calories) || 0
  );

  const targetCalories =
    Number(goals.calories) ||
    Number(plan?.targetCalories) ||
    0;

  const calorieRemaining = Math.max(
    0,
    targetCalories - consumedCalories
  );

  const calorieProgress =
    targetCalories > 0
      ? Math.min(
          consumedCalories / targetCalories,
          1
        )
      : 0;

  const consumedProtein = Math.max(
    0,
    Number(data.protein) || 0
  );

  const targetProtein =
    Number(goals.protein) ||
    Number(plan?.targetProtein) ||
    0;

  const consumedCarbs = Math.max(
    0,
    Number(data.carbs) || 0
  );

  const targetCarbs =
    Number(goals.carbs) ||
    Number(plan?.targetCarbohydrates) ||
    0;

  const consumedFat = Math.max(
    0,
    Number(data.fat) || 0
  );

  const targetFat =
    Number(goals.fat) ||
    Number(plan?.targetFat) ||
    0;

  const loggedMealCount = Array.isArray(meals)
    ? meals.length
    : 0;

  const goalText = useMemo(() => {
    if (!profile) {
      return "personalized nutrition";
    }

    switch (profile.goal) {
      case "lose":
        return "fat loss";
      case "gain":
        return "healthy weight gain";
      case "maintain":
      default:
        return "weight maintenance";
    }
  }, [profile]);

  const profileSummary = useMemo(() => {
    if (!profile) {
      return "";
    }

    const activity = profile.activityLevel
      .charAt(0)
      .toUpperCase() +
      profile.activityLevel.slice(1);

    return `${profile.weightKg} kg · ${profile.heightCm} cm · ${activity} activity`;
  }, [profile]);
if (loading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        <View
          style={[
            styles.loadingIcon,
            {
              backgroundColor: isDark
                ? "#20280E"
                : "#F1F8D2",
            },
          ]}
        >
          <Ionicons
            name="restaurant-outline"
            size={30}
            color={colors.primary}
          />
        </View>

        <ActivityIndicator
          size="small"
          color={colors.primary}
          style={styles.loadingSpinner}
        />

        <Text
          style={[
            styles.loadingTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Building your plan
        </Text>

        <Text
          style={[
            styles.loadingText,
            {
              color: colors.subtext,
            },
          ]}
        >
          Creating recommendations from your
          profile and nutrition targets.
        </Text>
      </View>
    );
  }

  if (!profile || !plan) {
    return (
      <View
        style={[
          styles.loadingContainer,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        <View
          style={[
            styles.loadingIcon,
            {
              backgroundColor: isDark
                ? "#20280E"
                : "#F1F8D2",
            },
          ]}
        >
          <Ionicons
            name="alert-circle-outline"
            size={30}
            color={colors.warning}
          />
        </View>

        <Text
          style={[
            styles.loadingTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Your plan is unavailable
        </Text>

        <Text
          style={[
            styles.loadingText,
            {
              color: colors.subtext,
            },
          ]}
        >
          Complete your profile to generate your
          personalized nutrition plan.
        </Text>

        <Pressable
          style={[
            styles.primaryButton,
            {
              backgroundColor: colors.primary,
            },
          ]}
          onPress={() =>
            router.push("/onboarding/personal-info")
          }
        >
          <Text
            style={[
              styles.primaryButtonText,
              {
                color: "#111111",
              },
            ]}
          >
            Complete Profile
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            maxWidth: isDesktop ? 1120 : 620,
            paddingHorizontal: isCompact ? 16 : 20,
          },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.headerText}>
            <View style={styles.eyebrowRow}>
              <View
                style={[
                  styles.eyebrowDot,
                  {
                    backgroundColor: colors.primary,
                  },
                ]}
              />

              <Text
                style={[
                  styles.eyebrow,
                  {
                    color: colors.primary,
                  },
                ]}
              >
                TODAY'S PLAN
              </Text>
            </View>

            <Text
              style={[
                styles.title,
                {
                  color: colors.text,
                  fontSize: isCompact ? 28 : 32,
                },
              ]}
            >
              Your Nutrition Plan
            </Text>
<Text
              style={[
                styles.subtitle,
                {
                  color: colors.subtext,
                },
              ]}
            >
              Built around your {goalText} goal.
            </Text>

            <Text
              style={[
                styles.profileSummary,
                {
                  color: colors.subtext,
                },
              ]}
            >
              {profileSummary}
            </Text>
          </View>

          <View
            style={[
              styles.dateBadge,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons
              name="calendar-outline"
              size={17}
              color={colors.primary}
            />

            <Text
              style={[
                styles.dateText,
                {
                  color: colors.text,
                },
              ]}
            >
              Today
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.heroCard,
            {
              backgroundColor: isDark
                ? "#15181C"
                : colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.heroTop}>
            <View style={styles.heroIconWrapper}>
              <Ionicons
                name="flame"
                size={24}
                color="#111111"
              />
            </View>

            <View style={styles.heroTitleBlock}>
              <Text
                style={[
                  styles.heroEyebrow,
                  {
                    color: colors.subtext,
                  },
                ]}
              >
                DAILY CALORIE TARGET
              </Text>

              <Text
                style={[
                  styles.heroCalories,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {Math.round(targetCalories)}
                <Text
                  style={[
                    styles.heroCaloriesUnit,
                    {
                      color: colors.subtext,
                    },
                  ]}
                >
                  {" "}
                  kcal
                </Text>
              </Text>
            </View>

            <View
              style={[
                styles.targetStatus,
                {
                  backgroundColor:
                    calorieProgress >= 1
                      ? isDark
                        ? "#2A1717"
                        : "#FEECEC"
                      : isDark
                        ? "#20280E"
                        : "#F1F8D2",
                },
              ]}
            >
              <Ionicons
                name={
                  calorieProgress >= 1
                    ? "checkmark-circle"
                    : "flash"
                }
                size={15}
                color={
                  calorieProgress >= 1
                    ? colors.danger
                    : colors.primary
                }
              />

              <Text
                style={[
                  styles.targetStatusText,
                  {
                    color:
                      calorieProgress >= 1
                        ? colors.danger
                        : colors.primary,
                  },
                ]}
              >
                {calorieProgress >= 1
                  ? "Target reached"
                  : "On track"}
              </Text>
            </View>
          </View>

          <View style={styles.calorieProgressRow}>
            <View
              style={[
                styles.progressTrack,
                {
                  backgroundColor: isDark
                    ? "#292D34"
                    : "#E5E7EB",
                },
              ]}
            >
              {calorieProgress > 0 && (
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${Math.min(
                        calorieProgress * 100,
                        100
                      )}%`,
                      backgroundColor: colors.primary,
                    },
                  ]}
                />
              )}
            </View>

            <Text
              style={[
                styles.progressPercent,
                {
                  color: colors.text,
                },
              ]}
            >
              {Math.round(calorieProgress * 100)}%
            </Text>
          </View>

          <View style={styles.heroBottom}>
            <View>
              <Text
                style={[
                  styles.heroMetricLabel,
                  {
                    color: colors.subtext,
                  },
                ]}
              >
                EATEN
              </Text>

              <Text
                style={[
                  styles.heroMetricValue,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {Math.round(consumedCalories)}
              </Text>
            </View>

            <View style={styles.heroDivider} />

            <View>
              <Text
                style={[
                  styles.heroMetricLabel,
                  {
                    color: colors.subtext,
                  },
                ]}
              >
                REMAINING
              </Text>

              <Text
                style={[
                  styles.heroMetricValue,
                  {
                    color:
                      calorieRemaining > 0
                        ? colors.primary
                        : colors.danger,
                  },
                ]}
              >
                {Math.round(calorieRemaining)}
              </Text>
            </View>

            <View style={styles.heroDivider} />

            <View>
              <Text
                style={[
                  styles.heroMetricLabel,
                  {
                    color: colors.subtext,
                  },
                ]}
              >
                LOGGED
              </Text>

              <Text
                style={[
                  styles.heroMetricValue,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {loggedMealCount}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              Your daily targets
            </Text>

            <Text
              style={[
                styles.sectionSubtitle,
                {
                  color: colors.subtext,
                },
              ]}
            >
              Keep these numbers in sight today.
            </Text>
          </View>

          <Ionicons
            name="options-outline"
            size={21}
            color={colors.subtext}
          />
        </View>

        <View style={styles.macroGrid}>
          <MacroCard
            icon="fitness-outline"
            label="Protein"
            value={`${Math.round(targetProtein)}g`}
            consumed={consumedProtein}
            target={targetProtein}
            color="#F97316"
            colors={colors}
            isDark={isDark}
          />
<MacroCard
            icon="leaf-outline"
            label="Carbs"
            value={`${Math.round(targetCarbs)}g`}
            consumed={consumedCarbs}
            target={targetCarbs}
            color="#22C55E"
            colors={colors}
            isDark={isDark}
          />

          <MacroCard
            icon="water-outline"
            label="Fat"
            value={`${Math.round(targetFat)}g`}
            consumed={consumedFat}
            target={targetFat}
            color="#38BDF8"
            colors={colors}
            isDark={isDark}
          />

          <MacroCard
            icon="nutrition-outline"
            label="Fiber"
            value={`${Math.round(plan.targetFiber)}g`}
            consumed={0}
            target={plan.targetFiber}
            color="#A78BFA"
            colors={colors}
            isDark={isDark}
          />
        </View>

        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeaderText}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              Recommended meals
            </Text>

            <Text
              style={[
                styles.sectionSubtitle,
                {
                  color: colors.subtext,
                },
              ]}
            >
              Portions are calculated from your daily
              nutrition target.
            </Text>
          </View>

          <Pressable
            style={[
              styles.refreshButton,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
            onPress={() => {
              setPlan(
                createDailyPlan(profile)
              );
            }}
          >
            <Ionicons
              name="refresh-outline"
              size={18}
              color={colors.primary}
            />
          </Pressable>
        </View>

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
            styles.planSummary,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.summaryIcon}>
            <Ionicons
              name="analytics-outline"
              size={21}
              color={colors.primary}
            />
          </View>

          <View style={styles.summaryInfo}>
            <Text
              style={[
                styles.summaryLabel,
                {
                  color: colors.subtext,
                },
              ]}
            >
              RECOMMENDED PLAN TOTAL
            </Text>

            <Text
              style={[
                styles.summaryTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              {plan.totalCalories} kcal
            </Text>
          </View>

          <View style={styles.summaryTargetBlock}>
            <Text
              style={[
                styles.summaryTargetLabel,
                {
                  color: colors.subtext,
                },
              ]}
            >
              TARGET
            </Text>

            <Text
              style={[
                styles.summaryTarget,
                {
                  color: colors.primary,
                },
              ]}
            >
              {Math.round(plan.targetCalories)}
            </Text>
          </View>
        </View>
<View style={styles.sectionHeader}>
          <View>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              Quick actions
            </Text>

            <Text
              style={[
                styles.sectionSubtitle,
                {
                  color: colors.subtext,
                },
              ]}
            >
              Keep your plan updated as you go.
            </Text>
          </View>
        </View>

        <View style={styles.actionGrid}>
          <ActionCard
            icon="add-circle-outline"
            title="Log a meal"
            subtitle="Track what you ate"
            onPress={() =>
              router.push("/dashboard/meals")
            }
            colors={colors}
          />

          <ActionCard
            icon="scan-outline"
            title="Scan food"
            subtitle="Check a food item"
            onPress={() =>
              router.push("/dashboard/meals")
            }
            colors={colors}
          />

          <ActionCard
            icon="water-outline"
            title="Track water"
            subtitle="Update hydration"
            onPress={() =>
              router.push("/dashboard/water")
            }
            colors={colors}
          />

          <ActionCard
            icon="barbell-outline"
            title="Workout"
            subtitle="View today's activity"
            onPress={() =>
              router.push("/dashboard/workouts")
            }
            colors={colors}
          />
        </View>

        <View
          style={[
            styles.insightCard,
            {
              backgroundColor: isDark
                ? "#141A0B"
                : "#F4F9DD",
              borderColor: isDark
                ? "#34420F"
                : "#DCE9A0",
            },
          ]}
        >
          <View
            style={[
              styles.insightIcon,
              {
                backgroundColor: isDark
                  ? "#28350C"
                  : "#E6F2AF",
              },
            ]}
          >
            <Ionicons
              name="bulb-outline"
              size={21}
              color={colors.primary}
            />
          </View>

          <View style={styles.insightContent}>
            <Text
              style={[
                styles.insightTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              Today's focus
            </Text>

            <Text
              style={[
                styles.insightText,
                {
                  color: colors.subtext,
                },
              ]}
            >
              Follow your recommended portions and
              update your meals as you eat. Your
              progress is calculated from your real
              logged data.
            </Text>
          </View>
        </View>

        <Pressable
          style={styles.profileLink}
          onPress={() =>
            router.push("/dashboard/profile")
          }
        >
          <Ionicons
            name="person-outline"
            size={17}
            color={colors.subtext}
          />

          <Text
            style={[
              styles.profileLinkText,
              {
                color: colors.subtext,
              },
            ]}
          >
            Nutrition targets are based on your profile
          </Text>

          <Ionicons
            name="chevron-forward"
            size={17}
            color={colors.subtext}
          />
        </Pressable>
      </ScrollView>
    </View>
  );
}

function MacroCard({
  icon,
label,
  value,
  consumed,
  target,
  color,
  colors,
  isDark,
}: {
  icon: IconName;
  label: string;
  value: string;
  consumed: number;
  target: number;
  color: string;
  colors: {
    background: string;
    card: string;
    text: string;
    subtext: string;
    primary: string;
    secondary: string;
    border: string;
    success: string;
    warning: string;
    danger: string;
  };
  isDark: boolean;
}) {
  const progress =
    target > 0
      ? Math.min(
          Math.max(consumed / target, 0),
          1
        )
      : 0;

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
      <View style={styles.macroTop}>
        <View
          style={[
            styles.macroIcon,
            {
              backgroundColor: isDark
                ? "#20242B"
                : "#F3F4F6",
            },
          ]}
        >
          <Ionicons
            name={icon}
            size={18}
            color={color}
          />
        </View>

        <Text
          style={[
            styles.macroLabel,
            {
              color: colors.subtext,
            },
          ]}
        >
          {label}
        </Text>
      </View>

      <Text
        style={[
          styles.macroValue,
          {
            color: colors.text,
          },
        ]}
      >
        {value}
      </Text>

      <Text
        style={[
          styles.macroConsumed,
          {
            color: colors.subtext,
          },
        ]}
      >
        {Math.round(consumed)}g consumed
      </Text>

      <View
        style={[
          styles.macroTrack,
          {
            backgroundColor: isDark
              ? "#292D34"
              : "#E5E7EB",
          },
        ]}
      >
        {progress > 0 && (
          <View
            style={[
              styles.macroFill,
              {
                width: `${progress * 100}%`,
                backgroundColor: color,
              },
            ]}
          />
        )}
      </View>
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
    background: string;
    card: string;
    text: string;
    subtext: string;
    primary: string;
    secondary: string;
    border: string;
    success: string;
    warning: string;
    danger: string;
  };
  isDark: boolean;
}) {
  const mealStyle = mealColors[meal.meal];

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
              backgroundColor:
                isDark
                  ? mealStyle.background
                  : "#F5F5F5",
            },
          ]}
        >
          <Ionicons
            name={mealIcons[meal.meal]}
            size={23}
            color={mealStyle.icon}
          />
        </View>

        <View style={styles.mealInfo}>
          <Text
            style={[
              styles.mealTitle,
              {
                color: colors.text,
              },
            ]}
          >
            {meal.title}
          </Text>

          <Text
            style={[
              styles.mealSubtitle,
              {
                color: colors.subtext,
              },
            ]}
          >
            {meal.portions.length} recommended food
            {meal.portions.length === 1 ? "" : "s"}
          </Text>
        </View>

        <View style={styles.mealCaloriesBlock}>
          <Text
            style={[
              styles.mealCalories,
              {
                color: colors.text,
              },
            ]}
          >
            {meal.calories}
          </Text>
<Text
            style={[
              styles.mealCaloriesUnit,
              {
                color: colors.subtext,
              },
            ]}
          >
            kcal
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.mealTargetRow,
          {
            backgroundColor: isDark
              ? "#1B1E24"
              : "#F7F7F7",
          },
        ]}
      >
        <View style={styles.mealTargetLeft}>
          <Ionicons
            name="pie-chart-outline"
            size={15}
            color={colors.primary}
          />

          <Text
            style={[
              styles.mealTargetText,
              {
                color: colors.subtext,
              },
            ]}
          >
            Meal target
          </Text>
        </View>

        <Text
          style={[
            styles.mealTargetValue,
            {
              color: colors.text,
            },
          ]}
        >
          {meal.targetCalories} kcal
        </Text>
      </View>

      <View style={styles.foodList}>
        {meal.portions.map((portion) => (
          <View
            key={`${meal.meal}-${portion.food.id}`}
            style={styles.foodItem}
          >
            <View
              style={[
                styles.foodBullet,
                {
                  backgroundColor: colors.primary,
                },
              ]}
            >
              <Ionicons
                name="checkmark"
                size={11}
                color="#111111"
              />
            </View>

            <View style={styles.foodInfo}>
              <Text
                style={[
                  styles.foodName,
                  {
                    color: colors.text,
                  },
                ]}
                numberOfLines={1}
              >
                {portion.food.nameEnglish}
              </Text>

              <Text
                style={[
                  styles.foodDetails,
                  {
                    color: colors.subtext,
                  },
                ]}
              >
                {portion.grams} g ·{" "}
                {Math.round(
                  portion.nutrition.calories
                )} kcal ·{" "}
                {Math.round(
                  portion.nutrition.protein
                )}g protein
              </Text>
            </View>
          </View>
        ))}

        {meal.portions.length === 0 && (
          <View style={styles.emptyMeal}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color={colors.warning}
            />

            <Text
              style={[
                styles.noFoodText,
                {
                  color: colors.subtext,
                },
              ]}
            >
              No suitable foods were found for this
              meal.
            </Text>
          </View>
        )}
      </View>

      <View
        style={[
          styles.mealMacros,
          {
            borderTopColor: colors.border,
          },
        ]}
      >
        <MealMacro
          label="Protein"
          value={`${meal.protein}g`}
          icon="fitness-outline"
          colors={colors}
        />

        <MealMacro
          label="Carbs"
          value={`${meal.carbohydrates}g`}
          icon="leaf-outline"
          colors={colors}
        />

        <MealMacro
          label="Fat"
          value={`${meal.fat}g`}
          icon="water-outline"
          colors={colors}
        />

        <MealMacro
          label="Fiber"
          value={`${meal.fiber}g`}
          icon="nutrition-outline"
          colors={colors}
        />
      </View>
    </View>
  );
}
function MealMacro({
  label,
  value,
  icon,
  colors,
}: {
  label: string;
  value: string;
  icon: IconName;
  colors: {
    background: string;
    card: string;
    text: string;
    subtext: string;
    primary: string;
    secondary: string;
    border: string;
    success: string;
    warning: string;
    danger: string;
  };
}) {
  return (
    <View style={styles.mealMacro}>
      <Ionicons
        name={icon}
        size={14}
        color={colors.subtext}
      />

      <Text
        style={[
          styles.mealMacroValue,
          {
            color: colors.text,
          },
        ]}
      >
        {value}
      </Text>

      <Text
        style={[
          styles.mealMacroLabel,
          {
            color: colors.subtext,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

function ActionCard({
  icon,
  title,
  subtitle,
  onPress,
  colors,
}: {
  icon: IconName;
  title: string;
  subtitle: string;
  onPress: () => void;
  colors: {
    background: string;
    card: string;
    text: string;
    subtext: string;
    primary: string;
    secondary: string;
    border: string;
    success: string;
    warning: string;
    danger: string;
  };
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.actionCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: pressed ? 0.72 : 1,
        },
      ]}
      onPress={onPress}
    >
      <View
        style={[
          styles.actionIcon,
          {
            backgroundColor: colors.primary,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={20}
          color="#111111"
        />
      </View>

      <View style={styles.actionInfo}>
        <Text
          style={[
            styles.actionTitle,
            {
              color: colors.text,
            },
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.actionSubtitle,
            {
              color: colors.subtext,
            },
          ]}
          numberOfLines={1}
        >
          {subtitle}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={17}
        color={colors.subtext}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 0,
  },

  content: {
    width: "100%",
    alignSelf: "center",
    paddingTop: Platform.OS === "ios" ? 22 : 20,
    paddingBottom: 40,
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  loadingIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingSpinner: {
    marginTop: 20,
  },

  loadingTitle: {
    fontSize: 20,
    fontWeight: "900",
    marginTop: 12,
  },

  loadingText: {
    maxWidth: 310,
    textAlign: "center",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 7,
  },

  primaryButton: {
    marginTop: 22,
    minHeight: 48,
    borderRadius: 14,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  primaryButtonText: {
    fontSize: 14,
    fontWeight: "900",
  },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  headerText: {
    flex: 1,
    minWidth: 0,
    paddingRight: 12,
  },

  eyebrowRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 7,
  },

  eyebrowDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 7,
  },

  eyebrow: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.5,
  },

  title: {
    fontWeight: "900",
    letterSpacing: -0.7,
  },

  subtitle: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: 5,
  },

  profileSummary: {
    fontSize: 11,
    marginTop: 5,
  },
dateBadge: {
    minHeight: 38,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 11,
    marginTop: 1,
  },

  dateText: {
    fontSize: 11,
    fontWeight: "800",
    marginLeft: 6,
  },

  heroCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 18,
    marginBottom: 24,
    overflow: "hidden",
  },

  heroTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  heroIconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: "#D7F52C",
    alignItems: "center",
    justifyContent: "center",
  },

  heroTitleBlock: {
    flex: 1,
    marginLeft: 13,
  },

  heroEyebrow: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.2,
  },

  heroCalories: {
    fontSize: 25,
    fontWeight: "900",
    marginTop: 2,
  },

  heroCaloriesUnit: {
    fontSize: 13,
    fontWeight: "700",
  },

  targetStatus: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 7,
  },

  targetStatusText: {
    fontSize: 9,
    fontWeight: "900",
    marginLeft: 4,
  },

  calorieProgressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },

  progressTrack: {
    flex: 1,
    height: 9,
    borderRadius: 6,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 6,
  },

  progressPercent: {
    width: 40,
    textAlign: "right",
    fontSize: 11,
    fontWeight: "900",
  },

  heroBottom: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
  },

  heroMetricLabel: {
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 0.8,
  },

  heroMetricValue: {
    fontSize: 17,
    fontWeight: "900",
    marginTop: 2,
  },

  heroDivider: {
    width: 1,
    height: 31,
    backgroundColor: "#30343B",
    marginHorizontal: 22,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    marginTop: 2,
  },

  sectionHeaderText: {
    flex: 1,
    paddingRight: 10,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: -0.2,
  },

  sectionSubtitle: {
    fontSize: 11,
    lineHeight: 17,
    marginTop: 3,
  },

  macroGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -5,
    marginBottom: 23,
  },

  macroCard: {
    width: "50%",
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    paddingHorizontal: 12,
    minHeight: 132,
  },

  macroTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  macroIcon: {
    width: 31,
    height: 31,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  macroLabel: {
    fontSize: 11,
    fontWeight: "800",
  },

  macroValue: {
    fontSize: 21,
    fontWeight: "900",
    marginTop: 14,
  },

  macroConsumed: {
    fontSize: 9,
    marginTop: 3,
  },

  macroTrack: {
    height: 5,
    borderRadius: 4,
    marginTop: 12,
    overflow: "hidden",
  },

  macroFill: {
    height: "100%",
    borderRadius: 4,
  },

  refreshButton: {
    width: 39,
    height: 39,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  mealCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    overflow: "hidden",
  },

  mealHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  mealIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  mealInfo: {
    flex: 1,
    minWidth: 0,
    marginLeft: 11,
  },

  mealTitle: {
    fontSize: 16,
    fontWeight: "900",
  },

  mealSubtitle: {
    fontSize: 10,
    marginTop: 3,
  },

  mealCaloriesBlock: {
    alignItems: "flex-end",
    marginLeft: 8,
  },

  mealCalories: {
    fontSize: 18,
    fontWeight: "900",
  },

  mealCaloriesUnit: {
    fontSize: 9,
    marginTop: 1,
  },
mealTargetRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 11,
    paddingHorizontal: 11,
    paddingVertical: 9,
    marginTop: 13,
  },

  mealTargetLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  mealTargetText: {
    fontSize: 10,
    fontWeight: "700",
    marginLeft: 6,
  },

  mealTargetValue: {
    fontSize: 10,
    fontWeight: "900",
  },

  foodList: {
    marginTop: 13,
  },

  foodItem: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 43,
    paddingVertical: 5,
  },

  foodBullet: {
    width: 24,
    height: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 9,
  },

  foodInfo: {
    flex: 1,
    minWidth: 0,
  },

  foodName: {
    fontSize: 12,
    fontWeight: "800",
  },

  foodDetails: {
    fontSize: 9,
    marginTop: 3,
  },

  emptyMeal: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 7,
  },

  noFoodText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 16,
    marginLeft: 8,
  },

  mealMacros: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    paddingTop: 13,
    marginTop: 9,
  },

  mealMacro: {
    alignItems: "center",
    minWidth: 52,
  },

  mealMacroValue: {
    fontSize: 11,
    fontWeight: "900",
    marginTop: 3,
  },

  mealMacroLabel: {
    fontSize: 8,
    marginTop: 2,
  },

  planSummary: {
    minHeight: 78,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 17,
    paddingHorizontal: 14,
    marginTop: 2,
    marginBottom: 24,
  },

  summaryIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: "#20280E",
    alignItems: "center",
    justifyContent: "center",
  },

  summaryInfo: {
    flex: 1,
    marginLeft: 11,
  },

  summaryLabel: {
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 0.8,
  },

  summaryTitle: {
    fontSize: 17,
    fontWeight: "900",
    marginTop: 2,
  },

  summaryTargetBlock: {
    alignItems: "flex-end",
  },

  summaryTargetLabel: {
    fontSize: 8,
    fontWeight: "800",
  },

  summaryTarget: {
    fontSize: 15,
    fontWeight: "900",
    marginTop: 2,
  },

  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -5,
    marginBottom: 18,
  },

  actionCard: {
    width: "50%",
    minHeight: 76,
    borderWidth: 1,
    borderRadius: 16,
    padding: 11,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  actionIcon: {
    width: 37,
    height: 37,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 9,
  },

  actionInfo: {
    flex: 1,
    minWidth: 0,
  },

  actionTitle: {
    fontSize: 11,
    fontWeight: "900",
  },

  actionSubtitle: {
    fontSize: 8,
    marginTop: 3,
  },

  insightCard: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 17,
    padding: 14,
    marginBottom: 17,
  },

  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  insightContent: {
    flex: 1,
    marginLeft: 11,
  },

  insightTitle: {
    fontSize: 13,
    fontWeight: "900",
  },

  insightText: {
    fontSize: 10,
    lineHeight: 16,
    marginTop: 4,
  },

  profileLink: {
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  profileLinkText: {
    fontSize: 9,
    marginHorizontal: 6,
  },
});