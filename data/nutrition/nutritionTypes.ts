export type FoodOrigin =
  | "ethiopian"
  | "international";

export type FoodCategory =
  | "grain"
  | "legume"
  | "vegetable"
  | "fruit"
  | "protein"
  | "dairy"
  | "healthy_fat"
  | "beverage"
  | "other";

export type MealType =
  | "breakfast"
  | "lunch"
  | "dinner"
  | "snack";

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
}

export interface Food {
  id: string;
  name: string;
  localName?: string;

  origin: FoodOrigin;
  category: FoodCategory;

  servingSize: number;
  servingUnit: string;

  nutrition: NutritionInfo;

  tags: string[];

  allergens?: string[];

  source: string;
}