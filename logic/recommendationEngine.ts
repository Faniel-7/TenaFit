import {
  Food,
  MealType,
} from "../types/nutrition";

import {
  UserProfile,
} from "../types/userProfile";

import {
  foodDatabase,
} from "../data/foods/foodDatabase";

import {
  filterFoods,
} from "./foodFilter";

import {
  calculateNutritionTarget,
} from "./nutritionCalculator";

import {
  calculateMealTarget,
} from "./mealTargets";

export interface MealRecommendation {
  meal: MealType;
  foods: Food[];
}

/*
=========================================================
FOOD ROLE
=========================================================
*/

type FoodRole =
  | "protein"
  | "carbohydrate"
  | "vegetable"
  | "fruit"
  | "fat"
  | "dairy"
  | "other";

function getFoodRole(
  food: Food
): FoodRole {
  switch (food.category) {
    case "meat":
    case "egg":
    case "fish":
    case "legume":
      return "protein";

    case "cereal":
    case "root":
      return "carbohydrate";

    case "vegetable":
    case "soup":
      return "vegetable";

    case "fruit":
      return "fruit";

    case "nut":
    case "oil":
      return "fat";

    case "dairy":
      return "dairy";

    default:
      return "other";
  }
}

/*
=========================================================
MEAL ROLE PRIORITY
=========================================================
*/

function getPreferredRoles(
  meal: MealType
): FoodRole[] {
  switch (meal) {
    case "breakfast":
      return [
        "protein",
        "carbohydrate",
        "fruit",
        "dairy",
      ];

    case "lunch":
      return [
        "protein",
        "carbohydrate",
        "vegetable",
      ];

    case "dinner":
      return [
        "protein",
        "vegetable",
        "carbohydrate",
      ];

    case "snack":
      return [
        "protein",
        "fruit",
        "dairy",
        "fat",
      ];

    default:
      return [
        "protein",
        "carbohydrate",
      ];
  }
}

/*
=========================================================
GOAL KEY
=========================================================
*/

function getGoalKey(
  profile: UserProfile
): keyof Food["suitableFor"] {
  switch (profile.goal) {
    case "lose":
      return "weightLoss";

    case "maintain":
      return "maintenance";

    case "gain":
      return "weightGain";
  }
}

/*
=========================================================
GOAL SCORE
=========================================================
*/

function getGoalScore(
  food: Food,
  profile: UserProfile
): number {
  const goalKey =
    getGoalKey(profile);

  return food.suitableFor[
    goalKey
  ]
    ? 20
    : 0;
}

/*
=========================================================
PREFERENCE SCORE
=========================================================
*/

function getPreferenceScore(
  food: Food,
  preference: UserProfile["foodPreference"]
): number {
  if (
    preference === "local"
  ) {
    return food.cuisine ===
      "local"
      ? 15
      : 0;
  }

  if (
    preference === "other"
  ) {
    return food.cuisine ===
      "other"
      ? 15
      : 0;
  }

  /*
   * Mixed:
   * both local and other foods are valid.
   *
   * Give local foods a small preference so
   * Ethiopian foods remain well represented.
   */
  return food.cuisine ===
    "local"
    ? 12
    : 10;
}

/*
=========================================================
PROTEIN SCORE
=========================================================
*/

function getProteinScore(
  food: Food,
  mealProtein: number
): number {
  if (
    mealProtein <= 0
  ) {
    return 0;
  }

  /*
   * One food should contribute only part
   * of the meal's protein requirement.
   */
  const desiredProtein =
    mealProtein * 0.35;

  const difference =
    Math.abs(
      food.protein -
        desiredProtein
    );

  const normalizedDifference =
    difference /
    Math.max(
      mealProtein,
      1
    );

  return Math.max(
    0,
    25 -
      normalizedDifference * 25
  );
}

/*
=========================================================
CALORIE SCORE
=========================================================
*/
function getCalorieScore(
  food: Food,
  mealCalories: number
): number {
  if (
    mealCalories <= 0
  ) {
    return 0;
  }

  /*
   * A single food is not expected to
   * provide the whole meal's calories.
   *
   * We compare it against approximately
   * 35% of the meal target.
   */
  const desiredCalories =
    mealCalories * 0.35;

  const difference =
    Math.abs(
      food.calories -
        desiredCalories
    );

  const normalizedDifference =
    difference /
    Math.max(
      mealCalories,
      1
    );

  return Math.max(
    0,
    25 -
      normalizedDifference * 25
  );
}

/*
=========================================================
FIBER SCORE
=========================================================
*/

function getFiberScore(
  food: Food,
  mealFiber: number,
  profile: UserProfile
): number {
  if (
    mealFiber <= 0
  ) {
    return 0;
  }

  const fiberRatio =
    food.fiber /
    Math.max(
      mealFiber,
      1
    );

  let score =
    Math.min(
      fiberRatio * 10,
      10
    );

  /*
   * Fiber receives additional importance
   * for weight-loss recommendations.
   */
  if (
    profile.goal === "lose"
  ) {
    score += Math.min(
      fiberRatio * 5,
      5
    );
  }

  return score;
}

/*
=========================================================
ROLE SCORE
=========================================================
*/

function getRoleScore(
  food: Food,
  meal: MealType
): number {
  const role =
    getFoodRole(food);

  const preferredRoles =
    getPreferredRoles(meal);

  const position =
    preferredRoles.indexOf(
      role
    );

  if (position === 0) {
    return 12;
  }

  if (position === 1) {
    return 10;
  }

  if (position === 2) {
    return 8;
  }

  if (position >= 0) {
    return 6;
  }

  return 2;
}

/*
=========================================================
TAG SCORE
=========================================================
*/

function getTagScore(
  food: Food,
  profile: UserProfile
): number {
  let score = 0;

  const tags =
    food.tags.map(
      (tag) =>
        tag.toLowerCase()
    );

  /*
   * Weight loss
   */
  if (
    profile.goal === "lose"
  ) {
    if (
      food.fiber >= 4
    ) {
      score += 5;
    }

    if (
      tags.some(
        (tag) =>
          tag.includes("fiber")
      )
    ) {
      score += 5;
    }

    if (
      food.calories <= 150
    ) {
      score += 3;
    }
  }

  /*
   * Maintenance
   */
  if (
    profile.goal ===
    "maintain"
  ) {
    if (
      food.protein >= 8
    ) {
      score += 4;
    }

    if (
      food.fiber >= 3
    ) {
      score += 4;
    }
  }

  /*
   * Weight gain
   */
  if (
    profile.goal === "gain"
  ) {
    if (
      food.calories >= 200
    ) {
      score += 7;
    }

    if (
      food.protein >= 8
    ) {
      score += 5;
    }

    if (
      tags.some(
        (tag) =>
          tag.includes(
            "energy"
          )
      )
    ) {
      score += 3;
    }
  }

  /*
   * Protein-related tags
   */
  if (
    tags.some(
      (tag) =>
        tag.includes(
          "protein"
        )
    )
  ) {
    score += 4;
  }

  return score;
}

/*
=========================================================
ACTIVITY SCORE
=========================================================
*/

function getActivityScore(
  food: Food,
  profile: UserProfile
): number {
  let score = 0;

  const highProtein =
    food.protein >= 10;

  const highCalories =
    food.calories >= 200;

  if (
    profile.activityLevel ===
      "hard" &&
    highProtein
  ) {
    score += 8;
  }

  if (
    profile.activityLevel ===
      "moderate" &&
    highProtein
  ) {
    score += 5;
  }

  if (
    profile.activityLevel ===
      "light" &&
    food.fiber >= 3
  ) {
    score += 3;
  }

  if (
    profile.activityLevel ===
      "sedentary" &&
    !highCalories
  ) {
    score += 3;
  }

  return score;
}

/*
=========================================================
TOTAL FOOD SCORE
=========================================================
*/
function calculateFoodScore(
  food: Food,
  profile: UserProfile,
  meal: MealType
): number {
  const dailyTargets =
    calculateNutritionTarget({
      age: profile.age,
      gender: profile.gender,
      weightKg:
        profile.weightKg,
      heightCm:
        profile.heightCm,
      activityLevel:
        profile.activityLevel,
      goal: profile.goal,
    });

  const mealTarget =
    calculateMealTarget(
      dailyTargets,
      meal
    );

  const calorieScore =
    getCalorieScore(
      food,
      mealTarget.calories
    );

  const proteinScore =
    getProteinScore(
      food,
      mealTarget.proteinGrams
    );

  const fiberScore =
    getFiberScore(
      food,
      mealTarget.fiberGrams,
      profile
    );

  const roleScore =
    getRoleScore(
      food,
      meal
    );

  const goalScore =
    getGoalScore(
      food,
      profile
    );

  const preferenceScore =
    getPreferenceScore(
      food,
      profile.foodPreference
    );

  const tagScore =
    getTagScore(
      food,
      profile
    );

  const activityScore =
    getActivityScore(
      food,
      profile
    );

  return (
    calorieScore +
    proteinScore +
    fiberScore +
    roleScore +
    goalScore +
    preferenceScore +
    tagScore +
    activityScore
  );
}

/*
=========================================================
RANK FOODS
=========================================================
*/

function rankFoods(
  foods: Food[],
  profile: UserProfile,
  meal: MealType
): Food[] {
  return [...foods]
    .map((food) => ({
      food,
      score:
        calculateFoodScore(
          food,
          profile,
          meal
        ),
    }))
    .sort((a, b) => {
      /*
       * Highest recommendation score first.
       */
      if (
        b.score !==
        a.score
      ) {
        return (
          b.score -
          a.score
        );
      }

      /*
       * If scores are equal,
       * prefer higher protein.
       */
      if (
        b.food.protein !==
        a.food.protein
      ) {
        return (
          b.food.protein -
          a.food.protein
        );
      }

      /*
       * Final stable tie-breaker.
       */
      return a.food.name.localeCompare(
        b.food.name
      );
    })
    .map(
      (item) =>
        item.food
    );
}

/*
=========================================================
GET RECOMMENDED FOODS
=========================================================
*/

export function getRecommendedFoods(
  profile: UserProfile,
  meal: MealType,
  limit = 5
): Food[] {
  const goal =
    getGoalKey(profile);

  /*
   * Step 1:
   * Filter foods using the existing
   * TenaFit filtering system.
   */
  const filtered =
    filterFoods(
      foodDatabase,
      profile.foodPreference,
      goal,
      meal
    );

  /*
   * Step 2:
   * Rank the foods according to
   * personalized nutrition.
   */
  const ranked =
    rankFoods(
      filtered,
      profile,
      meal
    );

  /*
   * Step 3:
   * Return only requested number.
   */
  return ranked.slice(
    0,
    Math.max(
      0,
      limit
    )
  );
}

/*
=========================================================
GET DAILY RECOMMENDATIONS
=========================================================
*/

export function getDailyRecommendations(
  profile: UserProfile
): MealRecommendation[] {
  const meals: MealType[] = [
    "breakfast",
    "lunch",
    "dinner",
    "snack",
  ];

  return meals.map(
    (meal) => ({
      meal,
      foods:
        getRecommendedFoods(
          profile,
          meal,
          5
        ),
    })
  );
}