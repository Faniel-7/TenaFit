import { WorkoutHistoryEntry } from "../types/workout";

export type WorkoutPlan = {
  id: string;
  name: string;
  focus: string;
  duration: number;
  exercises: string[];
};

export type WorkoutProfile = {
  goal?: string;
  activityLevel?: string;
  workoutDays?: number;
  workoutMinutes?: number;
  weeklyWorkoutDays?: number;
  weeklyWorkoutMinutes?: number;
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

export function recommendWorkout(
  workouts: WorkoutPlan[],
  profile: WorkoutProfile,
  history: WorkoutHistoryEntry[] = []
): WorkoutPlan | null {
  if (!workouts.length) {
    return null;
  }

  const goal = normalize(profile.goal);
  const activityLevel = normalize(profile.activityLevel);
  const minutes = getMinutes(profile);
  const days = getDays(profile);

  const recentWorkouts = history.slice(0, 3);

  const recentIds = recentWorkouts.map((workout) => workout.workoutId);

  const scored = workouts.map((workout) => {
    let score = 0;

    if (goal.includes("lose") || goal.includes("weightloss")) {
      if (workout.id === "cardio") {
        score += 7;
      }

      if (workout.id === "full-body") {
        score += 5;
      }
    }

    if (
      goal.includes("gain") ||
      goal.includes("musclegain") ||
      goal.includes("build")
    ) {
      if (workout.id === "full-body") {
        score += 8;
      }

      if (workout.id === "core") {
        score += 3;
      }
    }

    if (
      goal.includes("maintain") ||
      goal.includes("maintenance")
    ) {
      if (workout.id === "full-body") {
        score += 5;
      }

      if (workout.id === "cardio") {
        score += 4;
      }

      if (workout.id === "core") {
        score += 3;
      }
    }

    if (minutes <= 20) {
      if (workout.duration <= minutes) {
        score += 5;
      }
    }

    if (minutes >= 30) {
      if (workout.duration <= minutes) {
        score += 4;
      }
    }

    if (
      activityLevel.includes("beginner") &&
      workout.id === "core"
    ) {
      score += 2;
    }

    if (
      activityLevel.includes("active") ||
      activityLevel.includes("high")
    ) {
      if (workout.id === "full-body") {
        score += 3;
      }
    }

    if (days >= 5 && workout.id === "full-body") {
      score += 2;
    }

    if (recentIds.includes(workout.id)) {
      score -= 4;
    }

    return {
      workout,
      score,
    };
  });

  scored.sort((a, b) => b.score - a.score);

  return scored[0]?.workout || workouts[0];
}

export function getWorkoutRecommendationReason(
  workout: WorkoutPlan,
  profile: WorkoutProfile
) {
  const goal = normalize(profile.goal);
  const minutes = getMinutes(profile);

  if (
    (goal.includes("lose") || goal.includes("weightloss")) &&
    workout.id === "cardio"
  ) {
    return "This workout matches your goal and provides an active session within your plan.";
  }

  if (
    (goal.includes("gain") ||
      goal.includes("musclegain") ||
      goal.includes("build")) &&
    workout.id === "full-body"
  ) {
    return "This workout gives you a balanced strength-focused session for your goal.";
  }

  if (minutes <= 20 && workout.duration <= minutes) {
    return "This workout fits your available training time.";
  }

  if (workout.id === "core") {
    return "This workout adds focused core training to your routine.";
  }

  return "This workout provides a balanced session based on your current plan.";
}