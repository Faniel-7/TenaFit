import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import DashboardPage, { DashboardSection } from "../../components/dashboard/DashboardPage";
import { useAppData } from "../../context/AppDataContext";
import { useTheme } from "../../context/ThemeContext";
import { getWorkoutHistory } from "../../storage/workoutStorage";
import { WorkoutHistoryEntry } from "../../types/workout";

export default function ProgressScreen() {
  const { colors } = useTheme();
  const { data, goals, calorieProgress, proteinProgress, carbsProgress, fatProgress, waterProgress, stepsProgress } =
    useAppData();

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

  const progressItems = [
    {
      label: "Calories",
      value: data.calories,
      goal: goals.calories,
      progress: calorieProgress,
      unit: "kcal",
    },
    {
      label: "Protein",
      value: data.protein,
      goal: goals.protein,
      progress: proteinProgress,
      unit: "g",
    },
    {
      label: "Carbs",
      value: data.carbs,
      goal: goals.carbs,
      progress: carbsProgress,
      unit: "g",
    },
    {
      label: "Fat",
      value: data.fat,
      goal: goals.fat,
      progress: fatProgress,
      unit: "g",
    },
    {
      label: "Water",
      value: data.water,
      goal: goals.water,
      progress: waterProgress,
      unit: "L",
    },
    {
      label: "Steps",
      value: data.steps,
      goal: goals.steps,
      progress: stepsProgress,
      unit: "steps",
    },
  ];

  const styles = StyleSheet.create({
    screen: {
      backgroundColor: colors.background,
    },
    card: {
      backgroundColor: colors.card,
      borderColor: colors.border,
    },
    cardGrid: {
      gap: 12,
    },
    title: {
      color: colors.text,
    },
    subtitle: {
      color: colors.subtext,
    },
    progressTrack: {
      backgroundColor: colors.border,
    },
    progressFill: {
      backgroundColor: colors.primary,
    },
    statValue: {
      color: colors.text,
    },
    statLabel: {
      color: colors.subtext,
    },
    workoutCard: {
      backgroundColor: colors.card,
      borderColor: colors.border,
    },
    workoutName: {
      color: colors.text,
    },
    workoutMeta: {
      color: colors.subtext,
    },
    workoutStats: {
      gap: 12,
    },
    emptyText: {
      color: colors.subtext,
    },
  });

  return (
    <DashboardPage
      title="Progress"
      subtitle="Track your nutrition, activity, and workout progress."
      icon="cart"
    >
      <View style={styles.screen}>
        <DashboardSection title="Today's Progress">
          <View style={styles.cardGrid}>
            {progressItems.map((item) => {
              const percentage = Math.round(item.progress * 100);

              return (
                <View key={item.label} style={styles.card}>
                  <Text style={[styles.statLabel, styles.subtitle]}>
                    {item.label}
                  </Text>
                  <Text style={[styles.statValue, styles.title]}>
                    {item.value}
                    <Text style={[styles.statLabel, styles.subtitle]}>
                      {" "}
                      / {item.goal} {item.unit}
                    </Text>
                  </Text>

                  <View style={styles.progressTrack}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${Math.min(percentage, 100)}%`,
                        },
                      ]}
                    />
                  </View>

                  <Text style={[styles.statLabel, styles.subtitle]}>
                    {percentage}% of goal
                  </Text>
                </View>
              );
            })}
          </View>
        </DashboardSection>

        <DashboardSection title="Workout Statistics">
          <View style={styles.cardGrid}>
            <View style={styles.card}>
              <Text style={[styles.statValue, styles.title]}>
                {workoutStats.completed}
              </Text>
              <Text style={[styles.statLabel, styles.subtitle]}>
                Workouts completed
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={[styles.statValue, styles.title]}>
                {workoutStats.totalMinutes}
              </Text>
              <Text style={[styles.statLabel, styles.subtitle]}>
                Total minutes
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={[styles.statValue, styles.title]}>
                {workoutStats.totalExercises}
              </Text>
              <Text style={[styles.statLabel, styles.subtitle]}>
                Exercises completed
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={[styles.statValue, styles.title]}>
                {workoutStats.totalSteps}
              </Text>
              <Text style={[styles.statLabel, styles.subtitle]}>
                Workout steps
              </Text>
            </View>
          </View>
        </DashboardSection>

        <DashboardSection title="Workout History">
          {loading ? (
            <View style={styles.card}>
              <ActivityIndicator />
            </View>
          ) : history.length === 0 ? (
            <View style={styles.card}>
              <Text style={[styles.emptyText, styles.subtitle]}>
                No completed workouts yet. Start your first workout to build
                your history.
              </Text>
            </View>
          ) : (
            history.map((workout) => {
              const completedDate = new Date(workout.completedAt);

              return (
                <View key={workout.id} style={[styles.workoutCard, styles.card]}>
                  <View>
                    <Text style={[styles.workoutName, styles.title]}>
                      {workout.workoutName}
                    </Text>

                    <Text style={[styles.workoutMeta, styles.subtitle]}>
                      {workout.focus}
                    </Text>

                    <Text style={[styles.workoutMeta, styles.subtitle]}>
                      {completedDate.toLocaleDateString()} •{" "}
                      {completedDate.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </View>
<View style={styles.workoutStats}>
                    <View>
                      <Text style={[styles.statValue, styles.title]}>
                        {workout.duration} min
                      </Text>
                      <Text style={[styles.statLabel, styles.subtitle]}>
                        Duration
                      </Text>
                    </View>

                    <View>
                      <Text style={[styles.statValue, styles.title]}>
                        {workout.completedExercises}/
                        {workout.totalExercises}
                      </Text>
                      <Text style={[styles.statLabel, styles.subtitle]}>
                        Exercises
                      </Text>
                    </View>

                    <View>
                      <Text style={[styles.statValue, styles.title]}>
                        {workout.stepsAdded}
                      </Text>
                      <Text style={[styles.statLabel, styles.subtitle]}>
                        Steps
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </DashboardSection>
      </View>
    </DashboardPage>
  );
}