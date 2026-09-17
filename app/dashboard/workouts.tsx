import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import DashboardPage, { DashboardCard, DashboardSection } from "../../components/dashboard/DashboardPage";
import { useAppData } from "../../context/AppDataContext";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { exerciseDatabase, Exercise } from "../../data/exercises/exerciseDatabase";
import { getRecommendedExercises } from "../../logic/workoutRecommendationEngine";

type Workout = {
  id: string;
  name: string;
  focus: string;
  duration: number;
  exercises: string[];
};

const workouts: Workout[] = [
  {
    id: "full-body",
    name: "Full Body",
    focus: "Strength & conditioning",
    duration: 30,
    exercises: [
      "Bodyweight Squats",
      "Push-ups",
      "Glute Bridge",
      "Plank",
      "Mountain Climbers",
    ],
  },
  {
    id: "cardio",
    name: "Cardio",
    focus: "Heart & calorie burn",
    duration: 20,
    exercises: [
      "Jumping Jacks",
      "High Knees",
      "Mountain Climbers",
      "Burpees",
      "Fast March",
    ],
  },
  {
    id: "core",
    name: "Core",
    focus: "Core strength",
    duration: 15,
    exercises: [
      "Plank",
      "Crunches",
      "Leg Raises",
      "Dead Bug",
      "Bird Dog",
    ],
  },
];

const muscleGroups = [
  "All",
  "Full Body",
  "Chest",
  "Legs",
  "Core",
  "Glutes",
  "Calves",
  "Cardio",
];

export default function WorkoutsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { data, addSteps } = useAppData();
  const { colors } = useTheme();

  const [search, setSearch] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState("All");
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);

  const profile = useMemo(() => {
    const currentUser = user as any;
    const storedProfile = currentUser?.profile || currentUser;

    return {
      goal: storedProfile?.goal,
      activityLevel: storedProfile?.activityLevel,
      workoutDays:
        storedProfile?.workoutDays ||
        storedProfile?.weeklyWorkoutDays,
      workoutMinutes:
        storedProfile?.workoutMinutes ||
        storedProfile?.weeklyWorkoutMinutes,
    };
  }, [user]);

  const recommendedExercises = useMemo(
    () => getRecommendedExercises(exerciseDatabase, profile, 6),
    [profile]
  );

  const filteredExercises = useMemo(() => {
    const query = search.trim().toLowerCase();

    return exerciseDatabase.filter((exercise) => {
      const matchesSearch =
        !query ||
        exercise.name.toLowerCase().includes(query) ||
        exercise.muscleGroup.toLowerCase().includes(query) ||
        exercise.equipment.toLowerCase().includes(query);

      const matchesMuscle =
        selectedMuscle === "All" ||
        exercise.muscleGroup === selectedMuscle;

      return matchesSearch && matchesMuscle;
    });
  }, [search, selectedMuscle]);

  const startWorkout = (workout: Workout) => {
    router.push({
      pathname: "/dashboard/workout-session",
      params: {
        workoutId: workout.id,
      },
    });
  };

  const toggleExercise = async (exerciseId: string) => {
    if (completedExercises.includes(exerciseId)) {
      setCompletedExercises((current) =>
        current.filter((id) => id !== exerciseId)
      );
      return;
    }

    setCompletedExercises((current) => [...current, exerciseId]);
    await addSteps(250);
  };

  const getWorkoutProgress = (workout: Workout) => {
    const completed = workout.exercises.filter((exerciseName) =>
      completedExercises.includes(exerciseName)
    ).length;

    return {
      completed,
      total: workout.exercises.length,
    };
  };
const styles = StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    search: {
      backgroundColor: colors.card,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 13,
      color: colors.text,
      fontSize: 14,
      marginBottom: 14,
    },
    filterScroll: {
      marginBottom: 20,
    },
    filter: {
      paddingHorizontal: 15,
      paddingVertical: 9,
      borderRadius: 20,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      marginRight: 8,
    },
    filterActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    filterText: {
      color: colors.subtext,
      fontSize: 12,
      fontWeight: "700",
    },
    filterTextActive: {
      color: "#111111",
    },
    recommendationCard: {
      backgroundColor: colors.card,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 20,
      padding: 18,
      marginBottom: 12,
    },
    recommendationName: {
      color: colors.text,
      fontSize: 17,
      fontWeight: "800",
    },
    recommendationMeta: {
      color: colors.subtext,
      fontSize: 12,
      marginTop: 5,
    },
    recommendationReason: {
      color: colors.subtext,
      fontSize: 13,
      lineHeight: 19,
      marginTop: 10,
    },
    recommendationButton: {
      backgroundColor: colors.primary,
      borderRadius: 13,
      paddingVertical: 11,
      paddingHorizontal: 15,
      alignSelf: "flex-start",
      marginTop: 13,
    },
    recommendationButtonText: {
      color: "#111111",
      fontSize: 12,
      fontWeight: "800",
    },
    workoutCard: {
      backgroundColor: colors.card,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 20,
      padding: 18,
      marginBottom: 12,
    },
    workoutName: {
      color: colors.text,
      fontSize: 19,
      fontWeight: "800",
    },
    workoutFocus: {
      color: colors.subtext,
      fontSize: 13,
      marginTop: 5,
    },
    workoutInfo: {
      color: colors.subtext,
      fontSize: 12,
      marginTop: 10,
    },
    workoutButton: {
      backgroundColor: colors.primary,
      borderRadius: 14,
      paddingVertical: 12,
      alignItems: "center",
      marginTop: 15,
    },
    workoutButtonText: {
      color: "#111111",
      fontSize: 13,
      fontWeight: "800",
    },
    exerciseCard: {
      backgroundColor: colors.card,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 18,
      padding: 16,
      marginBottom: 10,
    },
    exerciseName: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "800",
    },
    exerciseMeta: {
      color: colors.subtext,
      fontSize: 12,
      marginTop: 4,
    },
    exerciseDescription: {
      color: colors.subtext,
      fontSize: 13,
      lineHeight: 19,
      marginTop: 10,
    },
    detailCard: {
      backgroundColor: colors.card,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 20,
      padding: 18,
      marginBottom: 20,
    },
    detailTitle: {
      color: colors.text,
      fontSize: 20,
      fontWeight: "800",
    },
    detailText: {
      color: colors.subtext,
      fontSize: 13,
      lineHeight: 20,
      marginTop: 8,
    },
    instruction: {
      color: colors.text,
      fontSize: 13,
      lineHeight: 20,
      marginTop: 7,
    },
    activityCard: {
      backgroundColor: colors.card,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 20,
      padding: 18,
      marginBottom: 20,
    },
    activityValue: {
      color: colors.text,
      fontSize: 28,
      fontWeight: "800",
    },
    activityLabel: {
color: colors.subtext,
      fontSize: 12,
      marginTop: 4,
    },
    completionCard: {
      backgroundColor: colors.primary,
      borderRadius: 20,
      padding: 20,
      marginBottom: 20,
    },
    completionTitle: {
      color: "#111111",
      fontSize: 18,
      fontWeight: "800",
    },
    completionText: {
      color: "#111111",
      fontSize: 13,
      marginTop: 6,
    },
  });

  return (
    <DashboardPage
      icon="repeat"
      title="Workouts"
      subtitle="Train smarter with workouts matched to your plan."
    >
      <View style={styles.screen}>
        <DashboardSection title="Recommended for You">
          {recommendedExercises.map((item) => (
            <View key={item.exercise.id} style={styles.recommendationCard}>
              <Text style={styles.recommendationName}>
                {item.exercise.name}
              </Text>

              <Text style={styles.recommendationMeta}>
                {item.exercise.muscleGroup} • {item.exercise.difficulty} •{" "}
                {item.exercise.equipment}
              </Text>

              <Text style={styles.recommendationReason}>
                {item.reason}
              </Text>

              <TouchableOpacity
                style={styles.recommendationButton}
                onPress={() => setSelectedExercise(item.exercise)}
              >
                <Text style={styles.recommendationButtonText}>
                  View Exercise
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </DashboardSection>

        {selectedExercise && (
          <DashboardSection title="Exercise Details">
            <View style={styles.detailCard}>
              <Text style={styles.detailTitle}>
                {selectedExercise.name}
              </Text>

              <Text style={styles.detailText}>
                {selectedExercise.description}
              </Text>

              <Text style={styles.detailText}>
                {selectedExercise.muscleGroup} •{" "}
                {selectedExercise.difficulty} •{" "}
                {selectedExercise.equipment}
              </Text>

              {selectedExercise.instructions.map((instruction, index) => (
                <Text
                  key={`${selectedExercise.id}-${index}`}
                  style={styles.instruction}
                >
                  {index + 1}. {instruction}
                </Text>
              ))}

              <TouchableOpacity
                style={styles.workoutButton}
                onPress={() => setSelectedExercise(null)}
              >
                <Text style={styles.workoutButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </DashboardSection>
        )}

        <DashboardSection title="Your Workouts">
          {workouts.map((workout) => {
            const progress = getWorkoutProgress(workout);

            return (
              <View key={workout.id} style={styles.workoutCard}>
                <Text style={styles.workoutName}>{workout.name}</Text>

                <Text style={styles.workoutFocus}>
                  {workout.focus}
                </Text>

                <Text style={styles.workoutInfo}>
                  {workout.duration} min • {progress.completed}/
                  {progress.total} exercises completed
                </Text>

                <TouchableOpacity
                  style={styles.workoutButton}
                  onPress={() => {
                    setSelectedWorkout(workout);
                    startWorkout(workout);
                  }}
                >
                  <Text style={styles.workoutButtonText}>
                    Start Workout
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </DashboardSection>

        {selectedWorkout && (
          <DashboardSection title="Current Workout">
            <View style={styles.workoutCard}>
              <Text style={styles.workoutName}>
                {selectedWorkout.name}
              </Text>
{selectedWorkout.exercises.map((exerciseName) => {
                const completed =
                  completedExercises.includes(exerciseName);

                return (
                  <TouchableOpacity
                    key={exerciseName}
                    style={styles.exerciseCard}
                    onPress={() => toggleExercise(exerciseName)}
                  >
                    <Text style={styles.exerciseName}>
                      {completed ? "✓ " : ""}
                      {exerciseName}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </DashboardSection>
        )}

        <DashboardSection title="Exercise Library">
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search exercises..."
            placeholderTextColor={colors.subtext}
            style={styles.search}
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
          >
            {muscleGroups.map((group) => {
              const active = selectedMuscle === group;

              return (
                <TouchableOpacity
                  key={group}
                  style={[
                    styles.filter,
                    active && styles.filterActive,
                  ]}
                  onPress={() => setSelectedMuscle(group)}
                >
                  <Text
                    style={[
                      styles.filterText,
                      active && styles.filterTextActive,
                    ]}
                  >
                    {group}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {filteredExercises.map((exercise) => (
            <TouchableOpacity
              key={exercise.id}
              style={styles.exerciseCard}
              onPress={() => setSelectedExercise(exercise)}
            >
              <Text style={styles.exerciseName}>
                {exercise.name}
              </Text>

              <Text style={styles.exerciseMeta}>
                {exercise.muscleGroup} • {exercise.difficulty} •{" "}
                {exercise.equipment}
              </Text>

              <Text style={styles.exerciseDescription}>
                {exercise.description}
              </Text>
            </TouchableOpacity>
          ))}
        </DashboardSection>

        <DashboardSection title="Today's Activity">
          <View style={styles.activityCard}>
            <Text style={styles.activityValue}>
              {data.steps}
            </Text>

            <Text style={styles.activityLabel}>
              Steps completed today
            </Text>
          </View>
        </DashboardSection>

        {completedExercises.length > 0 && (
          <View style={styles.completionCard}>
            <Text style={styles.completionTitle}>
              Great work!
            </Text>

            <Text style={styles.completionText}>
              You have completed {completedExercises.length} exercise
              {completedExercises.length === 1 ? "" : "s"} in this
              session.
            </Text>
          </View>
        )}
      </View>
    </DashboardPage>
  );
}