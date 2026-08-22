import {
  UserGoal,
} from "../types/nutrition";

import {
  UserProfile,
} from "../types/userProfile";

export interface NutritionTargets {
  calories: number;

  protein: number;

  carbohydrates: number;

  fat: number;

  fiber: number;
}

function calculateBMR(
  profile: UserProfile
): number {
  const {
    weightKg,
    heightCm,
    age,
    gender,
  } = profile;

  const base =
    10 * weightKg +
    6.25 * heightCm -
    5 * age;

  if (gender === "male") {
    return base + 5;
  }

  return base - 161;
}

function getActivityMultiplier(
  profile: UserProfile
): number {
  if (profile.activityLevel === "none") {
    return 1.2;
  }

  if (profile.activityLevel === "light") {
    return 1.375;
  }

  return 1.55;
}

function calculateGoalCalories(
  maintenanceCalories: number,
  goal: UserGoal
): number {
  if (goal === "weightLoss") {
    return maintenanceCalories - 300;
  }

  if (goal === "weightGain") {
    return maintenanceCalories + 300;
  }

  return maintenanceCalories;
}

function calculateProtein(
  weightKg: number,
  goal: UserGoal
): number {
  if (goal === "weightLoss") {
    return weightKg * 1.6;
  }

  if (goal === "weightGain") {
    return weightKg * 1.6;
  }

  return weightKg * 1.4;
}

export function calculateNutritionTargets(
  profile: UserProfile
): NutritionTargets {
  const bmr =
    calculateBMR(profile);

  const activityMultiplier =
    getActivityMultiplier(profile);

  const maintenanceCalories =
    bmr * activityMultiplier;

  const calories =
    calculateGoalCalories(
      maintenanceCalories,
      profile.goal
    );

  const protein =
    calculateProtein(
      profile.weightKg,
      profile.goal
    );

  const proteinCalories =
    protein * 4;

  /*
   * Start with approximately 25% of
   * calories from fat.
   */
  const fatCalories =
    calories * 0.25;

  const fat =
    fatCalories / 9;

  const remainingCalories =
    Math.max(
      calories -
        proteinCalories -
        fatCalories,
      0
    );

  const carbohydrates =
    remainingCalories / 4;

  const fiber =
    Math.max(
      25,
      calories / 1000 * 14
    );

  return {
    calories: Math.round(calories),

    protein: Math.round(protein),

    carbohydrates:
      Math.round(carbohydrates),

    fat: Math.round(fat),

    fiber: Math.round(fiber),
  };
}