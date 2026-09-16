export type WorkoutHistoryEntry = {
  id: string;
  workoutId: string;
  workoutName: string;
  focus: string;
  duration: number;
  completedSets: number;
  totalSets: number;
  completedExercises: number;
  totalExercises: number;
  stepsAdded: number;
  completedAt: string;
};