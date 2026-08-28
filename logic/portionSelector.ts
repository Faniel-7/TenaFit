import { Food } from "../types/nutrition";
import {
  calculatePortionNutrition,
  PortionNutrition,
} from "./portionCalculator";

export interface SelectedPortion {
  food: Food;
  grams: number;
  nutrition: PortionNutrition;
}

/*
=========================================================
PORTION SELECTOR
=========================================================

Chooses a practical portion that moves a meal toward
its calorie target.

This is intentionally conservative for now.
Later we will improve it using meal-specific macro
targets and food categories.
*/

export function selectFoodPortion(
  food: Food,
  targetCalories: number
): SelectedPortion {
  if (food.calories <= 0) {
    return {
      food,
      grams: 0,
      nutrition: calculatePortionNutrition(
        food,
        0
      ),
    };
  }

  /*
   * Food calories are stored per 100 g.
   *
   * Estimate the amount needed to provide
   * the requested calories.
   */
  let grams =
    (targetCalories /
      food.calories) *
    100;

  /*
   * Keep portions practical.
   */
  grams = Math.max(25, grams);
  grams = Math.min(400, grams);

  /*
   * Round to a practical serving amount.
   */
  grams =
    Math.round(grams / 5) * 5;

  const nutrition =
    calculatePortionNutrition(
      food,
      grams
    );

  return {
    food,
    grams,
    nutrition,
  };
}

/*
=========================================================
SELECT MULTIPLE FOODS
=========================================================
*/

export function selectMealPortions(
  foods: Food[],
  targetCalories: number
): SelectedPortion[] {
  if (foods.length === 0) {
    return [];
  }

  /*
   * Divide the calorie target between
   * the selected foods.
   */
  const caloriesPerFood =
    targetCalories /
    foods.length;

  return foods.map((food) =>
    selectFoodPortion(
      food,
      caloriesPerFood
    )
  );
}

/*
=========================================================
TOTAL SELECTED NUTRITION
=========================================================
*/

export function calculateSelectedNutrition(
  portions: SelectedPortion[]
): PortionNutrition {
  return portions.reduce(
    (total, portion) => ({
      grams:
        total.grams +
        portion.nutrition.grams,

      calories:
        total.calories +
        portion.nutrition.calories,

      protein:
        total.protein +
        portion.nutrition.protein,

      carbohydrates:
        total.carbohydrates +
        portion.nutrition.carbohydrates,

      fat:
        total.fat +
        portion.nutrition.fat,

      fiber:
        total.fiber +
        portion.nutrition.fiber,
    }),
    {
      grams: 0,
      calories: 0,
      protein: 0,
      carbohydrates: 0,
      fat: 0,
      fiber: 0,
    }
  );
}