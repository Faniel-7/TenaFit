import { foodDatabase } from "../data/foods/foodDatabase";

import {
  Food,
  FoodCuisine,
} from "../types/nutrition";

import { UserProfile } from "../types/userProfile";

import { filterFoods } from "./foodFilter";

function getCuisine(
  preference: UserProfile["foodPreference"]
): FoodCuisine {
  if (preference === "local") {
    return "local";
  }

  return "other";
}

export function getRecommendedFoods(
  profile: UserProfile
): Food[] {
  const cuisine = getCuisine(
    profile.foodPreference
  );

  return filterFoods(
    foodDatabase,
    cuisine,
    profile.goal
  );
}