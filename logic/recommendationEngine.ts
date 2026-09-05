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

export interface MealRecommendation {
  meal: MealType;

  foods: Food[];
}

/*
=========================================================
MEAL CALORIE DISTRIBUTION
=========================================================
*/

function getMealCaloriePercentage(
  meal: MealType
): number {
  switch (meal) {
    case "breakfast":
      return 0.25;

    case "lunch":
      return 0.35;

    case "dinner":
      return 0.30;

    case "snack":
      return 0.10;

    default:
      return 0;
  }
}

/*
=========================================================
FOOD CALORIE SCORE
=========================================================
*/

function getCalorieScore(
  food: Food,
  targetCalories: number
): number {
  if (targetCalories <= 0) {
    return 0;
  }

  const difference =
    Math.abs(
      food.calories -
        targetCalories
    );

  const percentageDifference =
    difference /
    targetCalories;

  /*
   * Closer calories = higher score.
   *
   * Maximum = 30 points.
   */
  return Math.max(
    0,
    30 -
      percentageDifference * 30
  );
}

/*
=========================================================
PROTEIN SCORE
=========================================================
*/

function getProteinScore(
  food: Food,
  targetProtein: number
): number {
  if (targetProtein <= 0) {
    return 0;
  }

  const difference =
    Math.abs(
      food.protein -
        targetProtein
    );

  const percentageDifference =
    difference /
    targetProtein;

  /*
   * Maximum = 25 points.
   */
  return Math.max(
    0,
    25 -
      percentageDifference * 25
  );
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
  const goalKey:
    keyof typeof food.suitableFor =
    profile.goal === "lose"
      ? "weightLoss"
      : profile.goal === "maintain"
        ? "maintenance"
        : "weightGain";

  if (
    food.suitableFor[goalKey]
  ) {
    return 20;
  }

  return 0;
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

  /*
   * Weight loss:
   * favor higher fiber foods.
   */
  if (
    profile.goal ===
      "lose" &&
    food.tags.some(
      (tag) =>
        tag
          .toLowerCase()
          .includes("fiber")
    )
  ) {
    score += 10;
  }

  /*
   * Weight gain:
   * favor energy-dense foods.
   */
  if (
    profile.goal ===
      "gain" &&
    food.calories >= 200
  ) {
    score += 10;
  }

  /*
   * High protein is useful for
   * active users.
   */
  if (
    food.tags.some(
      (tag) =>
        tag
          .toLowerCase()
          .includes(
            "protein"
          )
    )
  ) {
    score += 5;
  }

  return score;
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
  /*
   * LOCAL
   *
   * Local foods receive maximum score.
   */
  if (preference === "local") {
    return food.cuisine === "local"
      ? 15
      : 0;
  }

  /*
   * OTHER
   *
   * International/other foods receive
   * maximum score.
   */
  if (preference === "other") {
    return food.cuisine === "other"
      ? 15
      : 0;
  }

  /*
   * MIXED
   *
   * Both are allowed.
   *
   * Other foods receive higher priority,
   * according to the agreed recommendation
   * behavior.
   */
  if (
    food.cuisine === "other"
  ) {
    return 15;
  }

  return 8;
}
/*
=========================================================
CALCULATE FOOD SCORE
=========================================================
*/

function calculateFoodScore(
  food: Food,
  profile: UserProfile,
  meal: MealType
): number {
  const targets =
    calculateNutritionTarget({
      age: profile.age,
      gender: profile.gender,
      weightKg: profile.weightKg,
      heightCm: profile.heightCm,
      activityLevel:
        profile.activityLevel,
      goal: profile.goal,
    });

  /*
   * Estimate the calories for this
   * particular meal.
   */
  const mealCalories =
    targets.targetCalories *
    getMealCaloriePercentage(
      meal
    );

  /*
   * Estimate protein for this meal.
   */
  const mealProtein =
    targets.proteinGrams *
    getMealCaloriePercentage(
      meal
    );

  const calorieScore =
    getCalorieScore(
      food,
      mealCalories
    );

  const proteinScore =
    getProteinScore(
      food,
      mealProtein
    );

  const goalScore =
    getGoalScore(
      food,
      profile
    );

  const tagScore =
    getTagScore(
      food,
      profile
    );

  const preferenceScore =
    getPreferenceScore(
      food,
      profile.foodPreference
    );

  return (
    calorieScore +
    proteinScore +
    goalScore +
    tagScore +
    preferenceScore
  );
}

/*
=========================================================
SORT FOODS
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
    .sort(
      (a, b) =>
        b.score -
        a.score
    )
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
  const userGoal =
    profile.goal === "lose"
      ? "weightLoss"
      : profile.goal === "maintain"
        ? "maintenance"
        : "weightGain";

  const filtered =
    filterFoods(
      foodDatabase,
      profile.foodPreference,
      userGoal,
      meal
    );

  const ranked =
    rankFoods(
      filtered,
      profile,
      meal
    );

  return ranked.slice(
    0,
    limit
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