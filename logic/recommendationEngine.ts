import {
  Food,
  MealType,
} from "../types/nutrition";

import {
  UserProfile,
} from "../types/userProfile";

import { foodDatabase } from "../data/foods/foodDatabase";

import { filterFoods } from "./foodFilter";

export interface MealRecommendation {
  meal: MealType;

  foods: Food[];
}

function shuffle<T>(
  array: T[]
): T[] {
  return [...array].sort(
    () => Math.random() - 0.5
  );
}

function sortForPreference(
  foods: Food[],
  preference: UserProfile["foodPreference"]
): Food[] {
  if (preference !== "mixed") {
    return foods;
  }

  /*
   * For Local + Others:
   * put international foods first,
   * then Ethiopian/local foods.
   *
   * This follows the preference rule
   * we discussed.
   */
  const otherFoods =
    foods.filter(
      (food) =>
        food.cuisine === "other"
    );

  const localFoods =
    foods.filter(
      (food) =>
        food.cuisine === "local"
    );

  return [
    ...shuffle(otherFoods),
    ...shuffle(localFoods),
  ];
}

export function getRecommendedFoods(
  profile: UserProfile,
  meal: MealType,
  limit = 5
): Food[] {
  const filtered =
    filterFoods(
      foodDatabase,
      profile.foodPreference,
      profile.goal,
      meal
    );

  const sorted =
    sortForPreference(
      filtered,
      profile.foodPreference
    );

  return sorted.slice(
    0,
    limit
  );
}

export function getDailyRecommendations(
  profile: UserProfile
): MealRecommendation[] {
  const meals: MealType[] = [
    "breakfast",
    "lunch",
    "dinner",
    "snack",
  ];

  return meals.map((meal) => ({
    meal,

    foods:
      getRecommendedFoods(
        profile,
        meal,
        5
      ),
  }));
}