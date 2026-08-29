/*
=========================================================
TenaFit - Recommendation Rules
=========================================================

This file contains the rules used by the local
recommendation system.

It does NOT call an AI API.

The purpose is to make our recommendation logic
predictable and explainable.
*/

export type UserGoal =
  | "lose"
  | "maintain"
  | "gain";

export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "hard";

export type FoodPreference =
  | "local"
  | "other"
  | "mixed";

export type RecommendationMeal =
  | "breakfast"
  | "lunch"
  | "dinner"
  | "snack";

/*
=========================================================
CALORIE ADJUSTMENT
=========================================================
*/

export function getGoalCalorieAdjustment(
  goal: UserGoal
): number {
  switch (goal) {
    case "lose":
      return -300;

    case "maintain":
      return 0;

    case "gain":
      return 300;

    default:
      return 0;
  }
}

/*
=========================================================
ACTIVITY MULTIPLIER
=========================================================

These are planning values.

The final nutrition calculator will combine
activity with the user's physical information.
*/

export function getActivityMultiplier(
  activity: ActivityLevel
): number {
  switch (activity) {
    case "sedentary":
      return 1.2;

    case "light":
      return 1.375;

    case "moderate":
      return 1.55;

    case "hard":
      return 1.725;

    default:
      return 1.2;
  }
}

/*
=========================================================
MEAL CALORIE DISTRIBUTION
=========================================================
*/

export function getMealCaloriePercentage(
  meal: RecommendationMeal
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
FOOD PREFERENCE PRIORITY
=========================================================

local:
    Local foods only.

other:
    Non-local foods are prioritized.

mixed:
    Both are allowed, with other foods receiving
    the stronger priority.

IMPORTANT:
The actual food filtering will happen in the
recommendation engine.
*/

export function getFoodPreferencePriority(
  preference: FoodPreference
) {
  switch (preference) {
    case "local":
      return {
        allowLocal: true,
        allowOther: false,
        localWeight: 1,
        otherWeight: 0,
      };

    case "other":
      return {
        allowLocal: false,
        allowOther: true,
        localWeight: 0,
        otherWeight: 1,
      };

    case "mixed":
      return {
        allowLocal: true,
        allowOther: true,

        // Other foods receive higher priority.
        localWeight: 0.35,
        otherWeight: 0.65,
      };

    default:
      return {
        allowLocal: true,
        allowOther: true,
        localWeight: 0.5,
        otherWeight: 0.5,
      };
  }
}

/*
=========================================================
MEAL FOOD ROLES
=========================================================

These describe what a good meal should generally contain.
*/

export function getPreferredFoodRoles(
  meal: RecommendationMeal
): string[] {
  switch (meal) {
    case "breakfast":
      return [
        "protein",
        "carbohydrate",
        "fruit",
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
      ];

    default:
      return [];
  }
}