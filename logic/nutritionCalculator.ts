import { UserGoal } from "../types/nutrition";
import { UserProfile } from "../types/userProfile";

export interface NutritionTargets {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  bmr: number;
  maintenanceCalories: number;
}

/*
=========================================================
BMR
=========================================================
Mifflin-St Jeor equation.
*/

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

/*
=========================================================
ACTIVITY MULTIPLIER
=========================================================
*/

function getActivityMultiplier(
  profile: UserProfile
): number {
  switch (profile.activityLevel) {
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
GOAL CALORIES
=========================================================
*/

function calculateGoalCalories(
  maintenanceCalories: number,
  goal: UserGoal
): number {
  switch (goal) {
    case "weightLoss":
      return maintenanceCalories - 300;

    case "weightGain":
      return maintenanceCalories + 300;

    case "maintenance":
    default:
      return maintenanceCalories;
  }
}

/*
=========================================================
PROTEIN
=========================================================
*/

function calculateProtein(
  weightKg: number,
  goal: UserGoal
): number {
  switch (goal) {
    case "weightLoss":
      return weightKg * 1.6;

    case "weightGain":
      return weightKg * 1.6;

    case "maintenance":
    default:
      return weightKg * 1.4;
  }
}

function normalizeGoal(
  goal: UserProfile["goal"]
): UserGoal {
  switch (goal) {
    case "lose":
      return "weightLoss";

    case "gain":
      return "weightGain";

    case "maintain":
      return "maintenance";

    default:
      return "maintenance";
  }
}

/*
=========================================================
NUTRITION TARGETS
=========================================================
*/

export function calculateNutritionTargets(
  profile: UserProfile
): NutritionTargets {
  const goal =
    normalizeGoal(
      profile.goal
    );

  const bmr =
    calculateBMR(profile);

  const activityMultiplier =
    getActivityMultiplier(profile);

  const maintenanceCalories =
    bmr * activityMultiplier;

  /*
   * Apply the user's goal.
   */
  const calculatedCalories =
    calculateGoalCalories(
      maintenanceCalories,
      goal
    );

  /*
   * Prevent unrealistic negative
   * calorie targets.
   */
  const calories = Math.max(
    Math.round(calculatedCalories),
    1200
  );

  /*
   * Protein.
   */
  const protein =
    calculateProtein(
      profile.weightKg,
      goal
    );

  /*
   * Approximately 25% of calories
   * come from fat.
   */
  const fatCalories =
    calories * 0.25;

  const fat =
    fatCalories / 9;

  /*
   * Remaining calories are assigned
   * to carbohydrates.
   */
  const proteinCalories =
    protein * 4;

  const remainingCalories =
    Math.max(
      calories -
        proteinCalories -
        fatCalories,
      0
    );

  const carbohydrates =
    remainingCalories / 4;

  /*
   * Fiber target:
   * approximately 14g per 1000 kcal,
   * with a minimum starting target of 25g.
   */
  const fiber =
    Math.max(
      25,
      (calories / 1000) * 14
    );

  return {
    calories,

    protein:
      Math.round(protein),

    carbohydrates:
      Math.round(carbohydrates),

    fat:
      Math.round(fat),

    fiber:
      Math.round(fiber),

    bmr:
      Math.round(bmr),

    maintenanceCalories:
      Math.round(
        maintenanceCalories
      ),
  };
}