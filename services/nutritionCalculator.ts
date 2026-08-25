import {
  UserProfile,
  WeightGoal,
  ActivityLevel,
} from "../types/userProfile";

export interface NutritionTargets {
  bmr: number;
  maintenanceCalories: number;
  dailyCalories: number;

  protein: number;
  carbs: number;
  fat: number;

  waterLiters: number;
}

/*
=========================================================
ACTIVITY MULTIPLIERS
=========================================================
*/

function getActivityMultiplier(
  activityLevel: ActivityLevel
): number {
  switch (activityLevel) {
    case "sedentary":
      return 1.2;

    case "light":
      return 1.375;

    case "moderate":
      return 1.55;

    case "hard":
      return 1.725;

    default:
      return 1.2;
  }
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
  profile: UserProfile
): number {
  const {
    age,
    gender,
    weightKg,
    heightCm,
  } = profile;

  if (gender === "male") {
    return (
      10 * weightKg +
      6.25 * heightCm -
      5 * age +
      5
    );
  }

  return (
    10 * weightKg +
    6.25 * heightCm -
    5 * age -
    161
  );
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
    getActivityMultiplier(activityLevel);

  return bmr * multiplier;
}

/*
=========================================================
GOAL CALORIES
=========================================================
*/

function calculateGoalCalories(
  maintenanceCalories: number,
  goal: WeightGoal
): number {
  switch (goal) {
    case "lose":
      return maintenanceCalories - 400;

    case "maintain":
      return maintenanceCalories;

    case "gain":
      return maintenanceCalories + 300;

    default:
      return maintenanceCalories;
  }
}

/*
=========================================================
PROTEIN
=========================================================

Starting point:

Lose:
    1.8 g/kg

Maintain:
    1.6 g/kg

Gain:
    1.7 g/kg
*/

function calculateProtein(
  profile: UserProfile
): number {
  switch (profile.goal) {
    case "lose":
      return profile.weightKg * 1.8;

    case "maintain":
      return profile.weightKg * 1.6;

    case "gain":
      return profile.weightKg * 1.7;

    default:
      return profile.weightKg * 1.6;
  }
}

/*
=========================================================
FAT
=========================================================

Approximately 25% of daily calories.
*/

function calculateFat(
  calories: number
): number {
  return (calories * 0.25) / 9;
}

/*
=========================================================
CARBOHYDRATES
=========================================================

Remaining calories after protein and fat.
*/

function calculateCarbs(
  calories: number,
  protein: number,
  fat: number
): number {
  const proteinCalories =
    protein * 4;

  const fatCalories =
    fat * 9;

  const remainingCalories =
    calories -
    proteinCalories -
    fatCalories;

  return Math.max(
    0,
    remainingCalories / 4
  );
}

/*
=========================================================
WATER
=========================================================

Starting estimate:

35 ml per kg body weight.
*/

function calculateWater(
  profile: UserProfile
): number {
  return (
    (profile.weightKg * 35) /
    1000
  );
}

/*
=========================================================
MAIN CALCULATOR
=========================================================
*/

export function calculateNutritionTargets(
  profile: UserProfile
): NutritionTargets {
  const bmr = calculateBMR(profile);
const maintenanceCalories =
    calculateMaintenanceCalories(
      bmr,
      profile.activityLevel
    );

  const dailyCalories =
    calculateGoalCalories(
      maintenanceCalories,
      profile.goal
    );

  const protein =
    calculateProtein(profile);

  const fat =
    calculateFat(dailyCalories);

  const carbs =
    calculateCarbs(
      dailyCalories,
      protein,
      fat
    );

  const waterLiters =
    calculateWater(profile);

  return {
    bmr: Math.round(bmr),

    maintenanceCalories:
      Math.round(
        maintenanceCalories
      ),

    dailyCalories:
      Math.round(dailyCalories),

    protein:
      Math.round(protein),

    carbs:
      Math.round(carbs),

    fat:
      Math.round(fat),

    waterLiters:
      Math.round(
        waterLiters * 10
      ) / 10,
  };
}