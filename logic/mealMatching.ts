import { MealNutritionTarget } from "./mealTargets";

export interface NutritionValues {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
}

/*
=========================================================
TenaFit - Meal Matching
=========================================================

Measures how close a food/meal is to its nutritional
target.

Lower score = better match.
*/

function percentageDifference(
  actual: number,
  target: number
): number {
  if (target <= 0) {
    return 0;
  }

  return Math.abs(
    actual - target
  ) / target;
}

/*
=========================================================
CALCULATE MATCH SCORE
=========================================================
*/

export function calculateMealMatchScore(
  actual: NutritionValues,
  target: MealNutritionTarget
): number {
  const calorieDifference =
    percentageDifference(
      actual.calories,
      target.calories
    );

  const proteinDifference =
    percentageDifference(
      actual.protein,
      target.proteinGrams
    );

  const carbohydrateDifference =
    percentageDifference(
      actual.carbohydrates,
      target.carbohydrateGrams
    );

  const fatDifference =
    percentageDifference(
      actual.fat,
      target.fatGrams
    );

  const fiberDifference =
    percentageDifference(
      actual.fiber,
      target.fiberGrams
    );

  /*
   * Calories and protein receive greater weight because
   * they are particularly important to our meal-planning
   * algorithm.
   */
  return (
    calorieDifference * 0.30 +
    proteinDifference * 0.30 +
    carbohydrateDifference * 0.15 +
    fatDifference * 0.15 +
    fiberDifference * 0.10
  );
}

/*
=========================================================
CHECK WHETHER A MEAL IS REASONABLY CLOSE
=========================================================
*/

export function isMealWithinRange(
  actual: NutritionValues,
  target: MealNutritionTarget
): boolean {
  const score =
    calculateMealMatchScore(
      actual,
      target
    );

  /*
   * Temporary threshold.
   *
   * We'll tune this after testing against
   * real foods in our database.
   */
  return score <= 0.25;
}