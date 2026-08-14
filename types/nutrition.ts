export type FoodCuisine = "local" | "other";

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

export type UserGoal =
  | "weightLoss"
  | "maintenance"
  | "weightGain";

export interface Food {
  id: string;

  name: string;

  /**
   * English name from the food source.
   */
  nameEnglish: string;

  /**
   * Optional Amharic name.
   */
  nameAmharic?: string;

  /**
   * local = Ethiopian/local food
   * other = international/other food
   */
  cuisine: FoodCuisine;

  category: FoodCategory;

  /**
   * Nutrition values are based on the serving
   * specified below.
   */
  servingSize: number;

  servingUnit: string;

  calories: number;

  protein: number;

  carbohydrates: number;

  fat: number;

  fiber?: number;

  /**
   * Whether the food can generally be used
   * for each user goal.
   */
  suitableFor: {
    weightLoss: boolean;
    maintenance: boolean;
    weightGain: boolean;
  };

  /**
   * Extra information useful for filtering.
   */
  tags: string[];

  /**
   * Raw, cooked, or mixed dish.
   */
  preparation?: "raw" | "cooked" | "mixed";

  /**
   * Reference/source information.
   */
  source?: string;
}