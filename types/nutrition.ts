export type FoodCuisine =
  | "local"
  | "other";

export type FoodCategory =
  | "cereal"
  | "root"
  | "legume"
  | "vegetable"
  | "fruit"
  | "nut"
  | "meat"
  | "egg"
  | "fish"
  | "dairy"
  | "oil"
  | "beverage"
  | "sugar"
  | "spice"
  | "soup"
  | "mixed";

export type PreparationType =
  | "raw"
  | "cooked"
  | "mixed";

export type UserGoal =
  | "weightLoss"
  | "maintenance"
  | "weightGain";

export type MealType =
  | "breakfast"
  | "lunch"
  | "dinner"
  | "snack";

export interface Food {
  id: string;

  name: string;

  nameEnglish: string;

  nameAmharic?: string;

  cuisine: FoodCuisine;

  category: FoodCategory;

  preparation: PreparationType;

  servingSize: number;

  servingUnit: string;

  calories: number;

  protein: number;

  carbohydrates: number;

  fat: number;

  fiber: number;

  suitableFor: {
    weightLoss: boolean;
    maintenance: boolean;
    weightGain: boolean;
  };

  suitableMeals: MealType[];

  tags: string[];

  source: string;

  sourceCode?: string;
}