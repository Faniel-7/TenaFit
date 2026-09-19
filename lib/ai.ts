import { NutritionTarget } from "../logic/nutritionCalculator";
import { UserProfile } from "../types/userProfile";

export interface AIRecommendationInput {
  profile: UserProfile;
  nutritionTarget: NutritionTarget;
  caloriesConsumed: number;
  proteinConsumed: number;
  carbohydratesConsumed: number;
  fatConsumed: number;
  waterConsumed: number;
  steps: number;
}

export interface AIRecommendationResponse {
  recommendation: string;
}

const AI_API_URL =
  process.env.EXPO_PUBLIC_AI_API_URL || "http://localhost:3000/api/ai";

function buildPrompt(input: AIRecommendationInput): string {
  const {
    profile,
    nutritionTarget,
    caloriesConsumed,
    proteinConsumed,
    carbohydratesConsumed,
    fatConsumed,
    waterConsumed,
    steps,
  } = input;

  const remainingCalories = Math.max(
    nutritionTarget.calories - caloriesConsumed,
    0
  );

  const remainingProtein = Math.max(
    nutritionTarget.proteinGrams - proteinConsumed,
    0
  );

  const remainingCarbohydrates = Math.max(
    nutritionTarget.carbohydrateGrams - carbohydratesConsumed,
    0
  );

  const remainingFat = Math.max(
    nutritionTarget.fatGrams - fatConsumed,
    0
  );

  return `
You are TenaFit AI, a personalized nutrition coach.

USER PROFILE
Age: ${profile.age}
Gender: ${profile.gender}
Weight: ${profile.weightKg} kg
Height: ${profile.heightCm} cm
Goal: ${profile.goal}
Activity level: ${profile.activityLevel}
Food preference: ${profile.foodPreference}

DAILY TARGETS
Calories: ${nutritionTarget.calories} kcal
Protein: ${nutritionTarget.proteinGrams} g
Carbohydrates: ${nutritionTarget.carbohydrateGrams} g
Fat: ${nutritionTarget.fatGrams} g
Minimum fiber: ${nutritionTarget.fiberMinGrams} g

TODAY'S PROGRESS
Calories consumed: ${caloriesConsumed} kcal
Protein consumed: ${proteinConsumed} g
Carbohydrates consumed: ${carbohydratesConsumed} g
Fat consumed: ${fatConsumed} g
Water consumed: ${waterConsumed} L
Steps: ${steps}

REMAINING TARGET
Calories: ${remainingCalories} kcal
Protein: ${remainingProtein} g
Carbohydrates: ${remainingCarbohydrates} g
Fat: ${remainingFat} g

TASK

Analyze the user's current progress and give practical nutrition guidance for the rest of the day.

Consider the user's goal, activity level, food preference, current intake, and remaining targets.

If recommending food, make the recommendation realistic for the user's food preference.

Do not automatically describe Ethiopian food as healthy. Consider its actual nutritional characteristics.

Keep the response concise, practical, and easy to understand.

Do not provide medical diagnoses or claim to replace a healthcare professional.
`;
}

export async function getAIRecommendation(
  input: AIRecommendationInput
): Promise<string> {
  const prompt = buildPrompt(input);

  let response: Response;

  try {
    response = await fetch(AI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });
  } catch {
    throw new Error(
      "TenaFit AI could not connect to the AI server. Please check your internet connection and try again."
    );
  }

  if (!response.ok) {
    let message = "Unable to generate an AI recommendation.";

    try {
      const errorData = await response.json();

      if (typeof errorData?.error === "string") {
        message = errorData.error;
      }
    } catch {}

    throw new Error(message);
  }

  let data: AIRecommendationResponse | { recommendation?: string };

  try {
    data = await response.json();
  } catch {
    throw new Error("The AI server returned an invalid response.");
  }

  if (
    !data ||
    typeof data.recommendation !== "string" ||
    !data.recommendation.trim()
  ) {
    throw new Error("AI returned an empty recommendation.");
  }

  return data.recommendation.trim();
}