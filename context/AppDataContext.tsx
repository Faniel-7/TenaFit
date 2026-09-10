import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserProfile } from "../storage/profileStorage";
import { calculateNutritionTarget } from "../logic/nutritionCalculator";
import type { Food, MealType } from "../types/nutrition";

type TrackedMeal = {
  id: string;
  food: Food;
  mealType: MealType;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

type DailyData = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
  steps: number;
};

type AppDataContextValue = {
  data: DailyData;
  goals: DailyData;
  meals: TrackedMeal[];
  calorieProgress: number;
  proteinProgress: number;
  carbsProgress: number;
  fatProgress: number;
  waterProgress: number;
  stepsProgress: number;
  overallProgress: number;
  addMeal: (
    food: Food,
    mealType: MealType,
    calories?: number,
    protein?: number,
    carbs?: number,
    fat?: number
  ) => Promise<void>;
  removeMeal: (id: string) => Promise<void>;
  addWater: (amount: number) => Promise<void>;
  addSteps: (amount: number) => Promise<void>;
  resetDay: () => Promise<void>;
};

const STORAGE_KEY = "@tenafit_day_data";

const defaultData: DailyData = {
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  water: 0,
  steps: 0,
};

const defaultGoals: DailyData = {
  calories: 2409,
  protein: 140,
  carbs: 300,
  fat: 80,
  water: 3.2,
  steps: 7500,
};

const AppDataContext = createContext<AppDataContextValue | undefined>(
  undefined
);

export function AppDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [data, setData] = useState<DailyData>(defaultData);
  const [goals, setGoals] = useState<DailyData>(defaultGoals);
  const [meals, setMeals] = useState<TrackedMeal[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedData = await AsyncStorage.getItem(STORAGE_KEY);

        if (storedData) {
          const parsed = JSON.parse(storedData);

          setData({
            ...defaultData,
            ...parsed.data,
          });

          setMeals(parsed.meals ?? []);
        }

        const profile = await getUserProfile();

        if (profile) {
          const targets = calculateNutritionTarget(profile);

          setGoals({
            calories: targets.calories,
            protein: targets.proteinGrams,
            carbs: targets.carbohydrateGrams,
            fat: targets.fatGrams,
            water: defaultGoals.water,
            steps: defaultGoals.steps,
          });
        }
      } catch {
        setData(defaultData);
        setMeals([]);
        setGoals(defaultGoals);
      }
    };

    loadData();
  }, []);

  const saveState = useCallback(
    async (newData: DailyData, newMeals: TrackedMeal[]) => {
      setData(newData);
      setMeals(newMeals);

      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          data: newData,
          meals: newMeals,
        })
      );
    },
    []
  );

  const addMeal = useCallback(
    async (
      food: Food,
      mealType: MealType,
      calories = food.calories,
      protein = food.protein,
      carbs = food.carbohydrates,
      fat = food.fat
    ) => {
      const trackedMeal: TrackedMeal = {
        id: `${food.id}-${Date.now()}`,
        food,
        mealType,
        calories,
        protein,
        carbs,
        fat,
      };

      const newMeals = [...meals, trackedMeal];

      const newData: DailyData = {
        ...data,
        calories: data.calories + calories,
        protein: data.protein + protein,
        carbs: data.carbs + carbs,
        fat: data.fat + fat,
      };

      await saveState(newData, newMeals);
    },
    [data, meals, saveState]
  );

  const removeMeal = useCallback(
    async (id: string) => {
      const meal = meals.find((item) => item.id === id);

      if (!meal) {
        return;
      }

      const newMeals = meals.filter((item) => item.id !== id);
const newData: DailyData = {
        ...data,
        calories: Math.max(0, data.calories - meal.calories),
        protein: Math.max(0, data.protein - meal.protein),
        carbs: Math.max(0, data.carbs - meal.carbs),
        fat: Math.max(0, data.fat - meal.fat),
      };

      await saveState(newData, newMeals);
    },
    [data, meals, saveState]
  );

  const addWater = useCallback(
    async (amount: number) => {
      const newData: DailyData = {
        ...data,
        water: data.water + amount,
      };

      await saveState(newData, meals);
    },
    [data, meals, saveState]
  );

  const addSteps = useCallback(
    async (amount: number) => {
      const newData: DailyData = {
        ...data,
        steps: data.steps + amount,
      };

      await saveState(newData, meals);
    },
    [data, meals, saveState]
  );

  const resetDay = useCallback(async () => {
    await saveState(defaultData, []);
  }, [saveState]);

  const calorieProgress = useMemo(
    () => Math.min(data.calories / Math.max(goals.calories, 1), 1),
    [data.calories, goals.calories]
  );

  const proteinProgress = useMemo(
    () => Math.min(data.protein / Math.max(goals.protein, 1), 1),
    [data.protein, goals.protein]
  );

  const carbsProgress = useMemo(
    () => Math.min(data.carbs / Math.max(goals.carbs, 1), 1),
    [data.carbs, goals.carbs]
  );

  const fatProgress = useMemo(
    () => Math.min(data.fat / Math.max(goals.fat, 1), 1),
    [data.fat, goals.fat]
  );

  const waterProgress = useMemo(
    () => Math.min(data.water / Math.max(goals.water, 0.1), 1),
    [data.water, goals.water]
  );

  const stepsProgress = useMemo(
    () => Math.min(data.steps / Math.max(goals.steps, 1), 1),
    [data.steps, goals.steps]
  );

  const overallProgress = useMemo(
    () =>
      Math.round(
        ((calorieProgress +
          proteinProgress +
          carbsProgress +
          fatProgress +
          waterProgress +
          stepsProgress) /
          6) *
          100
      ),
    [
      calorieProgress,
      proteinProgress,
      carbsProgress,
      fatProgress,
      waterProgress,
      stepsProgress,
    ]
  );

  const value = useMemo(
    () => ({
      data,
      goals,
      meals,
      calorieProgress,
      proteinProgress,
      carbsProgress,
      fatProgress,
      waterProgress,
      stepsProgress,
      overallProgress,
      addMeal,
      removeMeal,
      addWater,
      addSteps,
      resetDay,
    }),
    [
      data,
      goals,
      meals,
      calorieProgress,
      proteinProgress,
      carbsProgress,
      fatProgress,
      waterProgress,
      stepsProgress,
      overallProgress,
      addMeal,
      removeMeal,
      addWater,
      addSteps,
      resetDay,
    ]
  );

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppDataContext);

  if (!context) {
    throw new Error("useAppData must be used inside AppDataProvider");
  }

  return context;
}