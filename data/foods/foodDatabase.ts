import { Food } from "../../types/nutrition";

import { ethiopianFoods } from "./ethiopianFoods";
import { internationalFoods } from "./internationalFoods";

export const foodDatabase: Food[] = [
  ...ethiopianFoods,
  ...internationalFoods,
];

export function getFoodById(
  id: string
): Food | undefined {
  return foodDatabase.find(
    (food) => food.id === id
  );
}