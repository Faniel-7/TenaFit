import { Exercise } from "../data/exercises/exerciseDatabase";

type WorkoutProfile = {
  goal?: string;
  activityLevel?: string;
  workoutDays?: number;
  workoutMinutes?: number;
  weeklyWorkoutDays?: number;
  weeklyWorkoutMinutes?: number;
};

export type WorkoutRecommendation = {
  exercise: Exercise;
  score: number;
  reason: string;
};

const normalize = (value?: string) =>
  String(value || "").toLowerCase().replace(/[\s_-]/g, "");

const getMinutes = (profile: WorkoutProfile) =>
  profile.workoutMinutes ||
  profile.weeklyWorkoutMinutes ||
  30;

const getDays = (profile: WorkoutProfile) =>
  profile.workoutDays ||
  profile.weeklyWorkoutDays ||
  3;

export function recommendExercises(
  exercises: Exercise[],
  profile: WorkoutProfile
): WorkoutRecommendation[] {
  const goal = normalize(profile.goal);
  const activityLevel = normalize(profile.activityLevel);
  const minutes = getMinutes(profile);
  const days = getDays(profile);

  return exercises
    .map((exercise) => {
      let score = 0;
      let reason = "A balanced workout for your current plan.";

      const difficulty = normalize(exercise.difficulty);
      const muscle = normalize(exercise.muscleGroup);

      if (
        activityLevel.includes("beginner") &&
        difficulty === "beginner"
      ) {
        score += 5;
      }

      if (
        (activityLevel.includes("intermediate") ||
          activityLevel.includes("active")) &&
        difficulty === "intermediate"
      ) {
        score += 5;
      }

      if (goal.includes("lose") || goal.includes("weightloss")) {
        if (
          muscle.includes("cardio") ||
          muscle.includes("fullbody")
        ) {
          score += 5;
          reason = "Supports your weight-loss goal with active movement.";
        }
      }

      if (
        goal.includes("gain") ||
        goal.includes("musclegain") ||
        goal.includes("build")
      ) {
        if (
          muscle.includes("chest") ||
          muscle.includes("legs") ||
          muscle.includes("glutes") ||
          muscle.includes("fullbody")
        ) {
          score += 5;
          reason = "Supports your muscle-building goal.";
        }
      }

      if (
        goal.includes("maintain") ||
        goal.includes("maintenance")
      ) {
        if (
          muscle.includes("fullbody") ||
          muscle.includes("cardio") ||
          muscle.includes("core")
        ) {
          score += 4;
          reason = "Helps maintain a balanced activity routine.";
        }
      }

      if (minutes <= 20) {
        if (
          muscle.includes("core") ||
          muscle.includes("cardio")
        ) {
          score += 3;
        }
      }

      if (minutes >= 40) {
        if (
          muscle.includes("fullbody") ||
          muscle.includes("legs")
        ) {
          score += 3;
        }
      }

      if (days >= 5 && muscle.includes("fullbody")) {
        score += 2;
      }

      return {
        exercise,
        score,
        reason,
      };
    })
    .sort((a, b) => b.score - a.score);
}

export function getRecommendedExercises(
  exercises: Exercise[],
  profile: WorkoutProfile,
  limit = 6
) {
  return recommendExercises(exercises, profile).slice(0, limit);
}