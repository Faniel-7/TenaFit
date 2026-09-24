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
import { router, useLocalSearchParams } from "expo-router";

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

type ThemeColors = {
  background: string;
  card: string;
  text: string;
  subtext: string;
  primary: string;
  border: string;
  success: string;
  danger: string;
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
  const { width } = useWindowDimensions();

  const contentWidth = Math.min(
    width > 767 ? 900 : 620,
    Math.max(width - 36, 0)
  );

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

  const exerciseProgress =
    currentExercise.sets === 0
      ? 0
      : currentCompletedSets / currentExercise.sets;

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
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        <View
          style={[
            styles.page,
            {
              width: contentWidth,
            },
          ]}
        >
          <View style={styles.finishedHeader}>
            <Text
              style={[
                styles.finishedEyebrow,
                {
                  color: colors.primary,
                },
              ]}
            >
              WORKOUT COMPLETE
            </Text>

            <Text
              style={[
                styles.finishedTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              Great work.
            </Text>

            <Text
style={[
                styles.finishedSubtitle,
                {
                  color: colors.subtext,
                },
              ]}
            >
              You completed your {selectedWorkout.name}{" "}
              session and your workout has been saved.
            </Text>
          </View>

          <View
            style={[
              styles.completionCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.completionIcon,
                {
                  backgroundColor: colors.primary,
                },
              ]}
            >
              <Ionicons
                name="trophy"
                size={38}
                color="#111111"
              />
            </View>

            <Text
              style={[
                styles.completionWorkout,
                {
                  color: colors.text,
                },
              ]}
            >
              {selectedWorkout.name}
            </Text>

            <Text
              style={[
                styles.completionFocus,
                {
                  color: colors.subtext,
                },
              ]}
            >
              {selectedWorkout.focus} ·{" "}
              {selectedWorkout.duration} minutes
            </Text>

            <View style={styles.completionStats}>
              <CompletionStat
                icon="timer-outline"
                value={`${selectedWorkout.duration}`}
                label="Minutes"
                colors={colors}
              />

              <CompletionStat
                icon="checkmark-circle-outline"
                value={`${completedTotalSets}`}
                label="Sets"
                colors={colors}
              />

              <CompletionStat
                icon="footsteps-outline"
                value={`${stepsAdded}`}
                label="Steps"
                colors={colors}
              />
            </View>

            <View
              style={[
                styles.completionMessage,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                },
              ]}
            >
              <Ionicons
                name="checkmark-circle"
                size={19}
                color={colors.success}
              />

              <Text
                style={[
                  styles.completionMessageText,
                  {
                    color: colors.subtext,
                  },
                ]}
              >
                Your workout has been added to your
                activity history.
              </Text>
            </View>

            <Pressable
              onPress={() =>
                router.replace("/dashboard/workouts")
              }
              style={({ pressed }) => [
                styles.primaryButton,
                {
                  backgroundColor: colors.primary,
                  opacity: pressed ? 0.82 : 1,
                },
              ]}
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
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.scrollContent,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <View
        style={[
styles.page,
          {
            width: contentWidth,
          },
        ]}
      >
        <View style={styles.sessionHeader}>
          <Pressable
            onPress={() =>
              router.replace("/dashboard/workouts")
            }
            style={({ pressed }) => [
              styles.exitButton,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Ionicons
              name="close"
              size={18}
              color={colors.text}
            />

            <Text
              style={[
                styles.exitText,
                {
                  color: colors.text,
                },
              ]}
            >
              Exit
            </Text>
          </Pressable>

          <View style={styles.sessionHeaderCenter}>
            <Text
              style={[
                styles.sessionEyebrow,
                {
                  color: colors.primary,
                },
              ]}
            >
              ACTIVE WORKOUT
            </Text>

            <Text
              style={[
                styles.sessionName,
                {
                  color: colors.text,
                },
              ]}
            >
              {selectedWorkout.name}
            </Text>
          </View>

          <View
            style={[
              styles.durationBadge,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons
              name="time-outline"
              size={15}
              color={colors.primary}
            />

            <Text
              style={[
                styles.durationText,
                {
                  color: colors.text,
                },
              ]}
            >
              {selectedWorkout.duration}m
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.overallCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.overallTop}>
            <View>
              <Text
                style={[
                  styles.overallEyebrow,
                  {
                    color: colors.subtext,
                  },
                ]}
              >
                SESSION PROGRESS
              </Text>

              <Text
                style={[
                  styles.overallTitle,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {completedTotalSets} of {totalSets} sets
              </Text>
            </View>

            <Text
              style={[
                styles.overallPercentage,
                {
                  color: colors.primary,
                },
              ]}
            >
              {Math.round(overallProgress * 100)}%
            </Text>
          </View>

          <View
            style={[
              styles.overallTrack,
              {
                backgroundColor: colors.background,
              },
            ]}
          >
            <View
              style={[
                styles.overallFill,
                {
                  backgroundColor: colors.primary,
                  width: `${overallProgress * 100}%`,
                },
              ]}
            />
          </View>

          <View style={styles.sessionMiniStats}>
            <MiniStat
              icon="fitness-outline"
              label="Exercises"
              value={`${completedExercises}/${selectedWorkout.exercises.length}`}
              colors={colors}
            />
<MiniStat
              icon="checkmark-done-outline"
              label="Sets"
              value={`${completedTotalSets}/${totalSets}`}
              colors={colors}
            />

            <MiniStat
              icon="footsteps-outline"
              label="Steps"
              value={`${stepsAdded}`}
              colors={colors}
            />
          </View>
        </View>

        <View style={styles.exerciseHeading}>
          <View>
            <Text
              style={[
                styles.exerciseEyebrow,
                {
                  color: colors.subtext,
                },
              ]}
            >
              EXERCISE {currentExerciseIndex + 1} OF{" "}
              {selectedWorkout.exercises.length}
            </Text>

            <Text
              style={[
                styles.exerciseHeadingTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              {currentExercise.name}
            </Text>
          </View>

          <View
            style={[
              styles.exerciseNumber,
              {
                backgroundColor: colors.primary,
              },
            ]}
          >
            <Text style={styles.exerciseNumberText}>
              {currentExerciseIndex + 1}
            </Text>
          </View>
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
          <View style={styles.exerciseTop}>
            <View
              style={[
                styles.exerciseIcon,
                {
                  backgroundColor: colors.background,
                },
              ]}
            >
              <Ionicons
                name="barbell-outline"
                size={29}
                color={colors.primary}
              />
            </View>

            <View style={styles.exerciseMainInfo}>
              <Text
                style={[
                  styles.exerciseTitle,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {currentExercise.name}
              </Text>

              <Text
                style={[
                  styles.exerciseSubtitle,
                  {
                    color: colors.subtext,
                  },
                ]}
              >
                {currentExercise.sets} sets ·{" "}
                {currentExercise.reps} reps
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.exerciseDetails,
              {
                borderColor: colors.border,
              },
            ]}
          >
            <Detail
              icon="repeat-outline"
              label="Sets"
              value={`${currentExercise.sets}`}
              colors={colors}
            />

            <Detail
              icon="flame-outline"
              label="Reps"
              value={currentExercise.reps}
              colors={colors}
            />

            <Detail
              icon="timer-outline"
              label="Rest"
              value={currentExercise.rest}
              colors={colors}
            />
          </View>

          <View style={styles.setProgressHeader}>
            <Text
              style={[
                styles.setProgressLabel,
                {
                  color: colors.subtext,
                },
              ]}
            >
              SET PROGRESS
            </Text>

            <Text
              style={[
                styles.setProgressValue,
                {
                  color: colors.text,
                },
              ]}
            >
              {currentCompletedSets}/{currentExercise.sets}
            </Text>
          </View>
<View
            style={[
              styles.setProgressTrack,
              {
                backgroundColor: colors.background,
              },
            ]}
          >
            <View
              style={[
                styles.setProgressFill,
                {
                  backgroundColor: colors.primary,
                  width: `${exerciseProgress * 100}%`,
                },
              ]}
            />
          </View>

          <View style={styles.setsRow}>
            {Array.from({
              length: currentExercise.sets,
            }).map((_, index) => {
              const complete =
                index < currentCompletedSets;
              const active =
                index === currentCompletedSets &&
                !isResting &&
                currentCompletedSets <
                  currentExercise.sets;

              return (
                <View
                  key={`${currentExercise.id}-${index}`}
                  style={[
                    styles.setIndicator,
                    {
                      backgroundColor: complete
                        ? colors.primary
                        : active
                        ? colors.background
                        : colors.background,
                      borderColor: complete
                        ? colors.primary
                        : active
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
                        {
                          color: active
                            ? colors.primary
                            : colors.subtext,
                        },
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
                  backgroundColor: colors.background,
                  borderColor: colors.primary,
                },
              ]}
            >
              <View
                style={[
                  styles.restIcon,
                  {
                    backgroundColor: colors.primary,
                  },
                ]}
              >
                <Ionicons
                  name="timer-outline"
                  size={23}
                  color="#111111"
                />
              </View>

              <View style={styles.restCopy}>
                <Text
                  style={[
                    styles.restTitle,
                    {
                      color: colors.text,
                    },
                  ]}
                >
                  Take a breather
                </Text>

                <Text
                  style={[
                    styles.restSubtitle,
                    {
                      color: colors.subtext,
                    },
                  ]}
                >
                  Rest before your next set.
                </Text>
              </View>

              <Text
                style={[
                  styles.restTimer,
                  {
                    color: colors.primary,
                  },
                ]}
              >
                {restSeconds}s
              </Text>
            </View>
          ) : (
<Pressable
              onPress={completeSet}
              disabled={
                currentCompletedSets >=
                currentExercise.sets
              }
              style={({ pressed }) => [
                styles.completeButton,
                {
                  backgroundColor:
                    currentCompletedSets >=
                    currentExercise.sets
                      ? colors.background
                      : colors.primary,
                  opacity: pressed ? 0.82 : 1,
                },
              ]}
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
                  : `Complete Set ${
                      currentCompletedSets + 1
                    }`}
              </Text>
            </Pressable>
          )}
        </View>

        <View style={styles.navigationRow}>
          <Pressable
            onPress={previousExercise}
            disabled={currentExerciseIndex === 0}
            style={({ pressed }) => [
              styles.navigationButton,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                opacity:
                  currentExerciseIndex === 0
                    ? 0.4
                    : pressed
                    ? 0.7
                    : 1,
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
                styles.navigationText,
                {
                  color: colors.text,
                },
              ]}
            >
              Previous
            </Text>
          </Pressable>

          {currentExerciseIndex <
          selectedWorkout.exercises.length - 1 ? (
            <Pressable
              onPress={nextExercise}
              disabled={
                currentCompletedSets <
                currentExercise.sets
              }
              style={({ pressed }) => [
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
                  opacity:
                    currentCompletedSets <
                    currentExercise.sets
                      ? 0.45
                      : pressed
                      ? 0.82
                      : 1,
                },
              ]}
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
                Next Exercise
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
              onPress={finishWorkout}
              disabled={
                completedTotalSets < totalSets ||
                isSaving
              }
              style={({ pressed }) => [
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
                  opacity:
                    completedTotalSets < totalSets
                      ? 0.45
                      : pressed
                      ? 0.82
                      : 1,
                },
              ]}
            >
              {isSaving ? (
                <ActivityIndicator
                  size="small"
                  color="#111111"
                />
              ) : (
                <>
                  <Text
                    style={[
                      styles.navigationText,
                      {
                        color:
                          completedTotalSets >=
                          totalSets
                            ? "#111111"
                            : colors.subtext,
                      },
                    ]}
                  >
                    Finish Workout
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
                </>
              )}
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
            name="information-circle-outline"
            size={20}
            color={colors.primary}
          />

          <View style={styles.restInfoContent}>
            <Text
              style={[
                styles.restInfoTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              Recommended rest
            </Text>

            <Text
              style={[
                styles.restInfoText,
                {
                  color: colors.subtext,
                },
              ]}
            >
              {currentExercise.rest} between sets for{" "}
              {currentExercise.name}.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

function Detail({
  icon,
  label,
  value,
  colors,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  colors: ThemeColors;
}) {
  return (
    <View style={styles.detail}>
      <Ionicons
        name={icon}
        size={16}
        color={colors.primary}
      />

      <Text
        style={[
          styles.detailLabel,
          {
            color: colors.subtext,
          },
        ]}
      >
        {label}
      </Text>

      <Text
        style={[
          styles.detailValue,
          {
            color: colors.text,
          },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}
function MiniStat({
  icon,
  label,
  value,
  colors,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  colors: ThemeColors;
}) {
  return (
    <View style={styles.miniStat}>
      <Ionicons
        name={icon}
        size={15}
        color={colors.primary}
      />

      <Text
        style={[
          styles.miniStatLabel,
          {
            color: colors.subtext,
          },
        ]}
      >
        {label}
      </Text>

      <Text
        style={[
          styles.miniStatValue,
          {
            color: colors.text,
          },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

function CompletionStat({
  icon,
  value,
  label,
  colors,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  label: string;
  colors: ThemeColors;
}) {
  return (
    <View
      style={[
        styles.completionStat,
        {
          backgroundColor: colors.background,
          borderColor: colors.border,
        },
      ]}
    >
      <Ionicons
        name={icon}
        size={18}
        color={colors.primary}
      />

      <Text
        style={[
          styles.completionStatValue,
          {
            color: colors.text,
          },
        ]}
      >
        {value}
      </Text>

      <Text
        style={[
          styles.completionStatLabel,
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

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingTop: 22,
    paddingBottom: 44,
    alignItems: "center",
  },

  page: {
    maxWidth: 900,
    alignSelf: "center",
  },

  sessionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  exitButton: {
    height: 40,
    minWidth: 62,
    borderRadius: 13,
    borderWidth: 1,
    paddingHorizontal: 11,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  exitText: {
    fontSize: 11,
    fontWeight: "800",
    marginLeft: 5,
  },

  sessionHeaderCenter: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 10,
  },

  sessionEyebrow: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.4,
  },

  sessionName: {
    fontSize: 15,
    fontWeight: "900",
    marginTop: 3,
  },

  durationBadge: {
    height: 40,
    borderRadius: 13,
    borderWidth: 1,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  durationText: {
    fontSize: 10,
    fontWeight: "800",
    marginLeft: 5,
  },

  overallCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 18,
    marginBottom: 25,
  },

  overallTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  overallEyebrow: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.2,
    marginBottom: 4,
  },

  overallTitle: {
    fontSize: 16,
    fontWeight: "900",
  },

  overallPercentage: {
    fontSize: 22,
    fontWeight: "900",
  },

  overallTrack: {
    height: 8,
    borderRadius: 8,
    overflow: "hidden",
    marginTop: 14,
  },

  overallFill: {
    height: "100%",
    borderRadius: 8,
  },

  sessionMiniStats: {
    flexDirection: "row",
    marginTop: 17,
    marginHorizontal: -5,
  },

  miniStat: {
    flex: 1,
    paddingHorizontal: 5,
  },

  miniStatLabel: {
    fontSize: 9,
    marginTop: 4,
  },

  miniStatValue: {
    fontSize: 12,
    fontWeight: "900",
    marginTop: 2,
  },

  exerciseHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 11,
  },

  exerciseEyebrow: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.2,
    marginBottom: 4,
  },

  exerciseHeadingTitle: {
    fontSize: 22,
    fontWeight: "900",
  },

  exerciseNumber: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
exerciseNumberText: {
    color: "#111111",
    fontSize: 15,
    fontWeight: "900",
  },

  exerciseCard: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 20,
    marginBottom: 12,
  },

  exerciseTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  exerciseIcon: {
    width: 58,
    height: 58,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  exerciseMainInfo: {
    flex: 1,
  },

  exerciseTitle: {
    fontSize: 20,
    fontWeight: "900",
  },

  exerciseSubtitle: {
    fontSize: 11,
    marginTop: 5,
  },

  exerciseDetails: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginTop: 18,
    paddingVertical: 14,
  },

  detail: {
    flex: 1,
    alignItems: "center",
  },

  detailLabel: {
    fontSize: 9,
    marginTop: 4,
  },

  detailValue: {
    fontSize: 11,
    fontWeight: "900",
    marginTop: 2,
    textAlign: "center",
  },

  setProgressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 18,
  },

  setProgressLabel: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,
  },

  setProgressValue: {
    fontSize: 11,
    fontWeight: "900",
  },

  setProgressTrack: {
    height: 6,
    borderRadius: 6,
    overflow: "hidden",
    marginTop: 8,
  },

  setProgressFill: {
    height: "100%",
    borderRadius: 6,
  },

  setsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 17,
    marginBottom: 18,
  },

  setIndicator: {
    width: 42,
    height: 42,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
  },

  setNumber: {
    fontSize: 12,
    fontWeight: "900",
  },

  restCard: {
    minHeight: 76,
    borderRadius: 17,
    borderWidth: 1,
    padding: 11,
    flexDirection: "row",
    alignItems: "center",
  },

  restIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  restCopy: {
    flex: 1,
    marginLeft: 11,
  },

  restTitle: {
    fontSize: 13,
    fontWeight: "900",
  },

  restSubtitle: {
    fontSize: 10,
    marginTop: 3,
  },

  restTimer: {
    fontSize: 23,
    fontWeight: "900",
    marginLeft: 8,
  },

  completeButton: {
    minHeight: 54,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  completeButtonText: {
    fontSize: 13,
    fontWeight: "900",
    marginLeft: 8,
  },

  navigationRow: {
    flexDirection: "row",
    marginBottom: 12,
  },

  navigationButton: {
    flex: 1,
    minHeight: 51,
    borderRadius: 15,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
  },

  navigationText: {
    fontSize: 11,
    fontWeight: "900",
    marginHorizontal: 7,
  },

  restInfoCard: {
    minHeight: 70,
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  restInfoContent: {
    flex: 1,
    marginLeft: 10,
  },

  restInfoTitle: {
    fontSize: 11,
    fontWeight: "900",
  },

  restInfoText: {
    fontSize: 10,
    lineHeight: 15,
    marginTop: 3,
  },

  finishedHeader: {
    marginBottom: 20,
    alignItems: "center",
  },

  finishedEyebrow: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginBottom: 8,
  },

  finishedTitle: {
    fontSize: 31,
    fontWeight: "900",
    letterSpacing: -0.7,
  },

  finishedSubtitle: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    maxWidth: 550,
    marginTop: 8,
  },

  completionCard: {
    borderWidth: 1,
    borderRadius: 25,
    padding: 22,
    alignItems: "center",
  },

  completionIcon: {
    width: 84,
    height: 84,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
  },

  completionWorkout: {
    fontSize: 22,
    fontWeight: "900",
    marginTop: 17,
  },
completionFocus: {
    fontSize: 11,
    marginTop: 5,
  },

  completionStats: {
    width: "100%",
    flexDirection: "row",
    marginTop: 24,
    marginHorizontal: -4,
  },

  completionStat: {
    flex: 1,
    minHeight: 88,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
  },

  completionStatValue: {
    fontSize: 19,
    fontWeight: "900",
    marginTop: 6,
  },

  completionStatLabel: {
    fontSize: 9,
    marginTop: 3,
  },

  completionMessage: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 15,
    padding: 13,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },

  completionMessageText: {
    flex: 1,
    fontSize: 10,
    lineHeight: 15,
    marginLeft: 8,
  },

  primaryButton: {
    width: "100%",
    minHeight: 54,
    borderRadius: 16,
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  primaryButtonText: {
    color: "#111111",
    fontSize: 13,
    fontWeight: "900",
    marginRight: 8,
  },
});