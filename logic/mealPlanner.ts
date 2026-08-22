import {
  Food,
  MealType,
} from "../types/nutrition";

import {
  NutritionTargets,
} from "./nutritionCalculator";

export interface PlannedMeal {
  type: MealType;

  foods: Food[];

  estimatedCalories: number;

  estimatedProtein: number;

  estimatedCarbohydrates: number;

  estimatedFat: number;
}

function calculateMealNutrition(
  foods: Food[]
) {
  return foods.reduce(
    (total, food) => ({
      calories:
        total.calories +
        food.calories,

      protein:
        total.protein +
        food.protein,

      carbohydrates:
        total.carbohydrates +
        food.carbohydrates,

      fat:
        total.fat +
        food.fat,
    }),
    {
      calories: 0,
      protein: 0,
      carbohydrates: 0,
      fat: 0,
    }
  );
}

export function createMealPlan(
  meal: MealType,
  foods: Food[],
  targets: NutritionTargets
): PlannedMeal {
  const nutrition =
    calculateMealNutrition(
      foods
    );

  return {
    type: meal,

    foods,

    estimatedCalories:
      Math.round(
        nutrition.calories
      ),

    estimatedProtein:
      Math.round(
        nutrition.protein
      ),

    estimatedCarbohydrates:
      Math.round(
        nutrition.carbohydrates
      ),

    estimatedFat:
      Math.round(
        nutrition.fat
      ),
  };
}