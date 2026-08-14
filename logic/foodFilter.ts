import { Food, FoodCuisine, UserGoal } from "../types/nutrition";

export function filterFoods(
  foods: Food[],
  cuisine: FoodCuisine,
  goal: UserGoal
): Food[] {
  return foods.filter((food) => {
    const matchesCuisine =
      food.cuisine === cuisine;

    const matchesGoal =
      food.suitableFor[goal];

    return matchesCuisine && matchesGoal;
  });
}