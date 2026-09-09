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
import type { UserProfile } from "../types/userProfile";

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
  calorieProgress: number;
  proteinProgress: number;
  carbsProgress: number;
  fatProgress: number;
  waterProgress: number;
  stepsProgress: number;
  overallProgress: number;
  addMeal: (calories: number, protein: number, carbs: number, fat: number) => Promise<void>;
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

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedData = await AsyncStorage.getItem(STORAGE_KEY);

        if (storedData) {
          setData({
            ...defaultData,
            ...JSON.parse(storedData),
          });
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
        setGoals(defaultGoals);
      }
    };

    loadData();
  }, []);

  const saveData = useCallback(async (newData: DailyData) => {
    setData(newData);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  }, []);

  const addMeal = useCallback(
    async (
      calories: number,
      protein: number,
      carbs: number,
      fat: number
    ) => {
      const newData: DailyData = {
        ...data,
        calories: data.calories + calories,
        protein: data.protein + protein,
        carbs: data.carbs + carbs,
        fat: data.fat + fat,
      };

      await saveData(newData);
    },
    [data, saveData]
  );

  const addWater = useCallback(
    async (amount: number) => {
      const newData: DailyData = {
        ...data,
        water: data.water + amount,
      };

      await saveData(newData);
    },
    [data, saveData]
  );

  const addSteps = useCallback(
    async (amount: number) => {
      const newData: DailyData = {
        ...data,
        steps: data.steps + amount,
      };

      await saveData(newData);
    },
    [data, saveData]
  );

  const resetDay = useCallback(async () => {
    await saveData(defaultData);
  }, [saveData]);

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
      calorieProgress,
      proteinProgress,
      carbsProgress,
      fatProgress,
      waterProgress,
      stepsProgress,
      overallProgress,
      addMeal,
      addWater,
      addSteps,
      resetDay,
    }),
    [
      data,
      goals,
      calorieProgress,
      proteinProgress,
      carbsProgress,
      fatProgress,
      waterProgress,
      stepsProgress,
      overallProgress,
      addMeal,
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