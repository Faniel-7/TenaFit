import {
  Food,
  MealType,
  UserGoal,
} from "../types/nutrition";

import {
  FoodPreference,
} from "../types/userProfile";

export function filterFoods(
  foods: Food[],
  preference: FoodPreference,
  goal: UserGoal,
  meal?: MealType
): Food[] {
  return foods.filter((food) => {
    const matchesGoal =
      food.suitableFor[goal];

    if (!matchesGoal) {
      return false;
    }

    const matchesMeal =
      !meal ||
      food.suitableMeals.includes(meal);

    if (!matchesMeal) {
      return false;
    }

    /*
     * LOCAL ONLY
     */
    if (preference === "local") {
      return food.cuisine === "local";
    }

    /*
     * OTHER ONLY
     */
    if (preference === "other") {
      return food.cuisine === "other";
    }

    /*
     * LOCAL + OTHER
     *
     * Both cuisines are allowed.
     */
    return true;
  });
}