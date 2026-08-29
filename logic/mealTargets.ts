import { MealType } from "../types/nutrition";

export interface DailyNutritionTargets {
  targetCalories: number;
  proteinGrams: number;
  carbohydrateGrams: number;
  fatGrams: number;
  fiberMinGrams: number;
}

export interface MealNutritionTarget {
  meal: MealType;
  calories: number;
  proteinGrams: number;
  carbohydrateGrams: number;
  fatGrams: number;
  fiberGrams: number;
}

/*
=========================================================
MEAL DISTRIBUTION
=========================================================

Breakfast = 25%
Lunch     = 35%
Dinner    = 30%
Snack     = 10%
*/

const DISTRIBUTION: Record<
  MealType,
  number
> = {
  breakfast: 0.25,
  lunch: 0.35,
  dinner: 0.30,
  snack: 0.10,
};

/*
=========================================================
CALCULATE ONE MEAL TARGET
=========================================================
*/

export function calculateMealTarget(
  daily: DailyNutritionTargets,
  meal: MealType
): MealNutritionTarget {
  const percentage =
    DISTRIBUTION[meal];

  return {
    meal,

    calories: Math.round(
      daily.targetCalories *
        percentage
    ),

    proteinGrams: Math.round(
      daily.proteinGrams *
        percentage
    ),

    carbohydrateGrams: Math.round(
      daily.carbohydrateGrams *
        percentage
    ),

    fatGrams: Math.round(
      daily.fatGrams *
        percentage
    ),

    fiberGrams: Math.round(
      daily.fiberMinGrams *
        percentage
    ),
  };
}

/*
=========================================================
CALCULATE ALL MEAL TARGETS
=========================================================
*/

export function calculateAllMealTargets(
  daily: DailyNutritionTargets
): MealNutritionTarget[] {
  const meals: MealType[] = [
    "breakfast",
    "lunch",
    "dinner",
    "snack",
  ];

  return meals.map(
    (meal) =>
      calculateMealTarget(
        daily,
        meal
      )
  );
}