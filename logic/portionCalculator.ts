import { Food } from "../types/nutrition";

/*
=========================================================
PORTION NUTRITION
=========================================================
*/

export interface PortionNutrition {
  grams: number;

  calories: number;

  protein: number;

  carbohydrates: number;

  fat: number;

  fiber: number;
}

/*
=========================================================
CALCULATE NUTRITION FOR A PORTION
=========================================================

The food database values are assumed to represent
nutrition per 100 g.

Example:

Food:
    calories = 200
    protein = 10

Portion:
    150 g

Result:
    calories = 300
    protein = 15
*/

export function calculatePortionNutrition(
  food: Food,
  grams: number
): PortionNutrition {
  /*
   * Prevent invalid portions.
   */
  const safeGrams =
    Math.max(0, grams);

  /*
   * Convert the requested portion
   * into a multiplier of 100 g.
   */
  const multiplier =
    safeGrams / 100;

  return {
    grams: safeGrams,

    calories: Math.round(
      food.calories * multiplier
    ),

    protein: Math.round(
      food.protein * multiplier * 10
    ) / 10,

    carbohydrates: Math.round(
      food.carbohydrates *
        multiplier *
        10
    ) / 10,

    fat: Math.round(
      food.fat * multiplier * 10
    ) / 10,

    fiber: Math.round(
      food.fiber * multiplier * 10
    ) / 10,
  };
}

/*
=========================================================
CALCULATE TOTAL NUTRITION
=========================================================
*/

export function calculateTotalPortionNutrition(
  portions: {
    food: Food;
    grams: number;
  }[]
): PortionNutrition {
  return portions.reduce(
    (total, portion) => {
      const nutrition =
        calculatePortionNutrition(
          portion.food,
          portion.grams
        );

      return {
        grams:
          total.grams +
          nutrition.grams,

        calories:
          total.calories +
          nutrition.calories,

        protein:
          total.protein +
          nutrition.protein,

        carbohydrates:
          total.carbohydrates +
          nutrition.carbohydrates,

        fat:
          total.fat +
          nutrition.fat,

        fiber:
          total.fiber +
          nutrition.fiber,
      };
    },
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