import { UserProfile } from "../types/userProfile";

export interface NutritionTargets {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
}

export function calculateNutritionTargets(
  profile: UserProfile
): NutritionTargets {
  /*
   * TEMPORARY VERSION
   *
   * We will replace this with our researched
   * nutrition calculation system after the
   * food database is complete.
   */

  const calories = 2000;

  const protein = 120;

  const carbohydrates = 250;

  const fat = 65;

  return {
    calories,
    protein,
    carbohydrates,
    fat,
  };
}