import { Ionicons } from "@expo/vector-icons";

export type MacroType = "protein" | "carbs" | "fats";

export type MealType =
  | "breakfast"
  | "lunch"
  | "dinner"
  | "snacks";

export type DashboardMeal = {
  id: string;
  type: MealType;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  calories: number | null;
};

export type DashboardData = {
  user: {
    name: string;
    level: number;
    xp: number;
    xpTarget: number;
  };

  goal: {
    calories: number;
    consumed: number;
  };

  macros: {
    protein: {
      current: number;
      target: number;
      type: "protein";
    };

    carbs: {
      current: number;
      target: number;
      type: "carbs";
    };

    fats: {
      current: number;
      target: number;
      type: "fats";
    };
  };

  meals: DashboardMeal[];

  water: {
    current: number;
    target: number;
    glasses: number;
    totalGlasses: number;
  };

  dailyTip: string;
};

export const dashboardData: DashboardData = {
  user: {
    name: "Faniel",
    level: 12,
    xp: 2850,
    xpTarget: 5000,
  },

  goal: {
    calories: 1850,
    consumed: 1240,
  },

  macros: {
    protein: {
      current: 82,
      target: 120,
      type: "protein",
    },

    carbs: {
      current: 140,
      target: 210,
      type: "carbs",
    },

    fats: {
      current: 38,
      target: 60,
      type: "fats",
    },
  },

  meals: [
    {
      id: "breakfast",
      type: "breakfast",
      icon: "sunny-outline",
      title: "Breakfast",
      description: "Oatmeal, Banana, Protein Shake",
      calories: 420,
    },

    {
      id: "lunch",
      type: "lunch",
      icon: "sunny-outline",
      title: "Lunch",
      description: "Chicken, Rice, Vegetables",
      calories: 580,
    },

    {
      id: "dinner",
      type: "dinner",
      icon: "moon-outline",
      title: "Dinner",
      description: "No meals added",
      calories: null,
    },

    {
      id: "snacks",
      type: "snacks",
      icon: "nutrition-outline",
      title: "Snacks",
      description: "No snacks added",
      calories: null,
    },
  ],

  water: {
    current: 1.6,
    target: 2.5,
    glasses: 5,
    totalGlasses: 7,
  },

  dailyTip:
    "Stay consistent, even on your off days. Your future self will thank you.",
};