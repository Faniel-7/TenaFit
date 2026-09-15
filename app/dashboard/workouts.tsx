import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DashboardPage from "../../components/dashboard/DashboardPage";
import { useAppData } from "../../context/AppDataContext";
import { useTheme } from "../../context/ThemeContext";

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
  const { colors } = useTheme();

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

  const percentage = Math.round(workoutProgress * 100);

  const toggleExercise = async (exerciseId: string) => {
    const alreadyCompleted = completed.includes(exerciseId);

    if (alreadyCompleted) {
      setCompleted((current) =>
        current.filter((id) => id !== exerciseId)
      );
      return;
    }

    setCompleted((current) => [...current, exerciseId]);
    await addSteps(250);
  };

  const changeWorkout = (workout: Workout) => {
    setSelectedWorkout(workout);
    setCompleted([]);
  };

  const workoutIcon = (
    workout: Workout
  ): keyof typeof Ionicons.glyphMap => {
    if (workout.id === "cardio") {
      return "pulse-outline";
    }

    if (workout.id === "core") {
      return "body-outline";
    }

    return "fitness-outline";
  };
return (
    <DashboardPage
      title="Workouts"
      subtitle="Move, train, and build consistency."
      icon="fitness-outline"
    >
      <View
        style={[
          styles.heroCard,
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
                styles.eyebrow,
                { color: colors.primary },
              ]}
            >
              TODAY'S WORKOUT
            </Text>

            <Text
              style={[
                styles.heroTitle,
                { color: colors.text },
              ]}
            >
              {selectedWorkout.name}
            </Text>

            <Text
              style={[
                styles.heroSubtitle,
                { color: colors.subtext },
              ]}
            >
              {selectedWorkout.focus} ·{" "}
              {selectedWorkout.duration} minutes
            </Text>
          </View>

          <View
            style={[
              styles.heroIcon,
              { backgroundColor: colors.background },
            ]}
          >
            <Ionicons
              name={workoutIcon(selectedWorkout)}
              size={29}
              color={colors.primary}
            />
          </View>
        </View>

        <View style={styles.progressHeader}>
          <Text
            style={[
              styles.progressLabel,
              { color: colors.subtext },
            ]}
          >
            Workout progress
          </Text>

          <Text
            style={[
              styles.progressPercentage,
              { color: colors.primary },
            ]}
          >
            {percentage}%
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
                width: `${percentage}%`,
                backgroundColor: colors.primary,
              },
            ]}
          />
        </View>

        <View style={styles.heroStats}>
          <HeroStat
            icon="checkmark-circle-outline"
            value={`${completedCount}/${totalExercises}`}
            label="Exercises"
            colors={colors}
          />

          <HeroStat
            icon="time-outline"
            value={`${selectedWorkout.duration}`}
            label="Minutes"
            colors={colors}
          />

          <HeroStat
            icon="walk-outline"
            value={`${Math.round(data.steps)}`}
            label="Steps"
            colors={colors}
          />
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <View style={styles.sectionText}>
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.text },
            ]}
          >
            Choose your workout
          </Text>

          <Text
            style={[
              styles.sectionSubtitle,
              { color: colors.subtext },
            ]}
          >
            Select what you want to focus on today.
          </Text>
        </View>

        <View
          style={[
            styles.countBadge,
            { backgroundColor: colors.card },
          ]}
        >
          <Text
            style={[
              styles.countBadgeText,
              { color: colors.primary },
            ]}
          >
            {workouts.length}
          </Text>
        </View>
      </View>

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
                  backgroundColor: active
                    ? colors.primary
                    : colors.card,
                  borderColor: active
                    ? colors.primary
                    : colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.workoutOptionIcon,
                  {
                    backgroundColor: active
                      ? "rgba(0,0,0,0.10)"
                      : colors.background,
                  },
                ]}
              >
                <Ionicons
                  name={workoutIcon(workout)}
                  size={21}
                  color={
                    active
                      ? "#05070B"
                      : colors.primary
                  }
                />
              </View>

              <Text
                style={[
                  styles.workoutName,
                  {
                    color: active
                      ? "#05070B"
                      : colors.text,
                  },
                ]}
              >
                {workout.name}
              </Text>

              <Text
                style={[
                  styles.workoutFocus,
                  {
                    color: active
                      ? "rgba(5,7,11,0.60)"
                      : colors.subtext,
                  },
                ]}
              >
                {workout.focus}
              </Text>

              <View
                style={[
                  styles.durationBadge,
                  {
                    backgroundColor: active
                      ? "rgba(0,0,0,0.10)"
                      : colors.background,
                  },
                ]}
              >
                <Ionicons
                  name="time-outline"
                  size={12}
                  color={
                    active
                      ? "#05070B"
                      : colors.subtext
                  }
                />

                <Text
                  style={[
                    styles.durationText,
                    {
                      color: active
                        ? "#05070B"
                        : colors.subtext,
                    },
                  ]}
                >
                  {workout.duration} min
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.sectionHeader}>
        <View style={styles.sectionText}>
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.text },
            ]}
          >
            Exercises
          </Text>

          <Text
            style={[
              styles.sectionSubtitle,
              { color: colors.subtext },
            ]}
          >
            Tap an exercise when you've completed it.
          </Text>
        </View>

        <View
          style={[
            styles.exerciseCountBadge,
            { backgroundColor: colors.card },
          ]}
        >
          <Text
            style={[
              styles.exerciseCountText,
              { color: colors.primary },
            ]}
          >
            {completedCount}/{totalExercises}
          </Text>
        </View>
      </View>

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
                    backgroundColor: isCompleted
                      ? colors.card
                      : colors.card,
                    borderColor: isCompleted
                      ? colors.primary
                      : colors.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.exerciseNumber,
                    {
                      backgroundColor: isCompleted
                        ? colors.primary
                        : colors.background,
                    },
                  ]}
                >
                  {isCompleted ? (
                    <Ionicons
                      name="checkmark"
                      size={18}
                      color="#05070B"
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
                      {
                        color: colors.text,
                        textDecorationLine:
                          isCompleted
                            ? "line-through"
                            : "none",
                      },
                    ]}
                  >
                    {exercise.name}
                  </Text>

                  <View style={styles.exerciseMeta}>
                    <MetaItem
                      icon="repeat-outline"
                      text={`${exercise.sets} sets`}
                      colors={colors}
                    />

                    <MetaItem
                      icon="barbell-outline"
                      text={`${exercise.reps} reps`}
                      colors={colors}
                    />

                    <MetaItem
                      icon="timer-outline"
                      text={exercise.rest}
                      colors={colors}
                    />
                  </View>
                </View>

                <View
                  style={[
                    styles.exerciseCheck,
                    {
                      backgroundColor: isCompleted
                        ? colors.primary
                        : colors.background,
                    },
                  ]}
                >
                  <Ionicons
                    name={
                      isCompleted
                        ? "checkmark"
                        : "chevron-forward"
                    }
                    size={17}
                    color={
                      isCompleted
                        ? "#05070B"
                        : colors.subtext
                    }
                  />
                </View>
              </TouchableOpacity>
            );
          }
        )}
      </View>

      <View style={styles.sectionHeader}>
        <View style={styles.sectionText}>
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.text },
            ]}
          >
            Activity summary
          </Text>

          <Text
            style={[
              styles.sectionSubtitle,
              { color: colors.subtext },
            ]}
          >
            Your movement for today.
          </Text>
        </View>
      </View>
<View style={styles.summaryGrid}>
        <SummaryCard
          icon="walk-outline"
          title="Steps"
          value={`${Math.round(data.steps)}`}
          subtitle="Recorded today"
          colors={colors}
        />

        <SummaryCard
          icon="fitness-outline"
          title="Completion"
          value={`${percentage}%`}
          subtitle="Workout progress"
          colors={colors}
        />

        <SummaryCard
          icon="time-outline"
          title="Duration"
          value={`${selectedWorkout.duration}`}
          subtitle="Minutes"
          colors={colors}
        />
      </View>

      {workoutProgress >= 1 && (
        <View
          style={[
            styles.completeCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.primary,
            },
          ]}
        >
          <View
            style={[
              styles.completeIcon,
              { backgroundColor: colors.primary },
            ]}
          >
            <Ionicons
              name="trophy-outline"
              size={25}
              color="#05070B"
            />
          </View>

          <View style={styles.completeContent}>
            <Text
              style={[
                styles.completeLabel,
                { color: colors.primary },
              ]}
            >
              WORKOUT COMPLETE
            </Text>

            <Text
              style={[
                styles.completeTitle,
                { color: colors.text },
              ]}
            >
              Great work today.
            </Text>

            <Text
              style={[
                styles.completeText,
                { color: colors.subtext },
              ]}
            >
              You've completed every exercise in this
              workout. Keep building your consistency.
            </Text>
          </View>
        </View>
      )}
    </DashboardPage>
  );
}

function HeroStat({
  icon,
  value,
  label,
  colors,
}: {
  icon: keyof typeof Ionicons.glyphMap;
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
          { color: colors.text },
        ]}
      >
        {value}
      </Text>

      <Text
        style={[
          styles.heroStatLabel,
          { color: colors.subtext },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

function MetaItem({
  icon,
  text,
  colors,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
  colors: any;
}) {
  return (
    <View style={styles.metaItem}>
      <Ionicons
        name={icon}
        size={11}
        color={colors.subtext}
      />

      <Text
        style={[
          styles.metaText,
          { color: colors.subtext },
        ]}
      >
        {text}
      </Text>
    </View>
  );
}

function SummaryCard({
  icon,
  title,
  value,
  subtitle,
  colors,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: string;
  subtitle: string;
  colors: any;
}) {
  return (
    <View
      style={[
        styles.summarySmallCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <View
        style={[
          styles.summarySmallIcon,
          { backgroundColor: colors.background },
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
          styles.summarySmallTitle,
          { color: colors.text },
        ]}
      >
        {title}
      </Text>

      <Text
        style={[
          styles.summarySmallValue,
          { color: colors.primary },
        ]}
      >
        {value}
      </Text>
<Text
        style={[
          styles.summarySmallSubtitle,
          { color: colors.subtext },
        ]}
      >
        {subtitle}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 21,
    marginBottom: 30,
  },

  heroTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  heroText: {
    flex: 1,
    paddingRight: 15,
  },

  eyebrow: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.5,
  },

  heroTitle: {
    fontSize: 29,
    fontWeight: "900",
    marginTop: 5,
  },

  heroSubtitle: {
    fontSize: 11,
    marginTop: 4,
  },

  heroIcon: {
    width: 62,
    height: 62,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },

  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 24,
  },

  progressLabel: {
    fontSize: 10,
    fontWeight: "700",
  },

  progressPercentage: {
    fontSize: 13,
    fontWeight: "900",
  },

  progressTrack: {
    height: 8,
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 8,
  },

  progressFill: {
    height: "100%",
    borderRadius: 10,
  },

  heroStats: {
    flexDirection: "row",
    marginTop: 21,
    gap: 10,
  },

  heroStat: {
    flex: 1,
    minHeight: 61,
    borderRadius: 14,
    padding: 10,
  },

  heroStatValue: {
    fontSize: 13,
    fontWeight: "900",
    marginTop: 4,
  },

  heroStatLabel: {
    fontSize: 8,
    marginTop: 2,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 13,
  },

  sectionText: {
    flex: 1,
    paddingRight: 10,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
  },

  sectionSubtitle: {
    fontSize: 10,
    marginTop: 4,
    lineHeight: 16,
  },

  countBadge: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },

  countBadgeText: {
    fontSize: 12,
    fontWeight: "900",
  },

  workoutRow: {
    gap: 10,
    paddingBottom: 30,
  },

  workoutOption: {
    width: 150,
    minHeight: 155,
    borderRadius: 19,
    borderWidth: 1,
    padding: 14,
  },

  workoutOptionIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  workoutName: {
    fontSize: 14,
    fontWeight: "900",
    marginTop: 15,
  },

  workoutFocus: {
    fontSize: 9,
    marginTop: 4,
  },

  durationBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    height: 26,
    borderRadius: 8,
    marginTop: 13,
  },

  durationText: {
    fontSize: 8,
    fontWeight: "800",
  },

  exerciseCountBadge: {
    height: 34,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  exerciseCountText: {
    fontSize: 10,
    fontWeight: "900",
  },

  exerciseList: {
    gap: 9,
    marginBottom: 31,
  },

  exerciseCard: {
    minHeight: 78,
    borderRadius: 17,
    borderWidth: 1,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  exerciseNumber: {
    width: 42,
    height: 42,
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
    marginHorizontal: 12,
  },

  exerciseName: {
    fontSize: 12,
    fontWeight: "900",
  },

  exerciseMeta: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 6,
  },

  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },

  metaText: {
    fontSize: 8,
  },

  exerciseCheck: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },

  summaryGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
summarySmallCard: {
    flex: 1,
    minHeight: 135,
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
  },

  summarySmallIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  summarySmallTitle: {
    fontSize: 10,
    fontWeight: "800",
    marginTop: 12,
  },

  summarySmallValue: {
    fontSize: 19,
    fontWeight: "900",
    marginTop: 4,
  },

  summarySmallSubtitle: {
    fontSize: 8,
    marginTop: 3,
  },

  completeCard: {
    borderRadius: 21,
    borderWidth: 1,
    padding: 17,
    flexDirection: "row",
    marginBottom: 20,
  },

  completeIcon: {
    width: 51,
    height: 51,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  completeContent: {
    flex: 1,
    marginLeft: 12,
  },

  completeLabel: {
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1.2,
  },

  completeTitle: {
    fontSize: 15,
    fontWeight: "900",
    marginTop: 3,
  },

  completeText: {
    fontSize: 9,
    lineHeight: 15,
    marginTop: 4,
  },
});