import { Food, FoodCategory, FoodCuisine, MealType } from "../../types/nutrition";

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

export function getFoodsByCuisine(
  cuisine: FoodCuisine
): Food[] {
  return foodDatabase.filter(
    (food) => food.cuisine === cuisine
  );
}

export function getFoodsByCategory(
  category: FoodCategory
): Food[] {
  return foodDatabase.filter(
    (food) => food.category === category
  );
}

export function getFoodsByMeal(
  meal: MealType
): Food[] {
  return foodDatabase.filter(
    (food) =>
      food.suitableMeals.includes(meal)
  );
}

export function searchFoods(
  query: string
): Food[] {
  const normalizedQuery =
    query.trim().toLowerCase();

  if (!normalizedQuery) {
    return foodDatabase;
  }

  return foodDatabase.filter(
    (food) => {
      const nameMatch =
        food.name
          .toLowerCase()
          .includes(normalizedQuery);

      const englishNameMatch =
        food.nameEnglish
          .toLowerCase()
          .includes(normalizedQuery);

      const amharicNameMatch =
        food.nameAmharic
          ?.toLowerCase()
          .includes(normalizedQuery) ?? false;

      const tagMatch =
        food.tags.some(
          (tag) =>
            tag
              .toLowerCase()
              .includes(normalizedQuery)
        );

      return (
        nameMatch ||
        englishNameMatch ||
        amharicNameMatch ||
        tagMatch
      );
    }
  );
}

export function getFoodsForGoal(
  goal:
    | "weightLoss"
    | "maintenance"
    | "weightGain"
): Food[] {
  return foodDatabase.filter(
    (food) =>
      food.suitableFor[goal]
  );
}

export function getFoodsForGoalAndMeal(
  goal:
    | "weightLoss"
    | "maintenance"
    | "weightGain",
  meal: MealType
): Food[] {
  return foodDatabase.filter(
    (food) =>
      food.suitableFor[goal] &&
      food.suitableMeals.includes(meal)
  );
}

export function getLocalFoods(): Food[] {
  return getFoodsByCuisine("local");
}

export function getInternationalFoods(): Food[] {
  return getFoodsByCuisine("other");
}

export function getHighProteinFoods(
  minimumProtein = 10
): Food[] {
  return foodDatabase.filter(
    (food) =>
      food.protein >= minimumProtein
  );
}

export function getHighFiberFoods(
  minimumFiber = 5
): Food[] {
  return foodDatabase.filter(
    (food) =>
      food.fiber >= minimumFiber
  );
}

export function getFoodsUnderCalories(
  maximumCalories: number
): Food[] {
  return foodDatabase.filter(
    (food) =>
      food.calories <= maximumCalories
  );
}

export function getFoodsBetweenCalories(
  minimumCalories: number,
  maximumCalories: number
): Food[] {
  return foodDatabase.filter(
    (food) =>
      food.calories >= minimumCalories &&
      food.calories <= maximumCalories
  );
}

export function getFoodsByTags(
  tags: string[]
): Food[] {
  const normalizedTags =
    tags.map((tag) =>
      tag.trim().toLowerCase()
    );

  if (normalizedTags.length === 0) {
    return foodDatabase;
  }

  return foodDatabase.filter(
    (food) =>
      normalizedTags.some(
        (requestedTag) =>
          food.tags.some(
            (foodTag) =>
              foodTag
                .toLowerCase()
                .includes(requestedTag)
          )
      )
  );
}

export function getFoodsByCuisineAndMeal(
  cuisine: FoodCuisine,
  meal: MealType
): Food[] {
  return foodDatabase.filter(
    (food) =>
      food.cuisine === cuisine &&
      food.suitableMeals.includes(meal)
  );
}

export function getFoodsByCategoryAndMeal(
  category: FoodCategory,
  meal: MealType
): Food[] {
  return foodDatabase.filter(
    (food) =>
      food.category === category &&
      food.suitableMeals.includes(meal)
  );
}
export function getFoodServingCalories(
  food: Food,
  amount: number
): number {
  if (food.servingSize <= 0) {
    return 0;
  }

  return (
    food.calories *
    (amount / food.servingSize)
  );
}

export function getFoodServingMacros(
  food: Food,
  amount: number
) {
  if (food.servingSize <= 0) {
    return {
      calories: 0,
      protein: 0,
      carbohydrates: 0,
      fat: 0,
      fiber: 0,
    };
  }

  const multiplier =
    amount / food.servingSize;

  return {
    calories:
      food.calories * multiplier,
    protein:
      food.protein * multiplier,
    carbohydrates:
      food.carbohydrates * multiplier,
    fat:
      food.fat * multiplier,
    fiber:
      food.fiber * multiplier,
  };
}

export const foodDatabaseStats = {
  total: foodDatabase.length,

  local:
    foodDatabase.filter(
      (food) =>
        food.cuisine === "local"
    ).length,

  international:
    foodDatabase.filter(
      (food) =>
        food.cuisine === "other"
    ).length,

  breakfast:
    foodDatabase.filter(
      (food) =>
        food.suitableMeals.includes(
          "breakfast"
        )
    ).length,

  lunch:
    foodDatabase.filter(
      (food) =>
        food.suitableMeals.includes(
          "lunch"
        )
    ).length,

  dinner:
    foodDatabase.filter(
      (food) =>
        food.suitableMeals.includes(
          "dinner"
        )
    ).length,

  snack:
    foodDatabase.filter(
      (food) =>
        food.suitableMeals.includes(
          "snack"
        )
    ).length,

  highProtein:
    foodDatabase.filter(
      (food) =>
        food.protein >= 10
    ).length,

  highFiber:
    foodDatabase.filter(
      (food) =>
        food.fiber >= 5
    ).length,
};