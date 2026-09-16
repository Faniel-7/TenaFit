import React, { useEffect, useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

import DashboardPage from "../../components/dashboard/DashboardPage";
import { useAppData } from "../../context/AppDataContext";
import { useTheme } from "../../context/ThemeContext";
import { saveWorkoutHistory } from "../../storage/workoutStorage";

type WorkoutExercise = {
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
  exercises: WorkoutExercise[];
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

export default function WorkoutSessionScreen() {
  const { workoutId } = useLocalSearchParams<{
    workoutId?: string;
  }>();

  const { addSteps } = useAppData();
  const { colors } = useTheme();

  const selectedWorkout = useMemo(
    () =>
      workouts.find(
        (workout) => workout.id === workoutId
      ) || workouts[0],
    [workoutId]
  );

  const [currentExerciseIndex, setCurrentExerciseIndex] =
    useState(0);

  const [completedSets, setCompletedSets] = useState<
    Record<string, number>
  >({});

  const [restSeconds, setRestSeconds] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const currentExercise =
    selectedWorkout.exercises[currentExerciseIndex];

  const currentCompletedSets =
    completedSets[currentExercise.id] || 0;

  const totalSets = selectedWorkout.exercises.reduce(
    (total, exercise) => total + exercise.sets,
    0
  );

  const completedTotalSets = Object.values(
    completedSets
  ).reduce((total, value) => total + value, 0);

  const completedExercises =
    selectedWorkout.exercises.filter(
      (exercise) =>
        (completedSets[exercise.id] || 0) >= exercise.sets
    ).length;

  const overallProgress =
    totalSets === 0
      ? 0
      : completedTotalSets / totalSets;
const stepsAdded = Math.max(
    250,
    Math.round(selectedWorkout.duration * 10)
  );

  useEffect(() => {
    if (!isResting || restSeconds <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setRestSeconds((current) => {
        if (current <= 1) {
          clearInterval(timer);
          setIsResting(false);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isResting, restSeconds]);

  const completeSet = () => {
    if (isResting) {
      return;
    }

    if (
      currentCompletedSets >= currentExercise.sets
    ) {
      return;
    }

    const nextCompleted =
      currentCompletedSets + 1;

    setCompletedSets((current) => ({
      ...current,
      [currentExercise.id]: nextCompleted,
    }));

    if (nextCompleted < currentExercise.sets) {
      const parsedRest = parseInt(
        currentExercise.rest,
        10
      );

      if (Number.isFinite(parsedRest)) {
        setRestSeconds(parsedRest);
        setIsResting(true);
      }
    }
  };

  const nextExercise = () => {
    if (
      currentExerciseIndex <
      selectedWorkout.exercises.length - 1
    ) {
      setCurrentExerciseIndex(
        currentExerciseIndex + 1
      );
      setIsResting(false);
      setRestSeconds(0);
    }
  };

  const previousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(
        currentExerciseIndex - 1
      );
      setIsResting(false);
      setRestSeconds(0);
    }
  };

  const finishWorkout = async () => {
    if (
      isFinished ||
      isSaving ||
      completedTotalSets < totalSets
    ) {
      return;
    }

    setIsSaving(true);

    try {
      await addSteps(stepsAdded);

      await saveWorkoutHistory({
        id: `${selectedWorkout.id}-${Date.now()}`,
        workoutId: selectedWorkout.id,
        workoutName: selectedWorkout.name,
        focus: selectedWorkout.focus,
        duration: selectedWorkout.duration,
        completedSets: completedTotalSets,
        totalSets,
        completedExercises,
        totalExercises:
          selectedWorkout.exercises.length,
        stepsAdded,
        completedAt: new Date().toISOString(),
      });

      setIsFinished(true);
      setIsResting(false);
      setRestSeconds(0);
    } finally {
      setIsSaving(false);
    }
  };

  if (isFinished) {
    return (
      <DashboardPage
        title="Workout Complete"
        subtitle="Your workout has been saved."
        icon="trophy-outline"
      >
        <View
          style={[
            styles.finishedContainer,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.finishedIcon,
              {
                backgroundColor: colors.primary,
              },
            ]}
          >
            <Ionicons
              name="trophy"
              size={42}
              color="#111111"
            />
          </View>

          <Text
            style={[
              styles.finishedTitle,
              { color: colors.text },
            ]}
          >
            Great work!
          </Text>

          <Text
            style={[
              styles.finishedSubtitle,
              { color: colors.subtext },
            ]}
          >
            Your {selectedWorkout.name} workout has been
            recorded in your workout history.
          </Text>

          <View style={styles.finishedStats}>
            <View
              style={[
                styles.finishedStat,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.finishedStatValue,
                  { color: colors.text },
                ]}
              >
                {selectedWorkout.duration}
              </Text>
<Text
                style={[
                  styles.finishedStatLabel,
                  { color: colors.subtext },
                ]}
              >
                minutes
              </Text>
            </View>

            <View
              style={[
                styles.finishedStat,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.finishedStatValue,
                  { color: colors.text },
                ]}
              >
                {completedTotalSets}
              </Text>

              <Text
                style={[
                  styles.finishedStatLabel,
                  { color: colors.subtext },
                ]}
              >
                sets
              </Text>
            </View>

            <View
              style={[
                styles.finishedStat,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.finishedStatValue,
                  { color: colors.text },
                ]}
              >
                {stepsAdded}
              </Text>

              <Text
                style={[
                  styles.finishedStatLabel,
                  { color: colors.subtext },
                ]}
              >
                steps
              </Text>
            </View>
          </View>

          <Pressable
            style={[
              styles.primaryButton,
              {
                backgroundColor: colors.primary,
              },
            ]}
            onPress={() =>
              router.replace("/dashboard/workouts")
            }
          >
            <Text style={styles.primaryButtonText}>
              Back to Workouts
            </Text>

            <Ionicons
              name="arrow-forward"
              size={18}
              color="#111111"
            />
          </Pressable>
        </View>
      </DashboardPage>
    );
  }

  return (
    <DashboardPage
      title={selectedWorkout.name}
      subtitle={`${selectedWorkout.focus} · ${selectedWorkout.duration} minutes`}
      icon="fitness-outline"
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.topActions}>
          <Pressable
            style={[
              styles.backButton,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
            onPress={() =>
              router.replace("/dashboard/workouts")
            }
          >
            <Ionicons
              name="chevron-back"
              size={18}
              color={colors.text}
            />

            <Text
              style={[
                styles.backText,
                { color: colors.text },
              ]}
            >
              Exit
            </Text>
          </Pressable>

          <Text
            style={[
              styles.sessionLabel,
              { color: colors.subtext },
            ]}
          >
            WORKOUT SESSION
          </Text>
        </View>

        <View
          style={[
            styles.progressCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.progressHeader}>
            <View>
              <Text
                style={[
                  styles.progressTitle,
                  { color: colors.text },
                ]}
              >
                Session progress
              </Text>
<Text
                style={[
                  styles.progressSubtitle,
                  { color: colors.subtext },
                ]}
              >
                {completedTotalSets} of {totalSets} sets
              </Text>
            </View>

            <Text
              style={[
                styles.progressPercentage,
                { color: colors.primary },
              ]}
            >
              {Math.round(overallProgress * 100)}%
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
                  width: `${overallProgress * 100}%`,
                  backgroundColor: colors.primary,
                },
              ]}
            />
          </View>
        </View>

        <View style={styles.exercisePosition}>
          <Text
            style={[
              styles.positionText,
              { color: colors.subtext },
            ]}
          >
            EXERCISE {currentExerciseIndex + 1} OF{" "}
            {selectedWorkout.exercises.length}
          </Text>
        </View>

        <View
          style={[
            styles.exerciseCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.exerciseIcon,
              {
                backgroundColor: `${colors.primary}18`,
              },
            ]}
          >
            <Ionicons
              name="barbell-outline"
              size={30}
              color={colors.primary}
            />
          </View>

          <Text
            style={[
              styles.exerciseTitle,
              { color: colors.text },
            ]}
          >
            {currentExercise.name}
          </Text>

          <Text
            style={[
              styles.exerciseSubtitle,
              { color: colors.subtext },
            ]}
          >
            {currentExercise.sets} sets ·{" "}
            {currentExercise.reps} reps
          </Text>

          <View style={styles.setsRow}>
            {Array.from({
              length: currentExercise.sets,
            }).map((_, index) => {
              const complete =
                index < currentCompletedSets;

              return (
                <View
                  key={`${currentExercise.id}-set-${index}`}
                  style={[
                    styles.setIndicator,
                    {
                      backgroundColor: complete
                        ? colors.primary
                        : colors.background,
                      borderColor: complete
                        ? colors.primary
                        : colors.border,
                    },
                  ]}
                >
                  {complete ? (
                    <Ionicons
                      name="checkmark"
                      size={17}
                      color="#111111"
                    />
                  ) : (
                    <Text
                      style={[
                        styles.setNumber,
                        { color: colors.subtext },
                      ]}
                    >
                      {index + 1}
                    </Text>
                  )}
                </View>
              );
            })}
          </View>

          {isResting ? (
            <View
              style={[
                styles.restCard,
                {
                  backgroundColor: `${colors.primary}12`,
                  borderColor: `${colors.primary}40`,
                },
              ]}
            >
              <Ionicons
                name="timer-outline"
                size={26}
                color={colors.primary}
              />
<View style={styles.restInfo}>
                <Text
                  style={[
                    styles.restTitle,
                    { color: colors.text },
                  ]}
                >
                  Rest
                </Text>

                <Text
                  style={[
                    styles.restSubtitle,
                    { color: colors.subtext },
                  ]}
                >
                  Take a short break before the next set.
                </Text>
              </View>

              <Text
                style={[
                  styles.restTimer,
                  { color: colors.primary },
                ]}
              >
                {restSeconds}s
              </Text>
            </View>
          ) : (
            <Pressable
              style={[
                styles.completeButton,
                {
                  backgroundColor:
                    currentCompletedSets >=
                    currentExercise.sets
                      ? colors.border
                      : colors.primary,
                },
              ]}
              onPress={completeSet}
              disabled={
                currentCompletedSets >=
                currentExercise.sets
              }
            >
              <Ionicons
                name={
                  currentCompletedSets >=
                  currentExercise.sets
                    ? "checkmark-circle"
                    : "checkmark"
                }
                size={21}
                color={
                  currentCompletedSets >=
                  currentExercise.sets
                    ? colors.subtext
                    : "#111111"
                }
              />

              <Text
                style={[
                  styles.completeButtonText,
                  {
                    color:
                      currentCompletedSets >=
                      currentExercise.sets
                        ? colors.subtext
                        : "#111111",
                  },
                ]}
              >
                {currentCompletedSets >=
                currentExercise.sets
                  ? "Exercise Complete"
                  : `Complete Set ${currentCompletedSets + 1}`}
              </Text>
            </Pressable>
          )}
        </View>

        <View style={styles.navigationRow}>
          <Pressable
            style={[
              styles.navigationButton,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                opacity:
                  currentExerciseIndex === 0 ? 0.45 : 1,
              },
            ]}
            disabled={currentExerciseIndex === 0}
            onPress={previousExercise}
          >
            <Ionicons
              name="arrow-back"
              size={18}
              color={colors.text}
            />

            <Text
              style={[
                styles.navigationText,
                { color: colors.text },
              ]}
            >
              Previous
            </Text>
          </Pressable>

          {currentExerciseIndex <
          selectedWorkout.exercises.length - 1 ? (
            <Pressable
              style={[
                styles.navigationButton,
                {
                  backgroundColor:
                    currentCompletedSets >=
                    currentExercise.sets
                      ? colors.primary
                      : colors.card,
                  borderColor:
                    currentCompletedSets >=
                    currentExercise.sets
                      ? colors.primary
                      : colors.border,
                },
]}
              disabled={
                currentCompletedSets <
                currentExercise.sets
              }
              onPress={nextExercise}
            >
              <Text
                style={[
                  styles.navigationText,
                  {
                    color:
                      currentCompletedSets >=
                      currentExercise.sets
                        ? "#111111"
                        : colors.subtext,
                  },
                ]}
              >
                Next
              </Text>

              <Ionicons
                name="arrow-forward"
                size={18}
                color={
                  currentCompletedSets >=
                  currentExercise.sets
                    ? "#111111"
                    : colors.subtext
                }
              />
            </Pressable>
          ) : (
            <Pressable
              style={[
                styles.navigationButton,
                {
                  backgroundColor:
                    completedTotalSets >= totalSets
                      ? colors.primary
                      : colors.card,
                  borderColor:
                    completedTotalSets >= totalSets
                      ? colors.primary
                      : colors.border,
                },
              ]}
              disabled={
                completedTotalSets < totalSets ||
                isSaving
              }
              onPress={finishWorkout}
            >
              <Text
                style={[
                  styles.navigationText,
                  {
                    color:
                      completedTotalSets >= totalSets
                        ? "#111111"
                        : colors.subtext,
                  },
                ]}
              >
                {isSaving ? "Saving..." : "Finish"}
              </Text>

              <Ionicons
                name="trophy-outline"
                size={18}
                color={
                  completedTotalSets >= totalSets
                    ? "#111111"
                    : colors.subtext
                }
              />
            </Pressable>
          )}
        </View>

        <View
          style={[
            styles.restInfoCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Ionicons
            name="time-outline"
            size={21}
            color={colors.primary}
          />

          <View style={styles.restInfoContent}>
            <Text
              style={[
                styles.restInfoTitle,
                { color: colors.text },
              ]}
            >
              Rest between sets
            </Text>

            <Text
              style={[
                styles.restInfoText,
                { color: colors.subtext },
              ]}
            >
              {currentExercise.rest} recommended rest for
              this exercise.
            </Text>
          </View>
        </View>
      </ScrollView>
    </DashboardPage>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 30,
  },

  topActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  backButton: {
    height: 38,
    paddingHorizontal: 11,
    borderRadius: 11,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  backText: {
    fontSize: 10,
    fontWeight: "800",
    marginLeft: 3,
  },

  sessionLabel: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,
  },

  progressCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
  },

  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  progressTitle: {
    fontSize: 13,
    fontWeight: "900",
  },

  progressSubtitle: {
    fontSize: 9,
    marginTop: 4,
  },
progressPercentage: {
    fontSize: 19,
    fontWeight: "900",
  },

  progressTrack: {
    height: 8,
    borderRadius: 8,
    overflow: "hidden",
    marginTop: 13,
  },

  progressFill: {
    height: "100%",
    borderRadius: 8,
  },

  exercisePosition: {
    marginTop: 24,
    marginBottom: 9,
  },

  positionText: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,
  },

  exerciseCard: {
    borderRadius: 21,
    borderWidth: 1,
    padding: 20,
    alignItems: "center",
  },

  exerciseIcon: {
    width: 66,
    height: 66,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  exerciseTitle: {
    fontSize: 21,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 15,
  },

  exerciseSubtitle: {
    fontSize: 11,
    marginTop: 6,
  },

  setsRow: {
    flexDirection: "row",
    gap: 9,
    marginTop: 22,
    marginBottom: 18,
  },

  setIndicator: {
    width: 40,
    height: 40,
    borderRadius: 13,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  setNumber: {
    fontSize: 12,
    fontWeight: "900",
  },

  completeButton: {
    width: "100%",
    minHeight: 52,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  completeButtonText: {
    fontSize: 12,
    fontWeight: "900",
    marginLeft: 8,
  },

  restCard: {
    width: "100%",
    minHeight: 76,
    borderRadius: 15,
    borderWidth: 1,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  restInfo: {
    flex: 1,
    marginLeft: 10,
  },

  restTitle: {
    fontSize: 12,
    fontWeight: "900",
  },

  restSubtitle: {
    fontSize: 9,
    marginTop: 3,
  },

  restTimer: {
    fontSize: 22,
    fontWeight: "900",
  },

  navigationRow: {
    flexDirection: "row",
    gap: 9,
    marginTop: 12,
  },

  navigationButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  navigationText: {
    fontSize: 11,
    fontWeight: "900",
    marginHorizontal: 7,
  },

  restInfoCard: {
    minHeight: 76,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },

  restInfoContent: {
    flex: 1,
    marginLeft: 11,
  },

  restInfoTitle: {
    fontSize: 11,
    fontWeight: "900",
  },

  restInfoText: {
    fontSize: 9,
    lineHeight: 14,
    marginTop: 4,
  },

  finishedContainer: {
    borderRadius: 23,
    borderWidth: 1,
    padding: 24,
    alignItems: "center",
  },

  finishedIcon: {
    width: 88,
    height: 88,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },

  finishedTitle: {
    fontSize: 26,
    fontWeight: "900",
    marginTop: 18,
  },

  finishedSubtitle: {
    fontSize: 11,
    lineHeight: 17,
    textAlign: "center",
    marginTop: 7,
  },

  finishedStats: {
    width: "100%",
    flexDirection: "row",
    gap: 8,
    marginTop: 25,
  },

  finishedStat: {
    flex: 1,
    minHeight: 83,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  finishedStatValue: {
    fontSize: 18,
    fontWeight: "900",
  },

  finishedStatLabel: {
    fontSize: 8,
    marginTop: 4,
  },

  primaryButton: {
    width: "100%",
    minHeight: 52,
    borderRadius: 15,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  primaryButtonText: {
    color: "#111111",
    fontSize: 12,
    fontWeight: "900",
    marginRight: 8,
  },
});