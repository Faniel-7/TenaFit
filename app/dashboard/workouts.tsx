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

import DashboardPage from "../../components/dashboard/DashboardPage";
import { useTheme } from "../../context/ThemeContext";
import { useAppData } from "../../context/AppDataContext";
import { getUserProfile } from "../../storage/profileStorage";
import { UserProfile } from "../../types/userProfile";
import {
  getWorkoutHistory,
} from "../../storage/workoutStorage";
import {
  getRecommendedExercises,
} from "../../logic/workoutRecommendationEngine";

type IconName = keyof typeof Ionicons.glyphMap;

type WorkoutItem = {
  id: string;
  name: string;
  category: string;
  muscleGroup?: string;
  difficulty?: string;
  duration?: number;
  calories?: number;
  equipment?: string;
};

type HistoryItem = {
  id?: string;
  workoutId?: string;
  name?: string;
  title?: string;
  duration?: number;
  calories?: number;
  completedAt?: string;
  date?: string;
};

export default function WorkoutsScreen() {
  const { colors, isDark } = useTheme();
  const { width } = useWindowDimensions();
  const { data } = useAppData();

  const [profile, setProfile] =
    useState<UserProfile | null>(null);
  const [workouts, setWorkouts] = useState<
    WorkoutItem[]
  >([]);
  const [history, setHistory] = useState<
    HistoryItem[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const isCompact = width < 390;
  const isWide = width >= 900;

  useEffect(() => {
    let mounted = true;

    const loadWorkouts = async () => {
      try {
        const savedProfile =
          await getUserProfile();

        if (!mounted) {
          return;
        }

        if (savedProfile) {
          setProfile(savedProfile);

          const recommendations = await getRecommendedExercises(
            
            (data as any)?.exercises ?? [],
            savedProfile
          );

          if (Array.isArray(recommendations)) {
            setWorkouts(
              recommendations.map(
                (recommendation: any, index: number) => ({
                  id: String(
                    recommendation.id ??
                      recommendation.workoutId ??
                      index
                  ),
                  name: String(
                    recommendation.name ??
                      recommendation.title ??
                      "Workout"
                  ),
                  category: String(
                    recommendation.category ??
                      "General"
                  ),
                  muscleGroup:
                    recommendation.muscleGroup,
                  difficulty:
                    recommendation.difficulty,
                  duration:
                    recommendation.duration,
                  calories:
                    recommendation.calories,
                  equipment:
                    recommendation.equipment,
                })
              )
            );
          }
        }

        const savedHistory =
          await getWorkoutHistory();

        if (mounted && Array.isArray(savedHistory)) {
          setHistory(
            savedHistory as HistoryItem[]
          );
        }
      } catch {
        if (mounted) {
          setWorkouts([]);
          setHistory([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadWorkouts();

    return () => {
      mounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const values = workouts
      .map((workout) => workout.category)
      .filter(Boolean);

    return [
      "All",
      ...Array.from(new Set(values)),
    ];
  }, [workouts]);

  const filteredWorkouts = useMemo(() => {
    if (selectedCategory === "All") {
      return workouts;
    }

    return workouts.filter(
      (workout) =>
        workout.category === selectedCategory
    );
  }, [workouts, selectedCategory]);

  const completedWorkouts = history.length;

  const totalWorkoutMinutes = history.reduce(
    (total, workout) =>
      total + (Number(workout.duration) || 0),
    0
  );

  const totalWorkoutCalories = history.reduce(
    (total, workout) =>
      total + (Number(workout.calories) || 0),
    0
  );

  const commitmentDays =
    Number(profile?.daysPerWeek) || 0;

  const weeklyProgress =
    commitmentDays > 0
      ? Math.min(
          completedWorkouts / commitmentDays,
          1
        )
      : 0;

  if (loading) {
    return (
      <View
        style={[
          styles.loading,
{
            backgroundColor:
              colors.background,
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
            name="barbell-outline"
            size={30}
            color={colors.primary}
          />
        </View>

        <ActivityIndicator
          color={colors.primary}
          size="small"
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
          Building your workouts
        </Text>

        <Text
          style={[
            styles.loadingText,
            {
              color: colors.subtext,
            },
          ]}
        >
          Finding workouts that match your
          profile and commitment.
        </Text>
      </View>
    );
  }

  return (
    <DashboardPage
      title="Workouts"
      subtitle="Train with a plan built around your goals."
      icon="barbell-outline"
    >
      <View
        style={[
          styles.page,
          {
            maxWidth: isWide ? 1120 : 620,
          },
        ]}
      >
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
              <View style={styles.eyebrowRow}>
                <View
                  style={[
                    styles.eyebrowDot,
                    {
                      backgroundColor:
                        colors.primary,
                    },
                  ]}
                />

                <Text
                  style={[
                    styles.eyebrow,
                    {
                      color:
                        colors.primary,
                    },
                  ]}
                >
                  YOUR TRAINING
                </Text>
              </View>

              <Text
                style={[
                  styles.heroTitle,
                  {
                    color: colors.text,
                    fontSize: isCompact
                      ? 27
                      : 31,
                  },
                ]}
              >
                Stay consistent.
              </Text>

              <Text
                style={[
                  styles.heroSubtitle,
                  {
                    color:
                      colors.subtext,
                  },
                ]}
              >
                Every session gets you closer
                to your goal.
              </Text>
            </View>

            <View
              style={[
                styles.heroIcon,
                {
                  backgroundColor:
                    colors.primary,
                },
              ]}
            >
              <Ionicons
                name="barbell"
                size={27}
                color="#111111"
              />
            </View>
          </View>

          <View style={styles.heroStats}>
            <HeroStat
              icon="checkmark-circle-outline"
              value={`${completedWorkouts}`}
              label="Completed"
              colors={colors}
            />

            <View
              style={[
                styles.statDivider,
                {
                  backgroundColor:
                    colors.border,
                },
              ]}
            />

            <HeroStat
              icon="time-outline"
              value={`${Math.round(
                totalWorkoutMinutes
              )}`}
              label="Minutes"
              colors={colors}
            />
<View
              style={[
                styles.statDivider,
                {
                  backgroundColor:
                    colors.border,
                },
              ]}
            />

            <HeroStat
              icon="flame-outline"
              value={`${Math.round(
                totalWorkoutCalories
              )}`}
              label="Calories"
              colors={colors}
            />
          </View>
        </View>

        <View
          style={[
            styles.weekCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.weekHeader}>
            <View>
              <Text
                style={[
                  styles.sectionTitle,
                  {
                    color: colors.text,
                  },
                ]}
              >
                Weekly commitment
              </Text>

              <Text
                style={[
                  styles.sectionSubtitle,
                  {
                    color: colors.subtext,
                  },
                ]}
              >
                {commitmentDays > 0
                  ? `${completedWorkouts} of ${commitmentDays} workout days`
                  : "Set your workout commitment in your profile."}
              </Text>
            </View>

            <Text
              style={[
                styles.weekPercentage,
                {
                  color: colors.primary,
                },
              ]}
            >
              {Math.round(
                weeklyProgress * 100
              )}
              %
            </Text>
          </View>

          <View
            style={[
              styles.weekTrack,
              {
                backgroundColor: isDark
                  ? "#292D34"
                  : "#E5E7EB",
              },
            ]}
          >
            {weeklyProgress > 0 && (
              <View
                style={[
                  styles.weekFill,
                  {
                    width: `${weeklyProgress * 100}%`,
                    backgroundColor:
                      colors.primary,
                  },
                ]}
              />
            )}
          </View>

          <View style={styles.weekFooter}>
            <View
              style={[
                styles.goalPill,
                {
                  backgroundColor: isDark
                    ? "#20280E"
                    : "#F1F8D2",
                },
              ]}
            >
              <Ionicons
                name="flag-outline"
                size={13}
                color={colors.primary}
              />

              <Text
                style={[
                  styles.goalPillText,
                  {
                    color:
                      colors.primary,
                  },
                ]}
              >
                {profile?.goal === "lose"
                  ? "Fat loss"
                  : profile?.goal ===
                      "gain"
                    ? "Weight gain"
                    : "Maintenance"}
              </Text>
            </View>

            <Text
              style={[
                styles.commitmentText,
                {
                  color: colors.subtext,
                },
              ]}
            >
              {profile?.minutesPerDay
                ? `${profile.minutesPerDay} min/session`
                : "Flexible sessions"}
            </Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <View style={styles.sectionText}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              Recommended for you
            </Text>
<Text
              style={[
                styles.sectionSubtitle,
                {
                  color: colors.subtext,
                },
              ]}
            >
              Selected using your profile and
              activity goals.
            </Text>
          </View>

          <Ionicons
            name="sparkles-outline"
            size={20}
            color={colors.primary}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={
            styles.categoryScroll
          }
        >
          {categories.map((category) => {
            const active =
              selectedCategory === category;

            return (
              <Pressable
                key={category}
                onPress={() =>
                  setSelectedCategory(
                    category
                  )
                }
                style={({ pressed }) => [
                  styles.categoryButton,
                  {
                    backgroundColor: active
                      ? colors.primary
                      : colors.card,
                    borderColor: active
                      ? colors.primary
                      : colors.border,
                    opacity: pressed
                      ? 0.7
                      : 1,
                  },
                ]}
              >
                <Ionicons
                  name={
                    category === "All"
                      ? "grid-outline"
                      : "fitness-outline"
                  }
                  size={14}
                  color={
                    active
                      ? "#111111"
                      : colors.subtext
                  }
                />

                <Text
                  style={[
                    styles.categoryText,
                    {
                      color: active
                        ? "#111111"
                        : colors.text,
                    },
                  ]}
                >
                  {category}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {filteredWorkouts.length > 0 ? (
          <View style={styles.workoutList}>
            {filteredWorkouts.map(
              (workout, index) => (
                <WorkoutCard
                  key={
                    workout.id ??
                    `${workout.name}-${index}`
                  }
                  workout={workout}
                  index={index}
                  colors={colors}
                  isDark={isDark}
                />
              )
            )}
          </View>
        ) : (
          <View
            style={[
              styles.emptyCard,
              {
                backgroundColor:
                  colors.card,
                borderColor:
                  colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.emptyIcon,
                {
                  backgroundColor:
                    isDark
                      ? "#20280E"
                      : "#F1F8D2",
                },
              ]}
            >
              <Ionicons
                name="fitness-outline"
                size={27}
                color={colors.primary}
              />
            </View>

            <Text
              style={[
                styles.emptyTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              No workouts found
            </Text>

            <Text
              style={[
                styles.emptyText,
                {
                  color:
                    colors.subtext,
                },
              ]}
            >
              Try another category or update
              your activity preferences.
            </Text>
          </View>
        )}
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
              Recent activity
            </Text>

            <Text
              style={[
                styles.sectionSubtitle,
                {
                  color: colors.subtext,
                },
              ]}
            >
              Your completed sessions.
            </Text>
          </View>

          <Ionicons
            name="time-outline"
            size={20}
            color={colors.subtext}
          />
        </View>

        {history.length > 0 ? (
          <View
            style={[
              styles.historyCard,
              {
                backgroundColor:
                  colors.card,
                borderColor:
                  colors.border,
              },
            ]}
          >
            {history
              .slice(0, 6)
              .map((item, index) => (
                <HistoryRow
                  key={
                    item.id ??
                    item.workoutId ??
                    `${item.name}-${index}`
                  }
                  item={item}
                  index={index}
                  colors={colors}
                />
              ))}
          </View>
        ) : (
          <View
            style={[
              styles.emptyHistory,
              {
                backgroundColor:
                  colors.card,
                borderColor:
                  colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.emptyHistoryIcon,
                {
                  backgroundColor:
                    isDark
                      ? "#20280E"
                      : "#F1F8D2",
                },
              ]}
            >
              <Ionicons
                name="trophy-outline"
                size={24}
                color={colors.primary}
              />
            </View>

            <View
              style={
                styles.emptyHistoryInfo
              }
            >
              <Text
                style={[
                  styles.emptyHistoryTitle,
                  {
                    color:
                      colors.text,
                  },
                ]}
              >
                Your first workout is waiting
              </Text>

              <Text
                style={[
                  styles.emptyHistoryText,
                  {
                    color:
                      colors.subtext,
                  },
                ]}
              >
                Start a recommended session and
                your activity will appear here.
              </Text>
            </View>
          </View>
        )}

        <Pressable
          onPress={() =>
            router.push(
              "/dashboard/workout-session"
            )
          }
          style={({ pressed }) => [
            styles.startButton,
            {
              backgroundColor:
                colors.primary,
              opacity: pressed ? 0.72 : 1,
            },
          ]}
        >
          <View
            style={styles.startButtonIcon}
          >
            <Ionicons
              name="play"
              size={17}
              color="#111111"
            />
          </View>

          <View
            style={styles.startButtonText}
          >
            <Text
              style={styles.startButtonTitle}
            >
              Start a workout
            </Text>

            <Text
              style={styles.startButtonSubtitle}
            >
              Begin your next training session
            </Text>
          </View>

          <Ionicons
            name="arrow-forward"
            size={20}
            color="#111111"
          />
        </Pressable>
<Pressable
          onPress={() =>
            router.push("/dashboard/profile")
          }
          style={styles.profileLink}
        >
          <Ionicons
            name="person-outline"
            size={16}
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
            Workout recommendations use your profile
            and activity commitment
          </Text>

          <Ionicons
            name="chevron-forward"
            size={16}
            color={colors.subtext}
          />
        </Pressable>
      </View>
    </DashboardPage>
  );
}

function HeroStat({
  icon,
  value,
  label,
  colors,
}: {
  icon: IconName;
  value: string;
  label: string;
  colors: any;
}) {
  return (
    <View style={styles.heroStat}>
      <Ionicons
        name={icon}
        size={16}
        color={colors.primary}
      />

      <Text
        style={[
          styles.heroStatValue,
          {
            color: colors.text,
          },
        ]}
      >
        {value}
      </Text>

      <Text
        style={[
          styles.heroStatLabel,
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

function WorkoutCard({
  workout,
  index,
  colors,
  isDark,
}: {
  workout: WorkoutItem;
  index: number;
  colors: any;
  isDark: boolean;
}) {
  const iconMap: IconName[] = [
    "barbell-outline",
    "body-outline",
    "fitness-outline",
    "walk-outline",
    "flame-outline",
  ];

  const icon =
    iconMap[index % iconMap.length];

  return (
    <View
      style={[
        styles.workoutCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.workoutTop}>
        <View
          style={[
            styles.workoutIcon,
            {
              backgroundColor: isDark
                ? "#20280E"
                : "#F1F8D2",
            },
          ]}
        >
          <Ionicons
            name={icon}
            size={24}
            color={colors.primary}
          />
        </View>

        <View
          style={[
            styles.recommendedBadge,
            {
              backgroundColor: isDark
                ? "#20280E"
                : "#F1F8D2",
            },
          ]}
        >
          <Ionicons
            name="sparkles-outline"
            size={11}
            color={colors.primary}
          />

          <Text
            style={[
              styles.recommendedText,
              {
                color:
                  colors.primary,
              },
            ]}
          >
            RECOMMENDED
          </Text>
        </View>
      </View>

      <Text
        style={[
          styles.workoutName,
          {
            color: colors.text,
          },
        ]}
        numberOfLines={2}
      >
        {workout.name}
      </Text>

      <Text
        style={[
          styles.workoutCategory,
          {
            color: colors.subtext,
          },
        ]}
      >
        {workout.category ||
          "Full body training"}
      </Text>

      <View style={styles.workoutMeta}>
        <WorkoutMeta
          icon="time-outline"
          value={
            workout.duration
              ? `${workout.duration} min`
              : "Flexible"
          }
          colors={colors}
        />

        <WorkoutMeta
          icon="speedometer-outline"
          value={
            workout.difficulty ||
            "Moderate"
          }
          colors={colors}
        />
      </View>

      {workout.muscleGroup && (
        <View
style={[
            styles.musclePill,
            {
              backgroundColor:
                colors.background,
            },
          ]}
        >
          <Ionicons
            name="body-outline"
            size={13}
            color={colors.subtext}
          />

          <Text
            style={[
              styles.muscleText,
              {
                color: colors.subtext,
              },
            ]}
          >
            {workout.muscleGroup}
          </Text>
        </View>
      )}

      <Pressable
        onPress={() =>
          router.push(
            "/dashboard/workout-session"
          )
        }
        style={({ pressed }) => [
          styles.workoutButton,
          {
            backgroundColor:
              colors.primary,
            opacity: pressed ? 0.7 : 1,
          },
        ]}
      >
        <Ionicons
          name="play"
          size={15}
          color="#111111"
        />

        <Text style={styles.workoutButtonText}>
          Start workout
        </Text>
      </Pressable>
    </View>
  );
}

function WorkoutMeta({
  icon,
  value,
  colors,
}: {
  icon: IconName;
  value: string;
  colors: any;
}) {
  return (
    <View style={styles.workoutMetaItem}>
      <Ionicons
        name={icon}
        size={14}
        color={colors.subtext}
      />

      <Text
        style={[
          styles.workoutMetaText,
          {
            color: colors.subtext,
          },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

function HistoryRow({
  item,
  index,
  colors,
}: {
  item: HistoryItem;
  index: number;
  colors: any;
}) {
  const title =
    item.name ||
    item.title ||
    "Workout session";

  const dateValue =
    item.completedAt ||
    item.date;

  let dateText = "Completed";

  if (dateValue) {
    const parsed = new Date(dateValue);

    if (!Number.isNaN(parsed.getTime())) {
      dateText = parsed.toLocaleDateString(
        undefined,
        {
          month: "short",
          day: "numeric",
        }
      );
    }
  }

  return (
    <View
      style={[
        styles.historyRow,
        index > 0 && {
          borderTopWidth: 1,
          borderTopColor:
            colors.border,
        },
      ]}
    >
      <View
        style={[
          styles.historyIcon,
          {
            backgroundColor:
              colors.background,
          },
        ]}
      >
        <Ionicons
          name="checkmark"
          size={17}
          color={colors.primary}
        />
      </View>

      <View style={styles.historyInfo}>
        <Text
          style={[
            styles.historyTitle,
            {
              color: colors.text,
            },
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.historyMeta,
            {
              color: colors.subtext,
            },
          ]}
        >
          {dateText}
          {item.duration
            ? ` · ${item.duration} min`
            : ""}
        </Text>
      </View>

      {item.calories ? (
        <View
          style={styles.historyCalories}
        >
          <Text
            style={[
              styles.historyCaloriesValue,
              {
                color:
                  colors.primary,
              },
            ]}
          >
            {Math.round(item.calories)}
          </Text>

          <Text
            style={[
              styles.historyCaloriesLabel,
              {
                color:
                  colors.subtext,
              },
            ]}
          >
            kcal
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    width: "100%",
    alignSelf: "center",
  },

  loading: {
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

  hero: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 18,
    marginBottom: 13,
  },

  heroTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  heroText: {
    flex: 1,
  },

  eyebrowRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  eyebrowDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 7,
  },

  eyebrow: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.3,
  },

  heroTitle: {
    fontWeight: "900",
    letterSpacing: -0.7,
  },

  heroSubtitle: {
    fontSize: 11,
    lineHeight: 17,
    marginTop: 4,
  },

  heroIcon: {
    width: 54,
    height: 54,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 15,
  },

  heroStats: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 21,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#2B2E34",
  },

  heroStat: {
    flex: 1,
    alignItems: "center",
  },

  heroStatValue: {
    fontSize: 17,
    fontWeight: "900",
    marginTop: 4,
  },

  heroStatLabel: {
    fontSize: 8,
    marginTop: 2,
  },

  statDivider: {
    width: 1,
    height: 32,
  },

  weekCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 15,
    marginBottom: 24,
  },

  weekHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: -0.3,
  },

  sectionSubtitle: {
    fontSize: 10,
    lineHeight: 16,
    marginTop: 3,
  },

  weekPercentage: {
    fontSize: 20,
    fontWeight: "900",
  },

  weekTrack: {
    height: 8,
    borderRadius: 6,
    overflow: "hidden",
    marginTop: 15,
  },

  weekFill: {
    height: "100%",
    borderRadius: 6,
  },

  weekFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 13,
  },

  goalPill: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 9,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },

  goalPillText: {
    fontSize: 8,
    fontWeight: "900",
    marginLeft: 4,
  },

  commitmentText: {
    fontSize: 9,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 11,
    marginTop: 2,
  },

  sectionText: {
    flex: 1,
    paddingRight: 10,
  },

  categoryScroll: {
    paddingBottom: 4,
    paddingRight: 12,
  },

  categoryButton: {
    height: 37,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },

  categoryText: {
    fontSize: 10,
    fontWeight: "800",
    marginLeft: 6,
  },

  workoutList: {
    marginTop: 12,
    marginBottom: 24,
  },

  workoutCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    marginBottom: 11,
  },

  workoutTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  workoutIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  recommendedBadge: {
    minHeight: 25,
    borderRadius: 8,
    paddingHorizontal: 7,
    flexDirection: "row",
    alignItems: "center",
  },

  recommendedText: {
    fontSize: 7,
    fontWeight: "900",
    letterSpacing: 0.5,
    marginLeft: 3,
  },

  workoutName: {
    fontSize: 16,
    fontWeight: "900",
    marginTop: 13,
  },

  workoutCategory: {
    fontSize: 9,
    marginTop: 3,
  },

  workoutMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 13,
  },

  workoutMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 17,
  },

  workoutMetaText: {
    fontSize: 9,
    marginLeft: 5,
  },
musclePill: {
    alignSelf: "flex-start",
    minHeight: 27,
    borderRadius: 9,
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 11,
  },

  muscleText: {
    fontSize: 8,
    marginLeft: 5,
  },

  workoutButton: {
    height: 41,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
  },

  workoutButtonText: {
    color: "#111111",
    fontSize: 10,
    fontWeight: "900",
    marginLeft: 6,
  },

  emptyCard: {
    minHeight: 210,
    borderWidth: 1,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 25,
    marginBottom: 24,
  },

  emptyIcon: {
    width: 58,
    height: 58,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "900",
    marginTop: 13,
  },

  emptyText: {
    fontSize: 10,
    lineHeight: 16,
    textAlign: "center",
    marginTop: 5,
    maxWidth: 280,
  },

  historyCard: {
    borderWidth: 1,
    borderRadius: 17,
    overflow: "hidden",
    marginBottom: 14,
  },

  historyRow: {
    minHeight: 68,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },

  historyIcon: {
    width: 37,
    height: 37,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  historyInfo: {
    flex: 1,
    minWidth: 0,
    marginLeft: 10,
  },

  historyTitle: {
    fontSize: 11,
    fontWeight: "800",
  },

  historyMeta: {
    fontSize: 8,
    marginTop: 3,
  },

  historyCalories: {
    alignItems: "flex-end",
    marginLeft: 8,
  },

  historyCaloriesValue: {
    fontSize: 12,
    fontWeight: "900",
  },

  historyCaloriesLabel: {
    fontSize: 7,
    marginTop: 2,
  },

  emptyHistory: {
    minHeight: 88,
    borderWidth: 1,
    borderRadius: 17,
    padding: 13,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  emptyHistoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyHistoryInfo: {
    flex: 1,
    marginLeft: 11,
  },

  emptyHistoryTitle: {
    fontSize: 12,
    fontWeight: "900",
  },

  emptyHistoryText: {
    fontSize: 9,
    lineHeight: 15,
    marginTop: 3,
  },

  startButton: {
    minHeight: 66,
    borderRadius: 17,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    marginTop: 3,
  },

  startButtonIcon: {
    width: 39,
    height: 39,
    borderRadius: 13,
    backgroundColor: "rgba(17,17,17,0.10)",
    alignItems: "center",
    justifyContent: "center",
  },

  startButtonText: {
    flex: 1,
    marginLeft: 10,
  },

  startButtonTitle: {
    color: "#111111",
    fontSize: 12,
    fontWeight: "900",
  },

  startButtonSubtitle: {
    color: "rgba(17,17,17,0.60)",
    fontSize: 8,
    marginTop: 3,
  },

  profileLink: {
    minHeight: 45,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  profileLinkText: {
    fontSize: 8,
    marginHorizontal: 6,
  },
});