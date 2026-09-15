import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DashboardPage, {
  DashboardCard,
  DashboardSection,
} from "../../components/dashboard/DashboardPage";
import { useAppData } from "../../context/AppDataContext";
import { useTheme } from "../../context/ThemeContext";
import {
  exerciseDatabase,
  searchExercises,
  type Exercise,
} from "../../data/exercises/exerciseDatabase";

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
  const { data, addSteps } = useAppData();
  const { colors } = useTheme();

  const [selectedWorkout, setSelectedWorkout] =
    useState<Workout>(workouts[0]);

  const [completed, setCompleted] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [selectedMuscle, setSelectedMuscle] =
    useState("All");
  const [selectedExercise, setSelectedExercise] =
    useState<Exercise | null>(null);

  const completedCount = completed.length;
  const totalExercises = selectedWorkout.exercises.length;

  const workoutProgress =
    totalExercises === 0
      ? 0
      : completedCount / totalExercises;

  const filteredExercises = useMemo(() => {
    const searched = searchExercises(search);

    if (selectedMuscle === "All") {
      return searched;
    }

    return searched.filter(
      (exercise) =>
        exercise.muscleGroup === selectedMuscle
    );
  }, [search, selectedMuscle]);

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

  return (
    <DashboardPage
      title="Workouts"
      subtitle="Move, train, and build consistency."
      icon="fitness-outline"
    >
      <DashboardSection
        title="Today's workout"
        subtitle="Choose a workout and complete each exercise."
      >
        <View
          style={[
            styles.summaryCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.summaryIcon,
              {
                backgroundColor: `${colors.primary}18`,
              },
            ]}
          >
            <Ionicons
              name="fitness-outline"
              size={28}
              color={colors.primary}
            />
          </View>

          <View style={styles.summaryContent}>
            <Text
              style={[
                styles.summaryTitle,
                { color: colors.text },
              ]}
            >
              {selectedWorkout.name}
            </Text>

            <Text
              style={[
                styles.summarySubtitle,
                { color: colors.subtext },
              ]}
            >
              {selectedWorkout.focus} ·{" "}
              {selectedWorkout.duration} minutes
            </Text>

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
                    width: `${workoutProgress * 100}%`,
                    backgroundColor: colors.primary,
                  },
                ]}
              />
            </View>

            <Text
              style={[
                styles.progressText,
                { color: colors.subtext },
              ]}
            >
              {completedCount} of {totalExercises} exercises
              completed
            </Text>
          </View>
        </View>
      </DashboardSection>

      <DashboardSection
        title="Workout options"
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
                onPress={() => changeWorkout(workout)}
                style={[
                  styles.workoutOption,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                  active && {
                    backgroundColor: colors.primary,
                    borderColor: colors.primary,
                  },
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
                      ? "#111111"
                      : colors.primary
                  }
                />

                <Text
                  style={[
                    styles.workoutName,
                    { color: colors.text },
                    active && {
                      color: "#111111",
                    },
                  ]}
                >
                  {workout.name}
                </Text>
                <Text
                  style={[
                    styles.workoutDuration,
                    { color: colors.subtext },
                    active && {
                      color: "#302600",
                    },
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
        title="Your workout"
        subtitle="Complete each exercise to finish today's session."
      >
        <View style={styles.exerciseList}>
          {selectedWorkout.exercises.map(
            (exercise, index) => {
              const isCompleted =
                completed.includes(exercise.id);

              return (
                <TouchableOpacity
                  key={exercise.id}
                  activeOpacity={0.8}
                  onPress={() =>
                    toggleExercise(exercise.id)
                  }
                  style={[
                    styles.exerciseCard,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                    isCompleted && {
                      borderColor: colors.success,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.exerciseNumber,
                      {
                          backgroundColor: `${colors.primary}18`,
                      },
                      isCompleted && {
                        backgroundColor:
                          colors.success,
                      },
                    ]}
                  >
                    {isCompleted ? (
                      <Ionicons
                        name="checkmark"
                        size={18}
                        color="#111111"
                      />
                    ) : (
                      <Text
                        style={[
                          styles.exerciseNumberText,
                          { color: colors.primary },
                        ]}
                      >
                        {index + 1}
                      </Text>
                    )}
                  </View>

                  <View style={styles.exerciseInfo}>
                    <Text
                      style={[
                        styles.exerciseName,
                        { color: colors.text },
                      ]}
                    >
                      {exercise.name}
                    </Text>

                    <Text
                      style={[
                        styles.exerciseDetails,
                        { color: colors.subtext },
                      ]}
                    >
                      {exercise.sets} sets ·{" "}
                      {exercise.reps} reps · Rest{" "}
                      {exercise.rest}
                    </Text>
                  </View>

                  <Ionicons
                    name={
                      isCompleted
                        ? "checkmark-circle"
                        : "ellipse-outline"
                    }
                    size={22}
                    color={
                      isCompleted
                        ? colors.success
                        : colors.subtext
                    }
                  />
                </TouchableOpacity>
              );
            }
          )}
        </View>
      </DashboardSection>

      <DashboardSection
        title="Exercise library"
        subtitle="Explore exercises and learn how to perform them."
      >
        <View
          style={[
            styles.searchContainer,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Ionicons
            name="search-outline"
            size={19}
            color={colors.subtext}
          />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search exercises..."
            placeholderTextColor={colors.subtext}
            style={[
              styles.searchInput,
              { color: colors.text },
            ]}
          />

          {search.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearch("")}
            >
              <Ionicons
                name="close-circle"
                size={19}
                color={colors.subtext}
              />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {muscleGroups.map((group) => {
            const active = selectedMuscle === group;

            return (
              <TouchableOpacity
                key={group}
                onPress={() => setSelectedMuscle(group)}
                style={[
                  styles.filterButton,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                  active && {
                    backgroundColor: colors.primary,
                    borderColor: colors.primary,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    { color: colors.subtext },
                    active && {
                      color: "#111111",
                    },
                  ]}
                >
                  {group}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.libraryList}>
          {filteredExercises.map((exercise) => (
            <TouchableOpacity
              key={exercise.id}
              activeOpacity={0.8}
              onPress={() =>
                setSelectedExercise(exercise)
              }
              style={[
                styles.libraryCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.libraryIcon,
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

              <View style={styles.libraryInfo}>
                <Text
                  style={[
                    styles.libraryName,
                    { color: colors.text },
                  ]}
                >
                  {exercise.name}
                </Text>

                <Text
                  style={[
                    styles.libraryMeta,
                    { color: colors.subtext },
                  ]}
                >
                  {exercise.muscleGroup} ·{" "}
                  {exercise.difficulty} ·{" "}
                  {exercise.equipment}
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={18}
                color={colors.subtext}
              />
            </TouchableOpacity>
          ))}

          {filteredExercises.length === 0 && (
            <View
              style={[
                styles.emptyLibrary,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <Ionicons
                name="search-outline"
                size={25}
                color={colors.subtext}
              />
              <Text
                style={[
                  styles.emptyTitle,
                  { color: colors.text },
                ]}
              >
                No exercises found
              </Text>

              <Text
                style={[
                  styles.emptyText,
                  { color: colors.subtext },
                ]}
              >
                Try another exercise or muscle group.
              </Text>
            </View>
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
        <View
          style={[
            styles.completeCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.success,
            },
          ]}
        >
          <View
            style={[
              styles.completeIcon,
              {
                backgroundColor: `${colors.success}18`,
              },
            ]}
          >
            <Ionicons
              name="trophy-outline"
              size={27}
              color={colors.success}
            />
          </View>

          <View style={styles.completeContent}>
            <Text
              style={[
                styles.completeTitle,
                { color: colors.text },
              ]}
            >
              Workout completed!
            </Text>

            <Text
              style={[
                styles.completeText,
                { color: colors.subtext },
              ]}
            >
              Great work. Keep building your consistency.
            </Text>
          </View>
        </View>
      )}

      {selectedExercise && (
        <View
          style={[
            styles.detailCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.detailHeader}>
            <View style={styles.detailHeading}>
              <View
                style={[
                  styles.detailIcon,
                  {
                      backgroundColor: `${colors.primary}18`,
                  },
                ]}
              >
                <Ionicons
                  name="barbell-outline"
                  size={22}
                  color={colors.primary}
                />
              </View>

              <View style={styles.detailTitleContainer}>
                <Text
                  style={[
                    styles.detailTitle,
                    { color: colors.text },
                  ]}
                >
                  {selectedExercise.name}
                </Text>

                <Text
                  style={[
                    styles.detailMeta,
                    { color: colors.subtext },
                  ]}
                >
                  {selectedExercise.muscleGroup} ·{" "}
                  {selectedExercise.difficulty}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => setSelectedExercise(null)}
            >
              <Ionicons
                name="close-circle"
                size={25}
                color={colors.subtext}
              />
            </TouchableOpacity>
          </View>
<Text
            style={[
              styles.detailDescription,
              { color: colors.subtext },
            ]}
          >
            {selectedExercise.description}
          </Text>

          <Text
            style={[
              styles.instructionsTitle,
              { color: colors.text },
            ]}
          >
            How to do it
          </Text>

          <View style={styles.instructionsList}>
            {selectedExercise.instructions.map(
              (instruction, index) => (
                <View
                  key={`${selectedExercise.id}-${index}`}
                  style={styles.instructionRow}
                >
                  <View
                    style={[
                      styles.instructionNumber,
                      {
                        backgroundColor:
                          colors.primary,
                      },
                    ]}
                  >
                    <Text style={styles.instructionNumberText}>
                      {index + 1}
                    </Text>
                  </View>

                  <Text
                    style={[
                      styles.instructionText,
                      { color: colors.subtext },
                    ]}
                  >
                    {instruction}
                  </Text>
                </View>
              )
            )}
          </View>
        </View>
      )}
    </DashboardPage>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    minHeight: 130,
    borderRadius: 18,
    borderWidth: 1,
    padding: 17,
    flexDirection: "row",
    alignItems: "center",
  },

  summaryIcon: {
    width: 58,
    height: 58,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },

  summaryContent: {
    flex: 1,
    marginLeft: 15,
  },

  summaryTitle: {
    fontSize: 17,
    fontWeight: "900",
  },

  summarySubtitle: {
    fontSize: 10,
    fontWeight: "700",
    marginTop: 4,
  },

  progressTrack: {
    height: 7,
    borderRadius: 7,
    overflow: "hidden",
    marginTop: 13,
  },

  progressFill: {
    height: "100%",
    borderRadius: 7,
  },

  progressText: {
    fontSize: 9,
    marginTop: 6,
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
    padding: 14,
    justifyContent: "space-between",
  },

  workoutName: {
    fontSize: 13,
    fontWeight: "900",
    marginTop: 10,
  },

  workoutDuration: {
    fontSize: 9,
    fontWeight: "700",
  },

  exerciseList: {
    gap: 9,
  },

  exerciseCard: {
    minHeight: 76,
    borderRadius: 16,
    borderWidth: 1,
    padding: 13,
    flexDirection: "row",
    alignItems: "center",
  },

  exerciseNumber: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  exerciseNumberText: {
    fontSize: 13,
    fontWeight: "900",
  },

  exerciseInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 10,
  },

  exerciseName: {
    fontSize: 12,
    fontWeight: "900",
  },

  exerciseDetails: {
    fontSize: 9,
    marginTop: 5,
  },

  searchContainer: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
  },

  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 12,
    marginLeft: 9,
  },

  filterRow: {
    gap: 8,
    paddingVertical: 12,
  },

  filterButton: {
    paddingHorizontal: 13,
    height: 34,
    borderRadius: 11,
    borderWidth: 1,
    justifyContent: "center",
  },

  filterText: {
    fontSize: 10,
    fontWeight: "800",
  },

  libraryList: {
    gap: 8,
  },

  libraryCard: {
    minHeight: 68,
    borderRadius: 15,
    borderWidth: 1,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  libraryIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
libraryInfo: {
    flex: 1,
    marginLeft: 11,
    marginRight: 8,
  },

  libraryName: {
    fontSize: 12,
    fontWeight: "900",
  },

  libraryMeta: {
    fontSize: 9,
    marginTop: 4,
  },

  emptyLibrary: {
    minHeight: 120,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
  },

  emptyTitle: {
    fontSize: 13,
    fontWeight: "900",
    marginTop: 8,
  },

  emptyText: {
    fontSize: 10,
    marginTop: 4,
  },

  completeCard: {
    minHeight: 92,
    borderRadius: 18,
    borderWidth: 1,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  completeIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  completeContent: {
    flex: 1,
    marginLeft: 13,
  },

  completeTitle: {
    fontSize: 14,
    fontWeight: "900",
  },

  completeText: {
    fontSize: 10,
    marginTop: 5,
  },

  detailCard: {
    marginTop: 14,
    borderRadius: 19,
    borderWidth: 1,
    padding: 17,
  },

  detailHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  detailHeading: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  detailIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  detailTitleContainer: {
    flex: 1,
    marginLeft: 11,
  },

  detailTitle: {
    fontSize: 15,
    fontWeight: "900",
  },

  detailMeta: {
    fontSize: 9,
    marginTop: 4,
  },

  detailDescription: {
    fontSize: 10,
    lineHeight: 16,
    marginTop: 15,
  },

  instructionsTitle: {
    fontSize: 13,
    fontWeight: "900",
    marginTop: 17,
    marginBottom: 10,
  },

  instructionsList: {
    gap: 10,
  },

  instructionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 9,
  },

  instructionNumberText: {
    color: "#111111",
    fontSize: 9,
    fontWeight: "900",
  },

  instructionText: {
    flex: 1,
    fontSize: 10,
    lineHeight: 16,
    paddingTop: 3,
  },
});