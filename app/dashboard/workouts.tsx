import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import DashboardPage, {
  DashboardCard,
  DashboardSection,
} from "../../components/dashboard/DashboardPage";
import { useAppData } from "../../context/AppDataContext";

type Exercise = {
  id: string;
  name: string;
  sets: number;
  reps: string;
  rest: string;
};

type Workout = {
  id: string;
  name: string;
  focus: string;
  duration: number;
  exercises: Exercise[];
};

const workouts: Workout[] = [
  {
    id: "full-body",
    name: "Full Body",
    focus: "Strength",
    duration: 30,
    exercises: [
      {
        id: "squats",
        name: "Bodyweight Squats",
        sets: 3,
        reps: "12",
        rest: "45 sec",
      },
      {
        id: "pushups",
        name: "Push-ups",
        sets: 3,
        reps: "10",
        rest: "45 sec",
      },
      {
        id: "lunges",
        name: "Reverse Lunges",
        sets: 3,
        reps: "10 each",
        rest: "45 sec",
      },
      {
        id: "plank",
        name: "Plank",
        sets: 3,
        reps: "30 sec",
        rest: "30 sec",
      },
    ],
  },
  {
    id: "cardio",
    name: "Cardio",
    focus: "Endurance",
    duration: 25,
    exercises: [
      {
        id: "jumping-jacks",
        name: "Jumping Jacks",
        sets: 3,
        reps: "30",
        rest: "30 sec",
      },
      {
        id: "high-knees",
        name: "High Knees",
        sets: 3,
        reps: "30 sec",
        rest: "30 sec",
      },
      {
        id: "mountain-climbers",
        name: "Mountain Climbers",
        sets: 3,
        reps: "20",
        rest: "45 sec",
      },
      {
        id: "march",
        name: "Fast March",
        sets: 3,
        reps: "60 sec",
        rest: "30 sec",
      },
    ],
  },
  {
    id: "core",
    name: "Core",
    focus: "Core",
    duration: 20,
    exercises: [
      {
        id: "crunches",
        name: "Crunches",
        sets: 3,
        reps: "15",
        rest: "30 sec",
      },
      {
        id: "leg-raises",
        name: "Leg Raises",
        sets: 3,
        reps: "10",
        rest: "30 sec",
      },
      {
        id: "plank-core",
        name: "Plank",
        sets: 3,
        reps: "30 sec",
        rest: "30 sec",
      },
      {
        id: "dead-bug",
        name: "Dead Bug",
        sets: 3,
        reps: "10 each",
        rest: "30 sec",
      },
    ],
  },
];

export default function WorkoutsScreen() {
  const { data, addSteps } = useAppData();

  const [selectedWorkout, setSelectedWorkout] =
    useState<Workout>(workouts[0]);

  const [completed, setCompleted] = useState<string[]>([]);

  const completedCount = completed.length;
  const totalExercises = selectedWorkout.exercises.length;

  const workoutProgress = useMemo(
    () =>
      totalExercises === 0
        ? 0
        : completedCount / totalExercises,
    [completedCount, totalExercises]
  );

  const toggleExercise = async (exerciseId: string) => {
    const alreadyCompleted =
      completed.includes(exerciseId);

    if (alreadyCompleted) {
      setCompleted((current) =>
        current.filter((id) => id !== exerciseId)
      );
      return;
    }

    setCompleted((current) => [
      ...current,
      exerciseId,
    ]);

    await addSteps(250);
  };

  const changeWorkout = (workout: Workout) => {
    setSelectedWorkout(workout);
    setCompleted([]);
  };

  const startWorkout = () => {
    router.push({
      pathname: "/dashboard/workout-session",
      params: {
        workoutId: selectedWorkout.id,
      },
    });
  };

  return (
    <DashboardPage
      title="Workouts"
subtitle="Move, train, and build consistency."
      icon="fitness-outline"
    >
      <DashboardSection
        title="Today's Workout"
        subtitle="Choose a workout and start your session."
      >
        <View style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <Ionicons
              name="fitness-outline"
              size={28}
              color="#FFC107"
            />
          </View>

          <View style={styles.summaryContent}>
            <Text style={styles.summaryTitle}>
              {selectedWorkout.name}
            </Text>

            <Text style={styles.summarySubtitle}>
              {selectedWorkout.focus} ·{" "}
              {selectedWorkout.duration} minutes
            </Text>

            <Text style={styles.summaryDetails}>
              {selectedWorkout.exercises.length} exercises
              {" · "}
              {selectedWorkout.exercises.reduce(
                (total, exercise) =>
                  total + exercise.sets,
                0
              )}{" "}
              sets
            </Text>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={startWorkout}
              style={styles.startButton}
            >
              <Ionicons
                name="play"
                size={17}
                color="#05070B"
              />

              <Text style={styles.startButtonText}>
                Start Workout
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </DashboardSection>

      <DashboardSection
        title="Workout Options"
        subtitle="Select the workout that fits your goal today."
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.workoutRow}
        >
          {workouts.map((workout) => {
            const active =
              selectedWorkout.id === workout.id;

            return (
              <TouchableOpacity
                key={workout.id}
                activeOpacity={0.8}
                onPress={() =>
                  changeWorkout(workout)
                }
                style={[
                  styles.workoutOption,
                  active &&
                    styles.workoutOptionActive,
                ]}
              >
                <Ionicons
                  name={
                    workout.id === "cardio"
                      ? "pulse-outline"
                      : workout.id === "core"
                      ? "body-outline"
                      : "fitness-outline"
                  }
                  size={23}
                  color={
                    active
                      ? "#05070B"
                      : "#FFC107"
                  }
                />

                <Text
                  style={[
                    styles.workoutName,
                    active &&
                      styles.workoutNameActive,
                  ]}
                >
                  {workout.name}
                </Text>

                <Text
                  style={[
                    styles.workoutDuration,
                    active &&
                      styles.workoutDurationActive,
                  ]}
                >
                  {workout.duration} min
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </DashboardSection>

      <DashboardSection
        title="Exercises"
        subtitle="Preview the exercises included in this workout."
      >
        <View style={styles.exerciseList}>
          {selectedWorkout.exercises.map(
            (exercise, index) => {
              return (
                <TouchableOpacity
                  key={exercise.id}
activeOpacity={0.8}
                  onPress={() =>
                    toggleExercise(exercise.id)
                  }
                  style={[
                    styles.exerciseCard,
                    completed.includes(
                      exercise.id
                    ) &&
                      styles.exerciseCardCompleted,
                  ]}
                >
                  <View
                    style={[
                      styles.exerciseNumber,
                      completed.includes(
                        exercise.id
                      ) &&
                        styles.exerciseNumberCompleted,
                    ]}
                  >
                    {completed.includes(
                      exercise.id
                    ) ? (
                      <Ionicons
                        name="checkmark"
                        size={18}
                        color="#05070B"
                      />
                    ) : (
                      <Text
                        style={
                          styles.exerciseNumberText
                        }
                      >
                        {index + 1}
                      </Text>
                    )}
                  </View>

                  <View style={styles.exerciseInfo}>
                    <Text
                      style={styles.exerciseName}
                    >
                      {exercise.name}
                    </Text>

                    <Text
                      style={styles.exerciseDetails}
                    >
                      {exercise.sets} sets ·{" "}
                      {exercise.reps} reps · Rest{" "}
                      {exercise.rest}
                    </Text>
                  </View>

                  <Ionicons
                    name={
                      completed.includes(
                        exercise.id
                      )
                        ? "checkmark-circle"
                        : "ellipse-outline"
                    }
                    size={22}
                    color={
                      completed.includes(
                        exercise.id
                      )
                        ? "#54D68C"
                        : "#737B89"
                    }
                  />
                </TouchableOpacity>
              );
            }
          )}
        </View>
      </DashboardSection>

      <DashboardSection
        title="Activity"
        subtitle="Your activity data for today."
      >
        <DashboardCard
          icon="walk-outline"
          title="Steps"
          description="Steps recorded today"
          value={`${Math.round(data.steps)}`}
        />

        <DashboardCard
          icon="fitness-outline"
          title="Workout progress"
          description="Exercises completed"
          value={`${Math.round(workoutProgress * 100)}%`}
        />

        <DashboardCard
          icon="time-outline"
          title="Workout duration"
          description="Selected workout"
          value={`${selectedWorkout.duration} min`}
        />
      </DashboardSection>

      {workoutProgress >= 1 && (
        <View style={styles.completeCard}>
          <View style={styles.completeIcon}>
            <Ionicons
              name="trophy-outline"
              size={27}
              color="#54D68C"
            />
          </View>

          <View style={styles.completeContent}>
            <Text style={styles.completeTitle}>
              Workout completed!
            </Text>

            <Text style={styles.completeText}>
              Great work. Keep building your
              consistency.
            </Text>
          </View>
        </View>
      )}
    </DashboardPage>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    minHeight: 170,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#242A34",
    backgroundColor: "#10141B",
    padding: 17,
    flexDirection: "row",
    alignItems: "flex-start",
  },
summaryIcon: {
    width: 58,
    height: 58,
    borderRadius: 17,
    backgroundColor: "#1D1B14",
    alignItems: "center",
    justifyContent: "center",
  },

  summaryContent: {
    flex: 1,
    marginLeft: 15,
  },

  summaryTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },

  summarySubtitle: {
    color: "#737B89",
    fontSize: 10,
    fontWeight: "700",
    marginTop: 4,
  },

  summaryDetails: {
    color: "#AEB5C1",
    fontSize: 9,
    marginTop: 8,
  },

  startButton: {
    height: 42,
    borderRadius: 12,
    backgroundColor: "#FFC107",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
    marginTop: 14,
    alignSelf: "flex-start",
  },

  startButtonText: {
    color: "#05070B",
    fontSize: 11,
    fontWeight: "900",
    marginLeft: 7,
  },

  workoutRow: {
    gap: 10,
    paddingBottom: 4,
  },

  workoutOption: {
    width: 135,
    minHeight: 105,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#242A34",
    backgroundColor: "#10141B",
    padding: 14,
    justifyContent: "space-between",
  },

  workoutOptionActive: {
    backgroundColor: "#FFC107",
    borderColor: "#FFC107",
  },

  workoutName: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
    marginTop: 10,
  },

  workoutNameActive: {
    color: "#05070B",
  },

  workoutDuration: {
    color: "#737B89",
    fontSize: 9,
    fontWeight: "700",
  },

  workoutDurationActive: {
    color: "#302600",
  },

  exerciseList: {
    gap: 9,
  },

  exerciseCard: {
    minHeight: 76,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#242A34",
    backgroundColor: "#10141B",
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  exerciseCardCompleted: {
    borderColor: "#315B46",
    backgroundColor: "#101914",
  },

  exerciseNumber: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#1D1B14",
    alignItems: "center",
    justifyContent: "center",
  },

  exerciseNumberCompleted: {
    backgroundColor: "#54D68C",
  },

  exerciseNumberText: {
    color: "#FFC107",
    fontSize: 13,
    fontWeight: "900",
  },

  exerciseInfo: {
    flex: 1,
    marginHorizontal: 12,
  },

  exerciseName: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
  },

  exerciseDetails: {
    color: "#737B89",
    fontSize: 9,
    marginTop: 5,
  },

  completeCard: {
    minHeight: 82,
    marginTop: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#315B46",
    backgroundColor: "#101914",
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  completeIcon: {
    width: 49,
    height: 49,
    borderRadius: 14,
    backgroundColor: "#17261D",
    alignItems: "center",
    justifyContent: "center",
  },

  completeContent: {
    flex: 1,
    marginLeft: 13,
  },

  completeTitle: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },

  completeText: {
    color: "#737B89",
    fontSize: 10,
    marginTop: 4,
  },
});