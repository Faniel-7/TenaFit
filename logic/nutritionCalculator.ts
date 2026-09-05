/*
=========================================================
TenaFit - Nutrition Calculator
=========================================================

Calculates estimated daily energy needs from:

- Age
- Gender
- Weight
- Height
- Activity level
- Goal

This is a planning algorithm for the app, not medical
advice or a clinical nutrition prescription.
*/

import {
  UserGoal,
  ActivityLevel,
  getActivityMultiplier,
  getGoalCalorieAdjustment,
} from "./recommendationRules";

export type Gender =
  | "male"
  | "female";

export interface NutritionInput {
  age: number;
  gender: Gender;

  weightKg: number;
  heightCm: number;

  activityLevel: ActivityLevel;
  goal: UserGoal;
}

export interface NutritionTarget {
  bmr: number;

  maintenanceCalories: number;

  targetCalories: number;

  proteinGrams: number;
  carbohydrateGrams: number;
  fatGrams: number;

  /*
   * Minimum daily fiber target.
   */
  fiberMinGrams: number;
}

/*
=========================================================
BMR
=========================================================

Mifflin-St Jeor equation.

Male:
BMR = 10W + 6.25H - 5A + 5

Female:
BMR = 10W + 6.25H - 5A - 161

W = weight in kg
H = height in cm
A = age
*/

function calculateBMR(
  input: NutritionInput
): number {
  const {
    age,
    gender,
    weightKg,
    heightCm,
  } = input;

  if (
    age <= 0 ||
    weightKg <= 0 ||
    heightCm <= 0
  ) {
    return 0;
  }

  const base =
    10 * weightKg +
    6.25 * heightCm -
    5 * age;

  if (gender === "male") {
    return base + 5;
  }

  return base - 161;
}

/*
=========================================================
MAINTENANCE CALORIES
=========================================================
*/

function calculateMaintenanceCalories(
  bmr: number,
  activityLevel: ActivityLevel
): number {
  const multiplier =
    getActivityMultiplier(
      activityLevel
    );

  return bmr * multiplier;
}

/*
=========================================================
TARGET CALORIES
=========================================================
*/

function calculateTargetCalories(
  maintenanceCalories: number,
  goal: UserGoal
): number {
  const adjustment =
    getGoalCalorieAdjustment(
      goal
    );

  /*
   * Keep a conservative lower floor
   * for the app's planning calculation.
   */
  return Math.max(
    1000,
    maintenanceCalories +
      adjustment
  );
}

/*
=========================================================
MACROS
=========================================================

Initial planning distribution:

Protein:
    25%

Carbohydrates:
    45%

Fat:
    30%

Calories:
    Protein = 4 kcal/g
    Carbohydrates = 4 kcal/g
    Fat = 9 kcal/g

These percentages are defaults. We can later make
them more personalized based on goal and activity.
*/

function calculateMacros(
  calories: number
): {
  proteinGrams: number;
  carbohydrateGrams: number;
  fatGrams: number;
} {
  const proteinCalories =
    calories * 0.25;

  const carbohydrateCalories =
    calories * 0.45;

  const fatCalories =
    calories * 0.30;

  const proteinGrams =
    proteinCalories / 4;

  const carbohydrateGrams =
    carbohydrateCalories / 4;

  const fatGrams =
    fatCalories / 9;

  return {
    proteinGrams,
    carbohydrateGrams,
    fatGrams,
  };
}

/*
=========================================================
FIBER
=========================================================
*/

function calculateFiberTarget(
  calories: number
): number {
  /*
   * Planning estimate:
   * approximately 14 g per 1,000 kcal.
   */
  return (
    (calories * 14) / 1000
  );
}

/*
=========================================================
MAIN FUNCTION
=========================================================
*/

export function calculateNutritionTarget(
  input: NutritionInput
): NutritionTarget {
  const bmr =
    calculateBMR(input);

  const maintenanceCalories =
    calculateMaintenanceCalories(
      bmr,
      input.activityLevel
    );

  const targetCalories =
    calculateTargetCalories(
      maintenanceCalories,
      input.goal
    );
const macros =
    calculateMacros(
      targetCalories
    );

  const fiberMinGrams =
    calculateFiberTarget(
      targetCalories
    );

  return {
    bmr: Math.round(bmr),

    maintenanceCalories:
      Math.round(
        maintenanceCalories
      ),

    targetCalories:
      Math.round(
        targetCalories
      ),

    proteinGrams:
      Math.round(
        macros.proteinGrams
      ),

    carbohydrateGrams:
      Math.round(
        macros.carbohydrateGrams
      ),

    fatGrams:
      Math.round(
        macros.fatGrams
      ),

    fiberMinGrams:
      Math.round(
        fiberMinGrams
      ),
  };
}