export type Gender = "male" | "female";

export type WeightGoal =
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

export interface UserProfile {
  age: number;
  gender: Gender;

  heightCm: number;
  weightKg: number;

  goal: WeightGoal;

  activityLevel: ActivityLevel;

  daysPerWeek: number;
  minutesPerDay: number;

  foodPreference: FoodPreference;
}