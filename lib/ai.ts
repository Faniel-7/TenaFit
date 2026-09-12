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

export async function getAIRecommendation(
  input: AIRecommendationInput
): Promise<string> {
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

  const prompt = `
You are TenaFit, a personalized nutrition coach.

User profile:
Age: ${profile.age}
Gender: ${profile.gender}
Weight: ${profile.weightKg} kg
Height: ${profile.heightCm} cm
Goal: ${profile.goal}
Activity level: ${profile.activityLevel}
Food preference: ${profile.foodPreference}

Daily nutrition targets:
Calories: ${nutritionTarget.calories} kcal
Protein: ${nutritionTarget.proteinGrams} g
Carbohydrates: ${nutritionTarget.carbohydrateGrams} g
Fat: ${nutritionTarget.fatGrams} g
Minimum fiber: ${nutritionTarget.fiberMinGrams} g

Today's consumption:
Calories: ${caloriesConsumed} kcal
Protein: ${proteinConsumed} g
Carbohydrates: ${carbohydratesConsumed} g
Fat: ${fatConsumed} g
Water: ${waterConsumed} L
Steps: ${steps}

Give practical nutrition advice based on the user's goal and today's progress.

Keep the response concise and useful.
Recommend what the user should focus on for the rest of the day.
Do not invent medical diagnoses.
Use foods that are realistic for the user's food preference.
`;

  const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error("Unable to generate AI recommendation.");
  }

  const data = await response.json();

  const text =
    data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("AI returned an empty recommendation.");
  }

  return text;
}