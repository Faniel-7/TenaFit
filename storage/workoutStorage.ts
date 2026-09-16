import AsyncStorage from "@react-native-async-storage/async-storage";
import type { WorkoutHistoryEntry } from "../types/workout";

const WORKOUT_HISTORY_KEY = "@tenafit_workout_history";

export async function getWorkoutHistory(): Promise<
  WorkoutHistoryEntry[]
> {
  try {
    const stored = await AsyncStorage.getItem(
      WORKOUT_HISTORY_KEY
    );

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch {
    return [];
  }
}

export async function saveWorkoutHistory(
  entry: WorkoutHistoryEntry
): Promise<void> {
  const history = await getWorkoutHistory();

  const updatedHistory = [entry, ...history];

  await AsyncStorage.setItem(
    WORKOUT_HISTORY_KEY,
    JSON.stringify(updatedHistory)
  );
}

export async function clearWorkoutHistory(): Promise<void> {
  await AsyncStorage.removeItem(WORKOUT_HISTORY_KEY);
}