import { Food, MealType } from "../types/nutrition";
import { UserProfile } from "../types/userProfile";

import {
  getRecommendedFoods,
} from "./recommendationEngine";

import {
  selectFoodPortion,
  SelectedPortion,
  calculateSelectedNutrition,
} from "./portionSelector";

/*
=========================================================
MEAL COMPOSITION
=========================================================

The meal composer is responsible for deciding which
types of food should appear together.

The goal is:

    Protein
       +
    Main carbohydrate
       +
    Vegetable / fruit / supporting food

The exact combination depends on the foods available
in our database.
*/

/*
=========================================================
FOOD ROLE
=========================================================
*/

export type FoodRole =
  | "protein"
  | "carbohydrate"
  | "vegetable"
  | "fruit"
  | "healthyFat"
  | "dairy"
  | "snack"
  | "other";

/*
=========================================================
MEAL COMPOSITION RESULT
=========================================================
*/

export interface ComposedMeal {
  meal: MealType;

  portions: SelectedPortion[];

  calories: number;

  protein: number;

  carbohydrates: number;

  fat: number;

  fiber: number;
}

/*
=========================================================
GET FOOD ROLE
=========================================================

For now we determine the role from the tags already
stored in the food database.

Later we can make this explicit in Food:

    role: FoodRole

That will be more reliable.
*/

function getFoodRole(
  food: Food
): FoodRole {
  const tags =
    food.tags.map((tag) =>
      tag.toLowerCase()
    );

  if (
    tags.some(
      (tag) =>
        tag.includes("protein") ||
        tag.includes("chicken") ||
        tag.includes("beef") ||
        tag.includes("fish") ||
        tag.includes("egg")
    )
  ) {
    return "protein";
  }

  if (
    tags.some(
      (tag) =>
        tag.includes("vegetable") ||
        tag.includes("veggie")
    )
  ) {
    return "vegetable";
  }

  if (
    tags.some(
      (tag) =>
        tag.includes("fruit")
    )
  ) {
    return "fruit";
  }

  if (
    tags.some(
      (tag) =>
        tag.includes("carb") ||
        tag.includes("rice") ||
        tag.includes("grain") ||
        tag.includes("oat") ||
        tag.includes("bread") ||
        tag.includes("pasta")
    )
  ) {
    return "carbohydrate";
  }

  if (
    tags.some(
      (tag) =>
        tag.includes("dairy") ||
        tag.includes("milk") ||
        tag.includes("yogurt")
    )
  ) {
    return "dairy";
  }

  if (
    tags.some(
      (tag) =>
        tag.includes("fat") ||
        tag.includes("nut") ||
        tag.includes("avocado")
    )
  ) {
    return "healthyFat";
  }

  return "other";
}

/*
=========================================================
FIND FOOD BY ROLE
=========================================================
*/

function findFoodByRole(
  foods: Food[],
  role: FoodRole,
  usedIds: Set<string>
): Food | undefined {
  return foods.find(
    (food) =>
      !usedIds.has(food.id) &&
      getFoodRole(food) === role
  );
}

/*
=========================================================
MEAL ROLE STRATEGY
=========================================================
*/

function getMealRoles(
  meal: MealType
): FoodRole[] {
  switch (meal) {
    case "breakfast":
      return [
        "protein",
        "carbohydrate",
        "fruit",
      ];

    case "lunch":
      return [
        "protein",
        "carbohydrate",
        "vegetable",
      ];

    case "dinner":
      return [
        "protein",
        "vegetable",
        "carbohydrate",
      ];

    case "snack":
      return [
        "protein",
        "fruit",
      ];

    default:
      return [
        "protein",
        "carbohydrate",
      ];
  }
}

/*
=========================================================
COMPOSE MEAL
=========================================================
*/
export function composeMeal(
  profile: UserProfile,
  meal: MealType,
  targetCalories: number
): ComposedMeal {
  /*
   * Get foods that already passed our
   * profile, goal, preference and meal
   * filters.
   */
  const recommendedFoods =
    getRecommendedFoods(
      profile,
      meal,
      20
    );

  const roles =
    getMealRoles(meal);

  const selectedFoods: Food[] = [];

  const usedIds =
    new Set<string>();

  /*
   * Try to satisfy each desired role.
   */
  for (const role of roles) {
    const food =
      findFoodByRole(
        recommendedFoods,
        role,
        usedIds
      );

    if (food) {
      selectedFoods.push(food);
      usedIds.add(food.id);
    }
  }

  /*
   * If the database does not contain
   * enough different roles, fill the
   * remaining positions with other
   * recommended foods.
   */
  for (
    const food of recommendedFoods
  ) {
    if (
      selectedFoods.length >=
      roles.length
    ) {
      break;
    }

    if (
      !usedIds.has(food.id)
    ) {
      selectedFoods.push(food);
      usedIds.add(food.id);
    }
  }

  /*
   * Select practical portions.
   */
  const portions =
    selectedFoods.map(
      (food) =>
        selectFoodPortion(
          food,
          targetCalories /
            Math.max(
              selectedFoods.length,
              1
            )
        )
    );

  const nutrition =
    calculateSelectedNutrition(
      portions
    );

  return {
    meal,

    portions,

    calories:
      nutrition.calories,

    protein:
      nutrition.protein,

    carbohydrates:
      nutrition.carbohydrates,

    fat:
      nutrition.fat,

    fiber:
      nutrition.fiber,
  };
}