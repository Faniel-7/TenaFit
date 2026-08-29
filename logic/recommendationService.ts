import { UserProfile } from "../types/userProfile";
import { MealType } from "../types/nutrition";

import {
  calculateNutritionTarget,
} from "./nutritionCalculator";

import {
  calculateAllMealTargets,
} from "./mealTargets";

import {
  generateDailyMealPlan,
} from "./dailyMealPlanner";

/*
=========================================================
TenaFit Recommendation Service
=========================================================

This is the main entry point for our LOCAL
recommendation system.

The UI should eventually call this service instead of
calling many different recommendation functions itself.

Flow:

User Profile
     ↓
Nutrition Calculator
     ↓
Meal Targets
     ↓
Meal Planner
     ↓
Recommendations
*/

/*
=========================================================
RESULT
=========================================================
*/

export interface RecommendationResult {
  nutrition: ReturnType<
    typeof calculateNutritionTarget
  >;

  mealTargets: ReturnType<
    typeof calculateAllMealTargets
  >;

  dailyPlan: ReturnType<
    typeof generateDailyMealPlan
  >;
}

/*
=========================================================
GENERATE RECOMMENDATIONS
=========================================================
*/

export function generateRecommendations(
  profile: UserProfile
): RecommendationResult {
  /*
   * Calculate personalized nutrition targets.
   */
  const nutrition =
    calculateNutritionTarget(
      {
        age: profile.age,

        gender: profile.gender,

        weightKg:
          profile.weightKg,

        heightCm:
          profile.heightCm,

        activityLevel:
          profile.activityLevel,

        goal:
          profile.goal,
      }
    );

  /*
   * Convert daily targets into targets
   * for breakfast, lunch, dinner and snack.
   */
  const mealTargets =
    calculateAllMealTargets(
      nutrition
    );

  /*
   * Build the complete daily meal plan.
   */
  const dailyPlan =
    generateDailyMealPlan(
      profile,
      nutrition.targetCalories
    );

  return {
    nutrition,
    mealTargets,
    dailyPlan,
  };
}

/*
=========================================================
GET ONE MEAL
=========================================================
*/

export function getRecommendedMeal(
  profile: UserProfile,
  meal: MealType
) {
  const result =
    generateRecommendations(
      profile
    );

  return result.dailyPlan[
    meal
  ];
}