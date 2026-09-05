import {
  Food,
  MealType,
} from "../types/nutrition";

import {
  UserProfile,
} from "../types/userProfile";

import {
  getRecommendedFoods,
} from "./recommendationEngine";

import {
  calculateNutritionTarget,
} from "./nutritionCalculator";

/*
=========================================================
TYPES
=========================================================
*/

export interface PlannedMeal {
  meal: MealType;

  title: string;

  foods: Food[];

  calories: number;

  protein: number;

  carbohydrates: number;

  fat: number;

  fiber: number;
}

export interface DailyPlan {
  date: string;

  targetCalories: number;

  targetProtein: number;

  targetCarbohydrates: number;

  targetFat: number;

  targetFiber: number;

  meals: PlannedMeal[];

  totalCalories: number;

  totalProtein: number;

  totalCarbohydrates: number;

  totalFat: number;

  totalFiber: number;
}

/*
=========================================================
MEAL NAMES
=========================================================
*/

function getMealTitle(
  meal: MealType
): string {
  switch (meal) {
    case "breakfast":
      return "Breakfast";

    case "lunch":
      return "Lunch";

    case "dinner":
      return "Dinner";

    case "snack":
      return "Snack";

    default:
      return "Meal";
  }
}

/*
=========================================================
CALCULATE MEAL NUTRITION
=========================================================
*/

function calculateMealNutrition(
  foods: Food[]
): {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
} {
  return foods.reduce(
    (totals, food) => ({
      calories:
        totals.calories +
        food.calories,

      protein:
        totals.protein +
        food.protein,

      carbohydrates:
        totals.carbohydrates +
        food.carbohydrates,

      fat:
        totals.fat +
        food.fat,

      fiber:
        totals.fiber +
        food.fiber,
    }),
    {
      calories: 0,
      protein: 0,
      carbohydrates: 0,
      fat: 0,
      fiber: 0,
    }
  );
}

/*
=========================================================
CREATE MEAL
=========================================================
*/

function createMeal(
  profile: UserProfile,
  meal: MealType
): PlannedMeal {
  const recommendedFoods =
    getRecommendedFoods(
      profile,
      meal,
      3
    );

  /*
   * At this stage we use the top
   * three compatible foods.
   *
   * Later we will upgrade this to
   * portion-aware meal combinations.
   */
  const foods =
    recommendedFoods.slice(
      0,
      3
    );

  const nutrition =
    calculateMealNutrition(
      foods
    );

  /*
   * If the food database is empty
   * for this meal, we still return
   * a valid meal object.
   */
  return {
    meal,

    title:
      getMealTitle(meal),

    foods,

    calories:
      Math.round(
        nutrition.calories
      ),

    protein:
      Math.round(
        nutrition.protein
      ),

    carbohydrates:
      Math.round(
        nutrition.carbohydrates
      ),

    fat:
      Math.round(
        nutrition.fat
      ),

    fiber:
      Math.round(
        nutrition.fiber
      ),
  };
}

/*
=========================================================
CREATE DAILY PLAN
=========================================================
*/

export function createDailyPlan(
  profile: UserProfile
): DailyPlan {
  const targets =
    calculateNutritionTarget({
      age: profile.age,
      gender: profile.gender,
      weightKg: profile.weightKg,
      heightCm: profile.heightCm,
      activityLevel:
        profile.activityLevel,
      goal:
        profile.goal === "lose"
          ? "lose"
          : profile.goal === "maintain"
            ? "maintain"
            : "gain",
    });

  const mealTypes: MealType[] = [
    "breakfast",
    "lunch",
    "dinner",
    "snack",
  ];

  const meals =
    mealTypes.map(
      (meal) =>
        createMeal(
          profile,
          meal
        )
    );
const totals =
    meals.reduce(
      (total, meal) => ({
        calories:
          total.calories +
          meal.calories,

        protein:
          total.protein +
          meal.protein,

        carbohydrates:
          total.carbohydrates +
          meal.carbohydrates,

        fat:
          total.fat +
          meal.fat,

        fiber:
          total.fiber +
          meal.fiber,
      }),
      {
        calories: 0,
        protein: 0,
        carbohydrates: 0,
        fat: 0,
        fiber: 0,
      }
    );

  return {
    date:
      new Date()
        .toISOString()
        .split("T")[0],

    targetCalories:
      targets.targetCalories,

    targetProtein:
      targets.proteinGrams,

    targetCarbohydrates:
      targets.carbohydrateGrams,

    targetFat:
      targets.fatGrams,

    targetFiber:
      targets.fiberMinGrams,

    meals,

    totalCalories:
      Math.round(
        totals.calories
      ),

    totalProtein:
      Math.round(
        totals.protein
      ),

    totalCarbohydrates:
      Math.round(
        totals.carbohydrates
      ),

    totalFat:
      Math.round(
        totals.fat
      ),

    totalFiber:
      Math.round(
        totals.fiber
      ),
  };
}