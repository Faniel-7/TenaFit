export type ExerciseDifficulty = "Beginner" | "Intermediate";

export type Exercise = {
  id: string;
  name: string;
  muscleGroup: string;
  difficulty: ExerciseDifficulty;
  equipment: string;
  description: string;
  instructions: string[];
};

export const exerciseDatabase: Exercise[] = [
  {
    id: "bodyweight-squats",
    name: "Bodyweight Squats",
    muscleGroup: "Legs",
    difficulty: "Beginner",
    equipment: "None",
    description: "A simple lower-body exercise that targets the thighs and glutes.",
    instructions: [
      "Stand with your feet about shoulder-width apart.",
      "Lower your hips while keeping your chest up.",
      "Push through your feet to return to the starting position.",
    ],
  },
  {
    id: "reverse-lunges",
    name: "Reverse Lunges",
    muscleGroup: "Legs",
    difficulty: "Beginner",
    equipment: "None",
    description: "A controlled unilateral exercise for the legs and glutes.",
    instructions: [
      "Stand tall with your feet together.",
      "Step one foot backward and lower your body.",
      "Push through the front foot and return to standing.",
    ],
  },
  {
    id: "push-ups",
    name: "Push-ups",
    muscleGroup: "Chest",
    difficulty: "Beginner",
    equipment: "None",
    description: "A bodyweight upper-body exercise targeting the chest, shoulders, and triceps.",
    instructions: [
      "Start in a high plank position.",
      "Lower your chest toward the floor while keeping your body straight.",
      "Push through your hands to return to the starting position.",
    ],
  },
  {
    id: "mountain-climbers",
    name: "Mountain Climbers",
    muscleGroup: "Full Body",
    difficulty: "Intermediate",
    equipment: "None",
    description: "A dynamic exercise that combines core stability with cardiovascular movement.",
    instructions: [
      "Start in a high plank position.",
      "Drive one knee toward your chest.",
      "Switch legs quickly while keeping your core engaged.",
    ],
  },
  {
    id: "jumping-jacks",
    name: "Jumping Jacks",
    muscleGroup: "Cardio",
    difficulty: "Beginner",
    equipment: "None",
    description: "A simple full-body movement that raises your heart rate.",
    instructions: [
      "Stand with your feet together.",
      "Jump while moving your feet apart and raising your arms.",
      "Jump back to the starting position.",
    ],
  },
  {
    id: "high-knees",
    name: "High Knees",
    muscleGroup: "Cardio",
    difficulty: "Beginner",
    equipment: "None",
    description: "A cardio exercise that works the legs while increasing heart rate.",
    instructions: [
      "Stand tall with your feet hip-width apart.",
      "Drive one knee upward toward your chest.",
      "Alternate legs while maintaining a steady rhythm.",
    ],
  },
  {
    id: "plank",
    name: "Plank",
    muscleGroup: "Core",
    difficulty: "Beginner",
    equipment: "None",
    description: "An isometric exercise that develops core stability.",
    instructions: [
      "Start on your forearms and toes.",
      "Keep your body in a straight line.",
      "Brace your core and hold the position.",
    ],
  },
  {
    id: "crunches",
    name: "Crunches",
    muscleGroup: "Core",
    difficulty: "Beginner",
    equipment: "None",
    description: "A focused abdominal exercise for developing core strength.",
    instructions: [
      "Lie on your back with your knees bent.",
      "Place your hands beside or behind your head.",
      "Lift your shoulders toward your knees and slowly lower back down.",
    ],
  },
  {
    id: "leg-raises",
    name: "Leg Raises",
    muscleGroup: "Core",
    difficulty: "Intermediate",
    equipment: "None",
    description: "A core exercise that emphasizes the lower abdominal region.",
    instructions: [
      "Lie flat on your back with your legs extended.",
"Raise your legs while keeping them controlled.",
      "Slowly lower them without letting them drop.",
    ],
  },
  {
    id: "dead-bug",
    name: "Dead Bug",
    muscleGroup: "Core",
    difficulty: "Beginner",
    equipment: "None",
    description: "A controlled core exercise that improves stability and coordination.",
    instructions: [
      "Lie on your back with your arms raised and knees bent.",
      "Extend the opposite arm and leg while keeping your lower back stable.",
      "Return to the starting position and switch sides.",
    ],
  },
  {
    id: "glute-bridge",
    name: "Glute Bridge",
    muscleGroup: "Glutes",
    difficulty: "Beginner",
    equipment: "None",
    description: "A lower-body exercise focused on the glutes and hips.",
    instructions: [
      "Lie on your back with your knees bent.",
      "Drive your hips upward while squeezing your glutes.",
      "Lower your hips slowly and repeat.",
    ],
  },
  {
    id: "calf-raises",
    name: "Calf Raises",
    muscleGroup: "Calves",
    difficulty: "Beginner",
    equipment: "None",
    description: "A simple exercise for strengthening the calf muscles.",
    instructions: [
      "Stand tall with your feet comfortably apart.",
      "Raise your heels while balancing on the balls of your feet.",
      "Lower your heels slowly and repeat.",
    ],
  },
  {
    id: "wall-sit",
    name: "Wall Sit",
    muscleGroup: "Legs",
    difficulty: "Intermediate",
    equipment: "Wall",
    description: "An isometric lower-body exercise that builds leg endurance.",
    instructions: [
      "Place your back against a wall.",
      "Slide down until your knees are bent.",
      "Hold the position while keeping your back against the wall.",
    ],
  },
  {
    id: "bird-dog",
    name: "Bird Dog",
    muscleGroup: "Core",
    difficulty: "Beginner",
    equipment: "None",
    description: "A stability exercise for the core, back, and hips.",
    instructions: [
      "Start on your hands and knees.",
      "Extend one arm and the opposite leg.",
      "Return slowly and alternate sides.",
    ],
  },
  {
    id: "burpees",
    name: "Burpees",
    muscleGroup: "Full Body",
    difficulty: "Intermediate",
    equipment: "None",
    description: "A demanding full-body movement combining strength and cardio.",
    instructions: [
      "Start standing and lower into a squat.",
      "Place your hands down and move into a plank.",
      "Return to a squat and jump upward.",
    ],
  },
];

export function searchExercises(query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return exerciseDatabase;
  }

  return exerciseDatabase.filter((exercise) =>
    `${exercise.name} ${exercise.muscleGroup} ${exercise.difficulty} ${exercise.equipment}`
      .toLowerCase()
      .includes(normalizedQuery)
  );
}