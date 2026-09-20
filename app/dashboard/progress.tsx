import React, { useEffect, useMemo, useState } from "react";
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

import { useAppData } from "../../context/AppDataContext";
import { useTheme } from "../../context/ThemeContext";
import { getWorkoutHistory } from "../../storage/workoutStorage";
import { WorkoutHistoryEntry } from "../../types/workout";

export default function ProgressScreen() {
  const { colors } = useTheme();
  const {
    data,
    goals,
    calorieProgress,
    proteinProgress,
    carbsProgress,
    fatProgress,
    waterProgress,
    stepsProgress,
  } = useAppData();

  const { width } = useWindowDimensions();

  const [history, setHistory] = useState<WorkoutHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const entries = await getWorkoutHistory();
      setHistory(entries);
    } finally {
      setLoading(false);
    }
  };

  const safeProgress = (value: number) =>
    Math.max(0, Math.min(value, 1));

  const today = new Date();

  const weekDays = useMemo(() => {
    const start = new Date(today);
    const day = start.getDay();
    const mondayOffset = day === 0 ? -6 : 1 - day;

    start.setDate(start.getDate() + mondayOffset);
    start.setHours(0, 0, 0, 0);

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);

      const dateKey = date.toISOString().split("T")[0];

      const hasWorkout = history.some((workout) => {
        const workoutDate = new Date(workout.completedAt);
        const workoutKey = workoutDate.toISOString().split("T")[0];

        return workoutKey === dateKey;
      });

      const isToday =
        date.toDateString() === today.toDateString();

      return {
        date,
        dateKey,
        hasWorkout,
        isToday,
      };
    });
  }, [history]);

  const weeklyWorkoutDays = weekDays.filter(
    (day) => day.hasWorkout
  ).length;

  const workoutStats = useMemo(() => {
    const completed = history.length;

    const totalMinutes = history.reduce(
      (sum, workout) => sum + workout.duration,
      0
    );

    const totalSteps = history.reduce(
      (sum, workout) => sum + workout.stepsAdded,
      0
    );

    const totalExercises = history.reduce(
      (sum, workout) => sum + workout.completedExercises,
      0
    );

    return {
      completed,
      totalMinutes,
      totalSteps,
      totalExercises,
    };
  }, [history]);

  const overallProgress = useMemo(() => {
    const values = [
      safeProgress(calorieProgress),
      safeProgress(proteinProgress),
      safeProgress(carbsProgress),
      safeProgress(fatProgress),
      safeProgress(waterProgress),
      safeProgress(stepsProgress),
    ];

    if (values.length === 0) {
      return 0;
    }

    return values.reduce((sum, value) => sum + value, 0) /
      values.length;
  }, [
    calorieProgress,
    proteinProgress,
    carbsProgress,
    fatProgress,
    waterProgress,
    stepsProgress,
  ]);

  const nutritionItems = [
    {
      icon: "flame-outline" as keyof typeof Ionicons.glyphMap,
      label: "Calories",
      value: Math.round(data.calories),
      goal: Math.round(goals.calories),
      unit: "kcal",
      progress: safeProgress(calorieProgress),
    },
    {
      icon: "fitness-outline" as keyof typeof Ionicons.glyphMap,
      label: "Protein",
      value: Math.round(data.protein),
      goal: Math.round(goals.protein),
      unit: "g",
      progress: safeProgress(proteinProgress),
    },
    {
      icon: "leaf-outline" as keyof typeof Ionicons.glyphMap,
label: "Carbs",
      value: Math.round(data.carbs),
      goal: Math.round(goals.carbs),
      unit: "g",
      progress: safeProgress(carbsProgress),
    },
    {
      icon: "nutrition-outline" as keyof typeof Ionicons.glyphMap,
      label: "Fat",
      value: Math.round(data.fat),
      goal: Math.round(goals.fat),
      unit: "g",
      progress: safeProgress(fatProgress),
    },
  ];

  const activityItems = [
    {
      icon: "water-outline" as keyof typeof Ionicons.glyphMap,
      label: "Water",
      value: data.water.toFixed(1),
      goal: goals.water.toFixed(1),
      unit: "L",
      progress: safeProgress(waterProgress),
      route: "/dashboard/water",
    },
    {
      icon: "walk-outline" as keyof typeof Ionicons.glyphMap,
      label: "Steps",
      value: data.steps.toLocaleString(),
      goal: goals.steps.toLocaleString(),
      unit: "",
      progress: safeProgress(stepsProgress),
      route: "/dashboard/steps",
    },
  ];

  const latestWorkouts = history.slice(0, 5);

  const progressPercentage = Math.round(
    overallProgress * 100
  );

  const isLargeScreen = width >= 700;

  return (
    <View
      style={[
        styles.root,
        { backgroundColor: colors.background },
      ]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          isLargeScreen && styles.largeContent,
        ]}
      >
        <View style={styles.mobileFrame}>
          <View style={styles.header}>
            <View>
              <Text
                style={[
                  styles.headerEyebrow,
                  { color: colors.primary },
                ]}
              >
                YOUR JOURNEY
              </Text>

              <Text
                style={[
                  styles.headerTitle,
                  { color: colors.text },
                ]}
              >
                Progress
              </Text>

              <Text
                style={[
                  styles.headerSubtitle,
                  { color: colors.subtext },
                ]}
              >
                See how you're doing today.
              </Text>
            </View>

            <Pressable
              style={[
                styles.headerButton,
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
                size={20}
                color={colors.text}
              />
            </Pressable>
          </View>

          <View
            style={[
              styles.overviewCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.overviewTop}>
              <View style={styles.overviewText}>
                <Text
                  style={[
                    styles.overviewLabel,
                    { color: colors.subtext },
                  ]}
                >
                  TODAY'S PROGRESS
                </Text>

                <Text
                  style={[
                    styles.overviewTitle,
                    { color: colors.text },
                  ]}
                >
                  Keep building
                  {"\n"}your consistency
                </Text>

                <Text
                  style={[
                    styles.overviewDescription,
                    { color: colors.subtext },
                  ]}
                >
                  Your progress is calculated from your
                  real nutrition and activity data.
                </Text>
              </View>

              <ProgressRing
                progress={progressPercentage}
                colors={colors}
              />
            </View>
<View
              style={[
                styles.overviewTrack,
                { backgroundColor: colors.border },
              ]}
            >
              {progressPercentage > 0 && (
                <View
                  style={[
                    styles.overviewFill,
                    {
                      width: `${progressPercentage}%`,
                      backgroundColor: colors.primary,
                    },
                  ]}
                />
              )}
            </View>

            <View style={styles.overviewFooter}>
              <Text
                style={[
                  styles.overviewFooterText,
                  { color: colors.subtext },
                ]}
              >
                {progressPercentage}% of today's tracked goals
              </Text>

              <Text
                style={[
                  styles.overviewFooterText,
                  { color: colors.text },
                ]}
              >
                {weeklyWorkoutDays}/7 workout days
              </Text>
            </View>
          </View>

          <SectionHeader
            title="This week"
            colors={colors}
          />

          <View
            style={[
              styles.weekCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.weekRow}>
              {weekDays.map((day) => {
                const letter = day.date
                  .toLocaleDateString("en-US", {
                    weekday: "short",
                  })
                  .slice(0, 1);

                const number = day.date.getDate();

                return (
                  <View
                    key={day.dateKey}
                    style={styles.dayItem}
                  >
                    <Text
                      style={[
                        styles.dayLetter,
                        { color: colors.subtext },
                      ]}
                    >
                      {letter}
                    </Text>

                    <View
                      style={[
                        styles.dayCircle,
                        {
                          backgroundColor: day.hasWorkout
                            ? colors.primary
                            : colors.background,
                          borderColor: day.isToday
                            ? colors.primary
                            : colors.border,
                        },
                      ]}
                    >
                      {day.hasWorkout ? (
                        <Ionicons
                          name="checkmark"
                          size={16}
                          color="#111111"
                        />
                      ) : (
                        <Text
                          style={[
                            styles.dayNumber,
                            { color: colors.subtext },
                          ]}
                        >
                          {number}
                        </Text>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>

            <View style={styles.weekSummary}>
              <View>
                <Text
                  style={[
                    styles.weekSummaryValue,
                    { color: colors.text },
                  ]}
                >
                  {weeklyWorkoutDays}
                </Text>

                <Text
                  style={[
                    styles.weekSummaryLabel,
                    { color: colors.subtext },
                  ]}
                >
                  workout days
                </Text>
              </View>

              <View
                style={[
                  styles.weekDivider,
                  { backgroundColor: colors.border },
                ]}
              />
<View>
                <Text
                  style={[
                    styles.weekSummaryValue,
                    { color: colors.text },
                  ]}
                >
                  {workoutStats.totalMinutes}
                </Text>

                <Text
                  style={[
                    styles.weekSummaryLabel,
                    { color: colors.subtext },
                  ]}
                >
                  total minutes
                </Text>
              </View>

              <View
                style={[
                  styles.weekDivider,
                  { backgroundColor: colors.border },
                ]}
              />

              <View>
                <Text
                  style={[
                    styles.weekSummaryValue,
                    { color: colors.text },
                  ]}
                >
                  {workoutStats.totalExercises}
                </Text>

                <Text
                  style={[
                    styles.weekSummaryLabel,
                    { color: colors.subtext },
                  ]}
                >
                  exercises
                </Text>
              </View>
            </View>
          </View>

          <SectionHeader
            title="Today's nutrition"
            action="View meals"
            colors={colors}
            onAction={() =>
              router.push("/dashboard/meals")
            }
          />

          <View style={styles.nutritionGrid}>
            {nutritionItems.map((item) => (
              <ProgressCard
                key={item.label}
                icon={item.icon}
                label={item.label}
                value={item.value.toString()}
                goal={`${item.goal} ${item.unit}`}
                percentage={Math.round(
                  item.progress * 100
                )}
                colors={colors}
              />
            ))}
          </View>

          <SectionHeader
            title="Daily activity"
            colors={colors}
          />

          <View style={styles.activityGrid}>
            {activityItems.map((item) => (
              <Pressable
                key={item.label}
                style={[
                  styles.activityCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => router.push(item.route)}
              >
                <View style={styles.activityTop}>
                  <View
                    style={[
                      styles.activityIcon,
                      {
                        backgroundColor:
                          `${colors.primary}18`,
                      },
                    ]}
                  >
                    <Ionicons
                      name={item.icon}
                      size={21}
                      color={colors.primary}
                    />
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={17}
                    color={colors.subtext}
                  />
                </View>

                <Text
                  style={[
                    styles.activityLabel,
                    { color: colors.subtext },
                  ]}
                >
                  {item.label}
                </Text>

                <Text
                  style={[
                    styles.activityValue,
                    { color: colors.text },
                  ]}
                >
                  {item.value}
                  {item.unit ? ` ${item.unit}` : ""}
                </Text>

                <Text
                  style={[
                    styles.activityGoal,
                    { color: colors.subtext },
                  ]}
                >
                  of {item.goal}
                  {item.unit ? ` ${item.unit}` : ""}
                </Text>

                <View
                  style={[
                    styles.smallTrack,
                    { backgroundColor: colors.border },
                  ]}
                >
                  {item.progress > 0 && (
                    <View
                      style={[
                        styles.smallFill,
                        {
                          width: `${item.progress * 100}%`,
                          backgroundColor:
                            colors.primary,
                        },
                      ]}
                    />
                  )}
                </View>

                <Text
                  style={[
                    styles.activityPercentage,
                    { color: colors.primary },
                  ]}
                >
                  {Math.round(item.progress * 100)}%
                </Text>
              </Pressable>
            ))}
          </View>

          <SectionHeader
            title="Workout history"
            action={
              history.length > 5
                ? "View workouts"
                : undefined
            }
            colors={colors}
            onAction={() =>
              router.push("/dashboard/workouts")
            }
          />

          {loading ? (
            <View
              style={[
                styles.emptyCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <ActivityIndicator
                size="small"
                color={colors.primary}
              />
            </View>
          ) : latestWorkouts.length === 0 ? (
            <View
              style={[
                styles.emptyCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.emptyIcon,
                  {
                    backgroundColor:
                      `${colors.primary}18`,
                  },
                ]}
              >
                <Ionicons
                  name="barbell-outline"
                  size={23}
                  color={colors.primary}
                />
              </View>

              <Text
                style={[
                  styles.emptyTitle,
                  { color: colors.text },
                ]}
              >
                No workouts yet
              </Text>

              <Text
                style={[
                  styles.emptyDescription,
                  { color: colors.subtext },
                ]}
              >
                Complete your first workout and your
                activity history will appear here.
              </Text>

              <Pressable
                style={[
                  styles.emptyButton,
                  { backgroundColor: colors.primary },
                ]}
                onPress={() =>
                  router.push("/dashboard/workouts")
                }
              >
                <Text style={styles.emptyButtonText}>
                  Start a workout
                </Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.historyList}>
              {latestWorkouts.map((workout) => {
                const completedDate = new Date(
                  workout.completedAt
                );

                return (
                  <View
                    key={workout.id}
                    style={[
                      styles.historyCard,
                      {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.historyIcon,
                        {
                          backgroundColor: `${colors.primary}18`,
                        },
                      ]}
                    >
                      <Ionicons
                        name="barbell-outline"
                        size={21}
                        color={colors.primary}
                      />
                    </View>

                    <View style={styles.historyInfo}>
                      <Text
                        style={[
                          styles.historyName,
                          { color: colors.text },
                        ]}
                        numberOfLines={1}
                      >
                        {workout.workoutName}
                      </Text>

                      <Text
                        style={[
                          styles.historyMeta,
                          { color: colors.subtext },
                        ]}
                      >
                        {workout.focus} •{" "}
                        {completedDate.toLocaleDateString()}
                      </Text>

                      <Text
                        style={[
                          styles.historyMeta,
                          { color: colors.subtext },
                        ]}
                      >
                        {workout.duration} min •{" "}
                        {workout.completedExercises}/
                        {workout.totalExercises} exercises
                      </Text>
                    </View>

                    <View style={styles.historyRight}>
                      <Text
                        style={[
                          styles.historySteps,
                          { color: colors.text },
                        ]}
                      >
                        {workout.stepsAdded}
                      </Text>

                      <Text
                        style={[
                          styles.historyStepsLabel,
                          { color: colors.subtext },
                        ]}
                      >
                        steps
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          <View
            style={[
              styles.insightCard,
              { backgroundColor: colors.primary },
            ]}
          >
            <View style={styles.insightIcon}>
              <Ionicons
                name="sparkles"
                size={21}
                color="#111111"
              />
            </View>

            <View style={styles.insightContent}>
              <Text style={styles.insightLabel}>
                TENAFIT INSIGHT
              </Text>

              <Text style={styles.insightText}>
                {progressPercentage === 0
                  ? "Start logging meals, water, steps, or workouts to begin building your progress."
                  : progressPercentage >= 80
                  ? "You're making strong progress today. Keep the same consistency going."
                  : "Small actions add up. Keep logging your meals and activity throughout the day."}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.bottomNav,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <NavItem
          icon="home-outline"
          label="Home"
          colors={colors}
          onPress={() => router.push("/home")}
        />

        <NavItem
          icon="calendar-outline"
          label="Plan"
          colors={colors}
          onPress={() =>
            router.push("/dashboard/plan")
          }
        />
<Pressable
          style={[
            styles.navCenter,
            { backgroundColor: colors.primary },
          ]}
          onPress={() =>
            router.push("/dashboard/meals")
          }
        >
          <Ionicons
            name="add"
            size={27}
            color="#111111"
          />
        </Pressable>

        <NavItem
          icon="bar-chart"
          label="Progress"
          active
          colors={colors}
          onPress={() =>
            router.push("/dashboard/progress")
          }
        />

        <NavItem
          icon="person-outline"
          label="Profile"
          colors={colors}
          onPress={() =>
            router.push("/dashboard/profile")
          }
        />
      </View>
    </View>
  );
}

function ProgressRing({
  progress,
  colors,
}: {
  progress: number;
  colors: any;
}) {
  const size = 96;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const safeProgress = Math.max(
    0,
    Math.min(progress, 100)
  );

  const dashOffset =
    circumference -
    (safeProgress / 100) * circumference;

  return (
    <View
      style={[
        styles.ring,
        {
          width: size,
          height: size,
        },
      ]}
    >
      <View
        style={[
          styles.ringOuter,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: colors.border,
          },
        ]}
      />

      {safeProgress > 0 && (
        <View
          style={[
            styles.ringProgress,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderColor: colors.primary,
              transform: [
                {
                  rotate: `${Math.min(
                    safeProgress * 3.6,
                    359.9
                  )}deg`,
                },
              ],
            },
          ]}
        />
      )}

      <View style={styles.ringContent}>
        <Text
          style={[
            styles.ringPercentage,
            { color: colors.text },
          ]}
        >
          {safeProgress}%
        </Text>

        <Text
          style={[
            styles.ringLabel,
            { color: colors.subtext },
          ]}
        >
          today
        </Text>
      </View>
    </View>
  );
}

function ProgressCard({
  icon,
  label,
  value,
  goal,
  percentage,
  colors,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  goal: string;
  percentage: number;
  colors: any;
}) {
  return (
    <View
      style={[
        styles.progressCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.progressCardHeader}>
        <View
          style={[
            styles.progressCardIcon,
            {
              backgroundColor:
                `${colors.primary}18`,
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
            styles.progressCardLabel,
            { color: colors.subtext },
          ]}
        >
          {label}
        </Text>
      </View>

      <Text
        style={[
          styles.progressCardValue,
          { color: colors.text },
        ]}
      >
        {value}
      </Text>

      <Text
        style={[
          styles.progressCardGoal,
          { color: colors.subtext },
        ]}
      >
        of {goal}
      </Text>

      <View
        style={[
          styles.progressCardTrack,
          { backgroundColor: colors.border },
]}
      >
        {percentage > 0 && (
          <View
            style={[
              styles.progressCardFill,
              {
                width: ${Math.min(
                  percentage,
                  100
                )}%,
                backgroundColor: colors.primary,
              },
            ]}
          />
        )}
      </View>

      <Text
        style={[
          styles.progressCardPercentage,
          { color: colors.primary },
        ]}
      >
        {percentage}%
      </Text>
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
          { color: colors.text },
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
              styles.sectionAction,
              { color: colors.primary },
            ]}
          >
            {action}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function NavItem({
  icon,
  label,
  active = false,
  colors,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active?: boolean;
  colors: any;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={styles.navItem}
      onPress={onPress}
    >
      <Ionicons
        name={icon}
        size={21}
        color={
          active
            ? colors.primary
            : colors.subtext
        }
      />

      <Text
        style={[
          styles.navLabel,
          {
            color: active
              ? colors.primary
              : colors.subtext,
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 105,
  },

  largeContent: {
    alignItems: "center",
  },

  mobileFrame: {
    width: "100%",
    maxWidth: 520,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
  },

  headerEyebrow: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.4,
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: "900",
    marginTop: 4,
  },

  headerSubtitle: {
    fontSize: 11,
    marginTop: 4,
  },

  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  overviewCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    marginBottom: 27,
  },

  overviewTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  overviewText: {
    flex: 1,
    paddingRight: 10,
  },

  overviewLabel: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.1,
  },

  overviewTitle: {
    fontSize: 22,
    lineHeight: 27,
    fontWeight: "900",
    marginTop: 8,
  },

  overviewDescription: {
    fontSize: 10,
    lineHeight: 15,
    marginTop: 9,
  },

  overviewTrack: {
    height: 8,
    borderRadius: 8,
    overflow: "hidden",
    marginTop: 20,
  },

  overviewFill: {
    height: "100%",
    borderRadius: 8,
  },

  overviewFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 9,
  },

  overviewFooterText: {
    fontSize: 8,
    fontWeight: "700",
  },

  ring: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginLeft: 6,
  },

  ringOuter: {
    position: "absolute",
    borderWidth: 8,
  },

  ringProgress: {
    position: "absolute",
    borderWidth: 8,
    borderLeftColor: "transparent",
    borderBottomColor: "transparent",
  },

  ringContent: {
    alignItems: "center",
    justifyContent: "center",
  },

  ringPercentage: {
    fontSize: 19,
    fontWeight: "900",
  },
ringLabel: {
    fontSize: 8,
    fontWeight: "700",
    marginTop: 1,
    textTransform: "uppercase",
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

  sectionAction: {
    fontSize: 10,
    fontWeight: "800",
  },

  weekCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 27,
  },

  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  dayItem: {
    alignItems: "center",
  },

  dayLetter: {
    fontSize: 9,
    fontWeight: "800",
    marginBottom: 7,
  },

  dayCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  dayNumber: {
    fontSize: 10,
    fontWeight: "800",
  },

  weekSummary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: 17,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "transparent",
  },

  weekDivider: {
    width: 1,
    height: 30,
  },

  weekSummaryValue: {
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
  },

  weekSummaryLabel: {
    fontSize: 8,
    fontWeight: "700",
    marginTop: 2,
    textAlign: "center",
  },

  nutritionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 27,
  },

  progressCard: {
    width: "48.5%",
    minHeight: 143,
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
  },

  progressCardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  progressCardIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },

  progressCardLabel: {
    fontSize: 9,
    fontWeight: "800",
    marginLeft: 8,
  },

  progressCardValue: {
    fontSize: 20,
    fontWeight: "900",
    marginTop: 12,
  },

  progressCardGoal: {
    fontSize: 8,
    marginTop: 2,
  },

  progressCardTrack: {
    height: 6,
    borderRadius: 6,
    overflow: "hidden",
    marginTop: 13,
  },

  progressCardFill: {
    height: "100%",
    borderRadius: 6,
  },

  progressCardPercentage: {
    fontSize: 9,
    fontWeight: "900",
    marginTop: 7,
  },

  activityGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 27,
  },

  activityCard: {
    flex: 1,
    minHeight: 171,
    borderRadius: 18,
    borderWidth: 1,
    padding: 15,
  },

  activityTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  activityIcon: {
    width: 41,
    height: 41,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  activityLabel: {
    fontSize: 10,
    fontWeight: "800",
    marginTop: 11,
  },

  activityValue: {
    fontSize: 20,
    fontWeight: "900",
    marginTop: 5,
  },

  activityGoal: {
    fontSize: 8,
    marginTop: 2,
  },

  smallTrack: {
    height: 6,
    borderRadius: 6,
    overflow: "hidden",
    marginTop: 14,
  },

  smallFill: {
    height: "100%",
    borderRadius: 6,
  },

  activityPercentage: {
    fontSize: 9,
    fontWeight: "900",
    marginTop: 7,
  },

  emptyCard: {
    minHeight: 190,
    borderRadius: 20,
    borderWidth: 1,
    padding: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 27,
  },

  emptyIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 15,
    fontWeight: "900",
  },

  emptyDescription: {
    fontSize: 10,
    lineHeight: 15,
    textAlign: "center",
    marginTop: 6,
    maxWidth: 280,
  },

  emptyButton: {
    minHeight: 40,
    paddingHorizontal: 17,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },

  emptyButtonText: {
    color: "#111111",
    fontSize: 10,
    fontWeight: "900",
  },

  historyList: {
    gap: 10,
    marginBottom: 27,
  },
historyCard: {
    minHeight: 88,
    borderRadius: 18,
    borderWidth: 1,
    padding: 13,
    flexDirection: "row",
    alignItems: "center",
  },

  historyIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  historyInfo: {
    flex: 1,
    marginLeft: 11,
    marginRight: 8,
  },

  historyName: {
    fontSize: 12,
    fontWeight: "900",
  },

  historyMeta: {
    fontSize: 8,
    lineHeight: 13,
    marginTop: 3,
  },

  historyRight: {
    alignItems: "flex-end",
  },

  historySteps: {
    fontSize: 13,
    fontWeight: "900",
  },

  historyStepsLabel: {
    fontSize: 8,
    marginTop: 2,
  },

  insightCard: {
    minHeight: 82,
    borderRadius: 20,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  insightIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: "rgba(17,17,17,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },

  insightContent: {
    flex: 1,
    marginLeft: 13,
  },

  insightLabel: {
    color: "#111111",
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1.1,
  },

  insightText: {
    color: "#111111",
    fontSize: 10,
    lineHeight: 15,
    fontWeight: "700",
    marginTop: 5,
  },

  bottomNav: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 10,
    height: 70,
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 7,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },

  navItem: {
    flex: 1,
    height: 58,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },

  navLabel: {
    fontSize: 8,
    fontWeight: "800",
  },

  navCenter: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },
});