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

import {
  calculatePortionNutrition,
  PortionNutrition,
} from "./portionCalculator";

export interface PlannedFood {
  food: Food;
  grams: number;
  nutrition: PortionNutrition;
}

export interface PlannedMeal {
  meal: MealType;
  title: string;
  foods: Food[];
  portions: PlannedFood[];
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  targetCalories: number;
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

function getMealCaloriePercentage(
  meal: MealType
): number {
  switch (meal) {
    case "breakfast":
      return 0.25;
    case "lunch":
      return 0.35;
    case "dinner":
      return 0.3;
    case "snack":
      return 0.1;
    default:
      return 0;
  }
}

function calculateMealNutrition(
  portions: PlannedFood[]
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

function getInitialPortion(
  food: Food,
  targetCalories: number
): number {
  if (food.calories <= 0) {
    return 0;
  }

  const calculated =
    (targetCalories /
      food.calories) *
    100;

  return Math.max(
    20,
    Math.min(300, calculated)
  );
}

function createPortionedMeal(
  profile: UserProfile,
  meal: MealType,
  targetCalories: number
): PlannedMeal {
  const recommendedFoods =
    getRecommendedFoods(
      profile,
      meal,
      5
    );

  const usableFoods =
    recommendedFoods.filter(
      (food) =>
        food.calories > 0
    );

  if (
    usableFoods.length === 0
  ) {
    return {
      meal,
      title: getMealTitle(meal),
      foods: [],
      portions: [],
      calories: 0,
      protein: 0,
      carbohydrates: 0,
      fat: 0,
      fiber: 0,
      targetCalories,
    };
  }

  const selectedFoods =
    usableFoods.slice(
      0,
      Math.min(3, usableFoods.length)
    );

  const baseTarget =
    targetCalories /
    selectedFoods.length;

  const portions =
    selectedFoods.map(
      (food) => {
        const grams =
          getInitialPortion(
            food,
            baseTarget
          );

        return {
          food,
          grams: Math.round(
            grams / 5
          ) * 5,
          nutrition:
            calculatePortionNutrition(
              food,
              Math.round(
                grams / 5
              ) * 5
            ),
        };
      }
    );

  let nutrition =
    calculateMealNutrition(
      portions
    );

  if (
    nutrition.calories > 0
  ) {
    const adjustment =
      targetCalories /
      nutrition.calories;
const adjustedPortions =
      portions.map(
        (portion) => {
          const grams = Math.max(
            20,
            Math.min(
              400,
              Math.round(
                (portion.grams *
                  adjustment) /
                  5
              ) * 5
            )
          );

          return {
            ...portion,
            grams,
            nutrition:
              calculatePortionNutrition(
                portion.food,
                grams
              ),
          };
        }
      );

    nutrition =
      calculateMealNutrition(
        adjustedPortions
      );

    return {
      meal,
      title: getMealTitle(meal),
      foods: selectedFoods,
      portions: adjustedPortions,
      calories: Math.round(
        nutrition.calories
      ),
      protein: Math.round(
        nutrition.protein
      ),
      carbohydrates:
        Math.round(
          nutrition.carbohydrates
        ),
      fat: Math.round(
        nutrition.fat
      ),
      fiber: Math.round(
        nutrition.fiber
      ),
      targetCalories,
    };
  }

  return {
    meal,
    title: getMealTitle(meal),
    foods: selectedFoods,
    portions,
    calories: Math.round(
      nutrition.calories
    ),
    protein: Math.round(
      nutrition.protein
    ),
    carbohydrates: Math.round(
      nutrition.carbohydrates
    ),
    fat: Math.round(
      nutrition.fat
    ),
    fiber: Math.round(
      nutrition.fiber
    ),
    targetCalories,
  };
}

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
      (meal) => {
        const targetCalories =
          Math.round(
            targets.targetCalories *
              getMealCaloriePercentage(
                meal
              )
          );

        return createPortionedMeal(
          profile,
          meal,
          targetCalories
        );
      }
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