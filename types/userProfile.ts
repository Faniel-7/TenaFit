import { UserGoal } from "./nutrition";

export type Gender =
  | "male"
  | "female";

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

  gender: Gender;

  heightCm: number;

  weightKg: number;

  goal: UserGoal;

  activityLevel: ActivityLevel;

  daysPerWeek: number;

  minutesPerDay: number;

  foodPreference: FoodPreference;
}