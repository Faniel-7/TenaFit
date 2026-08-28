import { MealType } from "../types/nutrition";
import { UserProfile } from "../types/userProfile";

import {
  composeMeal,
  ComposedMeal,
} from "./mealComposer";

/*
=========================================================
DAILY MEAL PLAN
=========================================================
*/

export interface DailyMealPlan {
  breakfast: ComposedMeal;
  lunch: ComposedMeal;
  dinner: ComposedMeal;
  snack: ComposedMeal;

  totalCalories: number;
  totalProtein: number;
  totalCarbohydrates: number;
  totalFat: number;
  totalFiber: number;

  targetCalories: number;
}

/*
=========================================================
CALORIE DISTRIBUTION
=========================================================

We don't want every meal to have the same calories.

Default distribution:

Breakfast 25%
Lunch     35%
Dinner    30%
Snack     10%

This can later be adjusted according to the user's
preferences and eating schedule.
*/

const MEAL_DISTRIBUTION: Record<
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
GENERATE DAILY PLAN
=========================================================
*/

export function generateDailyMealPlan(
  profile: UserProfile,
  targetCalories: number
): DailyMealPlan {
  /*
   * Make sure the calorie target is valid.
   */
  const safeCalories =
    Math.max(
      1000,
      Math.round(targetCalories)
    );

  /*
   * Calculate calories for each meal.
   */
  const breakfastCalories =
    Math.round(
      safeCalories *
        MEAL_DISTRIBUTION.breakfast
    );

  const lunchCalories =
    Math.round(
      safeCalories *
        MEAL_DISTRIBUTION.lunch
    );

  const dinnerCalories =
    Math.round(
      safeCalories *
        MEAL_DISTRIBUTION.dinner
    );

  const snackCalories =
    Math.round(
      safeCalories *
        MEAL_DISTRIBUTION.snack
    );

  /*
   * Build each meal.
   */
  const breakfast =
    composeMeal(
      profile,
      "breakfast",
      breakfastCalories
    );

  const lunch =
    composeMeal(
      profile,
      "lunch",
      lunchCalories
    );

  const dinner =
    composeMeal(
      profile,
      "dinner",
      dinnerCalories
    );

  const snack =
    composeMeal(
      profile,
      "snack",
      snackCalories
    );

  /*
   * Calculate daily totals.
   */
  const totalCalories =
    breakfast.calories +
    lunch.calories +
    dinner.calories +
    snack.calories;

  const totalProtein =
    breakfast.protein +
    lunch.protein +
    dinner.protein +
    snack.protein;

  const totalCarbohydrates =
    breakfast.carbohydrates +
    lunch.carbohydrates +
    dinner.carbohydrates +
    snack.carbohydrates;

  const totalFat =
    breakfast.fat +
    lunch.fat +
    dinner.fat +
    snack.fat;

  const totalFiber =
    breakfast.fiber +
    lunch.fiber +
    dinner.fiber +
    snack.fiber;

  return {
    breakfast,
    lunch,
    dinner,
    snack,

    totalCalories:
      Math.round(totalCalories),

    totalProtein:
      Math.round(
        totalProtein * 10
      ) / 10,

    totalCarbohydrates:
      Math.round(
        totalCarbohydrates * 10
      ) / 10,

    totalFat:
      Math.round(
        totalFat * 10
      ) / 10,

    totalFiber:
      Math.round(
        totalFiber * 10
      ) / 10,

    targetCalories:
      safeCalories,
  };
}