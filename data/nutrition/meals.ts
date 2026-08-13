import { MealType } from "./nutritionTypes";

export interface MealIngredient {
  foodId: string;
  amount: number;
  unit: string;
}

export interface Meal {
  id: string;
  name: string;
  type: MealType;

  origin: "ethiopian" | "international" | "mixed";

  ingredients: MealIngredient[];

  tags: string[];

  instructions?: string;
}

export const meals: Meal[] = [];