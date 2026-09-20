import React, { useMemo } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Svg, { Circle } from "react-native-svg";

import BottomNav from "../../components/dashboard/BottomNav";
import { useAuth } from "../../context/AuthContext";
import { useAppData } from "../../context/AppDataContext";
import { useTheme } from "../../context/ThemeContext";

export default function HomeScreen() {
  const { user } = useAuth();

  const {
    data,
    goals,
    meals,
    calorieProgress,
    proteinProgress,
    carbsProgress,
    fatProgress,
    waterProgress,
    stepsProgress,
    overallProgress,
  } = useAppData();

  const { colors } = useTheme();
  const { width } = useWindowDimensions();

  const fullName = user?.fullName?.trim() || "TenaFit User";
  const firstName = fullName.split(" ")[0] || "there";

  const mealCount = Array.isArray(meals) ? meals.length : 0;

  const caloriesRemaining = Math.max(
    Number(goals.calories || 0) - Number(data.calories || 0),
    0
  );

  const safeOverallProgress = Math.max(
    0,
    Math.min(Math.round(Number(overallProgress) || 0), 100)
  );

  const safeCalorieProgress = Math.max(
    0,
    Math.min(Number(calorieProgress) || 0, 1)
  );

  const safeProteinProgress = Math.max(
    0,
    Math.min(Number(proteinProgress) || 0, 1)
  );

  const safeCarbsProgress = Math.max(
    0,
    Math.min(Number(carbsProgress) || 0, 1)
  );

  const safeFatProgress = Math.max(
    0,
    Math.min(Number(fatProgress) || 0, 1)
  );

  const safeWaterProgress = Math.max(
    0,
    Math.min(Number(waterProgress) || 0, 1)
  );

  const safeStepsProgress = Math.max(
    0,
    Math.min(Number(stepsProgress) || 0, 1)
  );

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) {
      return "Good morning";
    }

    if (hour < 18) {
      return "Good afternoon";
    }

    return "Good evening";
  };

  const dailyInsight = useMemo(() => {
    if (mealCount === 0) {
      return "Start by logging your first meal so TenaFit can track your nutrition today.";
    }

    if (caloriesRemaining === 0) {
      return "You've reached your calorie target today. Keep your next choices balanced.";
    }

    if (safeWaterProgress < 0.5) {
      return `You're at ${Number(data.water || 0).toFixed(
        1
      )} L of water. Keep drinking throughout the day.`;
    }

    if (safeStepsProgress < 0.5) {
      return `You're at ${Number(
        data.steps || 0
      ).toLocaleString()} steps. A little more movement will keep you on track.`;
    }

    if (safeOverallProgress >= 80) {
      return "You're doing great today. Keep the momentum going.";
    }

    return `You have ${Math.round(
      caloriesRemaining
    )} calories remaining in today's target.`;
  }, [
    mealCount,
    caloriesRemaining,
    safeWaterProgress,
    safeStepsProgress,
    safeOverallProgress,
    data.water,
    data.steps,
  ]);

  const isLargeScreen = width >= 700;

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <View style={styles.root}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.content,
            isLargeScreen ? styles.largeScreenContent : null,
          ]}
        >
          <View style={styles.mobileFrame}>
            <View style={styles.header}>
              <View style={styles.brandRow}>
                <View
                  style={[
                    styles.logo,
                    {
                      backgroundColor: colors.primary,
                    },
                  ]}
                >
                  <Ionicons
                    name="fitness"
                    size={22}
                    color="#111111"
                  />
                </View>
<Text
                  style={[
                    styles.brandText,
                    {
                      color: colors.text,
                    },
                  ]}
                >
                  Tena
                  <Text
                    style={{
                      color: colors.primary,
                    }}
                  >
                    Fit
                  </Text>
                </Text>
              </View>

              <View style={styles.headerActions}>
                <Pressable
                  style={[
                    styles.iconButton,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={() =>
                    router.push("/dashboard/settings")
                  }
                >
                  <Ionicons
                    name="settings-outline"
                    size={21}
                    color={colors.text}
                  />
                </Pressable>

                <Pressable
                  style={[
                    styles.avatar,
                    {
                      backgroundColor: colors.primary,
                    },
                  ]}
                  onPress={() =>
                    router.push("/dashboard/profile")
                  }
                >
                  <Text style={styles.avatarText}>
                    {firstName.charAt(0).toUpperCase()}
                  </Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.greeting}>
              <Text
                style={[
                  styles.greetingTitle,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {getGreeting()}, {firstName}
              </Text>

              <Text
                style={[
                  styles.greetingSubtitle,
                  {
                    color: colors.subtext,
                  },
                ]}
              >
                Stay consistent and keep moving toward your
                goals.
              </Text>
            </View>

            <View
              style={[
                styles.hero,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <View style={styles.heroTop}>
                <View style={styles.heroText}>
                  <Text
                    style={[
                      styles.heroLabel,
                      {
                        color: colors.primary,
                      },
                    ]}
                  >
                    TODAY'S GOAL
                  </Text>

                  <Text
                    style={[
                      styles.heroTitle,
                      {
                        color: colors.text,
                      },
                    ]}
                  >
                    Keep your nutrition
                    {"\n"}
                    on track
                  </Text>

                  <Text
                    style={[
                      styles.heroDescription,
                      {
                        color: colors.subtext,
                      },
                    ]}
                  >
                    {caloriesRemaining > 0
                      ? `${Math.round(caloriesRemaining)} calories remaining today`
                      : "You've reached your calorie target"}
                  </Text>
                </View>

                <ProgressRing
                  progress={safeOverallProgress}
                  colors={colors}
                />
              </View>
              <View
                style={[
                  styles.heroProgressTrack,
                  {
                    backgroundColor: colors.border,
                  },
                ]}
              >
                {safeOverallProgress > 0 ? (
                  <View
                    style={[
                      styles.heroProgressFill,
                      {
                        width: `${safeOverallProgress}%`,
                        backgroundColor: colors.primary,
                      },
                    ]}
                  />
                ) : null}
              </View>
            </View>

            <SectionHeader
              title="Today's nutrition"
              action="View progress"
              colors={colors}
              onAction={() =>
                router.push("/dashboard/progress")
              }
            />

            <View style={styles.statsGrid}>
              <StatCard
                icon="flame-outline"
                title="Calories"
                value={Math.round(
                  Number(data.calories || 0)
                ).toString()}
                target={Math.round(
                  Number(goals.calories || 0)
                ).toString()}
                unit="kcal"
                progress={safeCalorieProgress}
                colors={colors}
              />

              <StatCard
                icon="fitness-outline"
                title="Protein"
                value={Math.round(
                  Number(data.protein || 0)
                ).toString()}
                target={Math.round(
                  Number(goals.protein || 0)
                ).toString()}
                unit="g"
                progress={safeProteinProgress}
                colors={colors}
              />

              <StatCard
                icon="leaf-outline"
                title="Carbs"
                value={Math.round(
                  Number(data.carbs || 0)
                ).toString()}
                target={Math.round(
                  Number(goals.carbs || 0)
                ).toString()}
                unit="g"
                progress={safeCarbsProgress}
                colors={colors}
              />

              <StatCard
                icon="nutrition-outline"
                title="Fat"
                value={Math.round(
                  Number(data.fat || 0)
                ).toString()}
                target={Math.round(
                  Number(goals.fat || 0)
                ).toString()}
                unit="g"
                progress={safeFatProgress}
                colors={colors}
              />
            </View>

            <SectionHeader
              title="Quick actions"
              colors={colors}
            />

            <View style={styles.actionRow}>
              <ActionCard
                icon="restaurant-outline"
                title="Add meal"
                subtitle="Track your food"
                colors={colors}
                onPress={() =>
                  router.push("/dashboard/meals")
                }
              />

              <ActionCard
                icon="search-outline"
                title="Find food"
                subtitle="Browse food database"
                colors={colors}
                onPress={() =>
                  router.push("/dashboard/meals")
                }
              />
            </View>

            <SectionHeader
              title="Daily activity"
              colors={colors}
            />

            <View style={styles.activityRow}>
              <ActivityCard
                icon="water-outline"
                title="Water"
                value={`${Number(data.water || 0).toFixed(
                  1
                )} L`}
                target={`${Number(
                  goals.water || 0
                ).toFixed(1)} L`}
                progress={safeWaterProgress}
                colors={colors}
                onPress={() =>
                  router.push("/dashboard/water")
                }
              />
<ActivityCard
                icon="walk-outline"
                title="Steps"
                value={Number(
                  data.steps || 0
                ).toLocaleString()}
                target={Number(
                  goals.steps || 0
                ).toLocaleString()}
                progress={safeStepsProgress}
                colors={colors}
                onPress={() =>
                  router.push("/dashboard/steps")
                }
              />
            </View>

            <View
              style={[
                styles.mealCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.mealIcon,
                  {
                    backgroundColor: `${colors.primary}18`,
                  },
                ]}
              >
                <Ionicons
                  name="restaurant-outline"
                  size={22}
                  color={colors.primary}
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
                  {mealCount === 0
                    ? "No meals logged"
                    : `${mealCount} ${
                        mealCount === 1
                          ? "meal"
                          : "meals"
                      } logged today}
                </Text>

                <Text
                  style={[
                    styles.mealSubtitle,
                    {
                      color: colors.subtext,
                    },
                  ]}
                >
                  {mealCount === 0
                    ? "Start tracking your food to see your daily nutrition."
                    : ${Math.round(
                        Number(data.calories || 0)
                      )} calories recorded today`}
                </Text>
              </View>

              <Pressable
                style={[
                  styles.arrowButton,
                  {
                    backgroundColor: `${colors.primary}18`,
                  },
                ]}
                onPress={() =>
                  router.push("/dashboard/meals")
                }
                hitSlop={8}
              >
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={colors.primary}
                />
              </Pressable>
            </View>

            <Pressable
              style={[
                styles.tipCard,
                {
                  backgroundColor: colors.primary,
                },
              ]}
              onPress={() =>
                router.push("/dashboard/progress")
              }
            >
              <View style={styles.tipIcon}>
                <Ionicons
                  name="sparkles"
                  size={21}
                  color="#111111"
                />
              </View>

              <View style={styles.tipContent}>
                <Text style={styles.tipLabel}>
                  TENAFIT INSIGHT
                </Text>

                <Text style={styles.tipText}>
                  {dailyInsight}
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={18}
                color="#111111"
              />
            </Pressable>
          </View>
        </ScrollView>

        <BottomNav />
      </View>
    </SafeAreaView>
  );
}

function ProgressRing({
  progress,
  colors,
}: {
  progress: number;
  colors: any;
}) {
  const size = 94;
  const strokeWidth = 7;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
const safeProgress = Math.max(
    0,
    Math.min(Number(progress) || 0, 100)
  );

  const strokeDashoffset =
    circumference -
    (safeProgress / 100) * circumference;

  return (
    <View
      style={[
        styles.heroCircle,
        {
          width: size,
          height: size,
        },
      ]}
    >
        <Svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
        >
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.border}
          strokeWidth={strokeWidth}
          fill="none"
        />

        {safeProgress > 0 ? (
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.primary}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        ) : null}
      </Svg>

      <View style={styles.heroCircleContent}>
        <Text
          style={[
            styles.heroPercentage,
            {
              color: colors.text,
            },
          ]}
        >
          {safeProgress}%
        </Text>

        <Text
          style={[
            styles.heroComplete,
            {
              color: colors.subtext,
            },
          ]}
        >
          done
        </Text>
      </View>
    </View>
  );
}

function SectionHeader({
  title,
  action,
  colors,
  onAction,
}: {
  title: string;
  action?: string;
  colors: any;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: colors.text,
          },
        ]}
      >
        {title}
      </Text>

      {action && onAction ? (
        <Pressable
          onPress={onAction}
          hitSlop={8}
        >
          <Text
            style={[
              styles.viewAll,
              {
                color: colors.primary,
              },
            ]}
          >
            {action}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function StatCard({
  icon,
  title,
  value,
  target,
  unit,
  progress,
  colors,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: string;
  target: string;
  unit: string;
  progress: number;
  colors: any;
}) {
  const percentage = Math.max(
    0,
    Math.min(Number(progress) || 0, 1)
  );

  return (
    <View
      style={[
        styles.statCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.statHeader}>
        <View
          style={[
            styles.statIcon,
            {
              backgroundColor: `${colors.primary}18`,
            },
          ]}
        >
          <Ionicons
            name={icon}
            size={18}
            color={colors.primary}
          />
        </View>

        <Text
          style={[
            styles.statTitle,
            {
              color: colors.subtext,
            },
          ]}
        >
          {title}
        </Text>
      </View>

      <Text
        style={[
          styles.statValue,
          {
            color: colors.text,
          },
        ]}
      >
        {value}

        <Text
          style={[
            styles.statUnit,
            {
              color: colors.subtext,
            },
          ]}
        >
          {" "}
          {unit}
        </Text>
      </Text>

      <Text
        style={[
          styles.statTarget,
          {
            color: colors.subtext,
          },
        ]}
      >
        of {target} {unit}
      </Text>
<View
        style={[
          styles.statTrack,
          {
            backgroundColor: colors.border,
          },
        ]}
      >
        {percentage > 0 ? (
          <View
            style={[
              styles.statFill,
              {
                width: `${percentage * 100}%`,
                backgroundColor: colors.primary,
              },
            ]}
          />
        ) : null}
      </View>
    </View>
  );
}

function ActionCard({
  icon,
  title,
  subtitle,
  colors,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  colors: any;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[
        styles.actionCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
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
          size={22}
          color="#111111"
        />
      </View>

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
      >
        {subtitle}
      </Text>
    </Pressable>
  );
}

function ActivityCard({
  icon,
  title,
  value,
  target,
  progress,
  colors,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: string;
  target: string;
  progress: number;
  colors: any;
  onPress: () => void;
}) {
  const percentage = Math.max(
    0,
    Math.min(Number(progress) || 0, 1)
  );

  return (
    <Pressable
      style={[
        styles.activityCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
      onPress={onPress}
    >
      <View
        style={[
          styles.activityIcon,
          {
            backgroundColor: `${colors.primary}18`,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={20}
          color={colors.primary}
        />
      </View>

      <Text
        style={[
          styles.activityTitle,
          {
            color: colors.subtext,
          },
        ]}
      >
        {title}
      </Text>

      <Text
        style={[
          styles.activityValue,
          {
            color: colors.text,
          },
        ]}
      >
        {value}
      </Text>

      <Text
        style={[
          styles.activityTarget,
          {
            color: colors.subtext,
          },
        ]}
      >
        of {target}
      </Text>

      <View
        style={[
          styles.activityTrack,
          {
            backgroundColor: colors.border,
          },
        ]}
      >
        {percentage > 0 ? (
          <View
            style={[
              styles.activityFill,
              {
                width: `${percentage * 100}%`,
                backgroundColor: colors.primary,
              },
            ]}
          />
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  root: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 105,
  },

  largeScreenContent: {
    alignItems: "center",
  },

  mobileFrame: {
    width: "100%",
    maxWidth: 520,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 25,
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  logo: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  brandText: {
    fontSize: 21,
    fontWeight: "900",
    marginLeft: 10,
  },

  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
iconButton: {
    width: 42,
    height: 42,
    borderRadius: 13,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 9,
  },

  avatarText: {
    color: "#111111",
    fontSize: 16,
    fontWeight: "900",
  },

  greeting: {
    marginBottom: 20,
  },

  greetingTitle: {
    fontSize: 25,
    fontWeight: "900",
  },

  greetingSubtitle: {
    fontSize: 12,
    marginTop: 6,
    lineHeight: 18,
  },

  hero: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    marginBottom: 27,
  },

  heroTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  heroText: {
    flex: 1,
  },

  heroLabel: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.2,
  },

  heroTitle: {
    fontSize: 22,
    lineHeight: 27,
    fontWeight: "900",
    marginTop: 8,
  },

  heroDescription: {
    fontSize: 11,
    lineHeight: 16,
    marginTop: 9,
  },

  heroCircle: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
    position: "relative",
  },

  heroCircleContent: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },

  heroPercentage: {
    fontSize: 20,
    fontWeight: "900",
  },

  heroComplete: {
    fontSize: 9,
    fontWeight: "700",
    marginTop: 2,
    textTransform: "uppercase",
  },

  heroProgressTrack: {
    height: 8,
    borderRadius: 8,
    overflow: "hidden",
    marginTop: 20,
  },

  heroProgressFill: {
    height: "100%",
    borderRadius: 8,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "900",
  },

  viewAll: {
    fontSize: 10,
    fontWeight: "800",
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 27,
  },

  statCard: {
    width: "48%",
    minHeight: 137,
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    marginRight: "2%",
    marginBottom: 10,
  },

  statCardLast: {
    marginRight: 0,
  },

  statHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  statIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },

  statTitle: {
    fontSize: 10,
    fontWeight: "800",
    marginLeft: 8,
  },

  statValue: {
    fontSize: 20,
    fontWeight: "900",
    marginTop: 13,
  },

  statUnit: {
    fontSize: 9,
    fontWeight: "700",
  },

  statTarget: {
    fontSize: 9,
    marginTop: 2,
  },

  statTrack: {
    height: 6,
    borderRadius: 6,
    overflow: "hidden",
    marginTop: 12,
  },

  statFill: {
    height: "100%",
    borderRadius: 6,
  },

  actionRow: {
    flexDirection: "row",
    marginBottom: 27,
  },

  actionCard: {
    flex: 1,
    minHeight: 132,
    borderRadius: 18,
    borderWidth: 1,
    padding: 15,
  },

  actionCardSecond: {
    marginLeft: 10,
  },

  actionIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  actionTitle: {
    fontSize: 13,
    fontWeight: "900",
    marginTop: 12,
  },

  actionSubtitle: {
    fontSize: 9,
    marginTop: 4,
  },

  activityRow: {
    flexDirection: "row",
    marginBottom: 12,
  },

  activityCard: {
    flex: 1,
    minHeight: 160,
    borderRadius: 18,
    borderWidth: 1,
    padding: 15,
  },

  activityCardSecond: {
    marginLeft: 10,
  },

  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  activityTitle: {
    fontSize: 10,
    fontWeight: "800",
    marginTop: 11,
  },

  activityValue: {
    fontSize: 19,
    fontWeight: "900",
    marginTop: 5,
  },

  activityTarget: {
    fontSize: 9,
    marginTop: 2,
  },

  activityTrack: {
    height: 6,
    borderRadius: 6,
    overflow: "hidden",
    marginTop: 14,
  },
activityFill: {
    height: "100%",
    borderRadius: 6,
  },

  mealCard: {
    minHeight: 82,
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  mealIcon: {
    width: 47,
    height: 47,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  mealInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },

  mealTitle: {
    fontSize: 13,
    fontWeight: "900",
  },

  mealSubtitle: {
    fontSize: 9,
    lineHeight: 14,
    marginTop: 4,
  },

  arrowButton: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },

  tipCard: {
    minHeight: 80,
    borderRadius: 20,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  tipIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: "rgba(17,17,17,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },

  tipContent: {
    flex: 1,
    marginLeft: 13,
    marginRight: 8,
  },

  tipLabel: {
    color: "#111111",
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1.1,
  },

  tipText: {
    color: "#111111",
    fontSize: 10,
    lineHeight: 15,
    fontWeight: "700",
    marginTop: 5,
  },
});