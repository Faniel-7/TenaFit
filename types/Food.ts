export type FoodOrigin =
  | "ethiopian"
  | "international";

export type MealType =
  | "breakfast"
  | "lunch"
  | "dinner"
  | "snack";

export type FoodGoal =
  | "lose"
  | "maintain"
  | "gain";

export type FoodPreference =
  | "local"
  | "other"
  | "mix";

export interface Food {
  id: string;

  name: string;

  origin: FoodOrigin;

  mealTypes: MealType[];

  servingSize: string;

  calories: number;

  protein: number;

  carbs: number;

  fat: number;

  fiber: number;

  suitableGoals: FoodGoal[];

  tags: string[];

  /*
  Used later by the recommendation engine
  to rank foods for different users.
  */
  recommendationScore?: number;
}