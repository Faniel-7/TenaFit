import { UserGoal } from "./nutrition";

export type ActivityLevel =
  | "none"
  | "light"
  | "heavy";

export type FoodPreference =
  | "local"
  | "other"
  | "mixed";

export interface UserProfile {
  age: number;

  gender: "male" | "female";

  heightCm: number;

  weightKg: number;

  goal: UserGoal;

  activityLevel: ActivityLevel;

  daysPerWeek: number;

  minutesPerDay: number;

  foodPreference: FoodPreference;
}