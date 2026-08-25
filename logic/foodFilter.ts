import {
  Food,
  MealType,
  UserGoal,
} from "../types/nutrition";

import {
  FoodPreference,
} from "../types/userProfile";

/*
=========================================================
CHECK GOAL
=========================================================
*/

function matchesGoal(
  food: Food,
  goal: UserGoal
): boolean {
  return food.suitableFor[goal];
}

/*
=========================================================
CHECK MEAL
=========================================================
*/

function matchesMeal(
  food: Food,
  meal?: MealType
): boolean {
  if (!meal) {
    return true;
  }

  return food.suitableMeals.includes(
    meal
  );
}

/*
=========================================================
CHECK FOOD PREFERENCE
=========================================================
*/

function matchesPreference(
  food: Food,
  preference: FoodPreference
): boolean {
  /*
   * LOCAL
   *
   * Only Ethiopian/local foods.
   */
  if (preference === "local") {
    return food.cuisine === "local";
  }

  /*
   * OTHER
   *
   * Other/international foods.
   */
  if (preference === "other") {
    return food.cuisine === "other";
  }

  /*
   * MIXED
   *
   * Both are allowed.
   */
  return true;
}

/*
=========================================================
MAIN FILTER
=========================================================
*/

export function filterFoods(
  foods: Food[],
  preference: FoodPreference,
  goal: UserGoal,
  meal?: MealType
): Food[] {
  return foods.filter((food) => {
    if (!matchesGoal(food, goal)) {
      return false;
    }

    if (!matchesMeal(food, meal)) {
      return false;
    }

    if (
      !matchesPreference(
        food,
        preference
      )
    ) {
      return false;
    }

    return true;
  });
}