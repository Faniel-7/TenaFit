import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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

type StoredDayData = {
  date?: string;
  data?: Partial<DailyData>;
  meals?: TrackedMeal[];
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

const getTodayKey = () => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const normalizeData = (
  storedData?: Partial<DailyData>
): DailyData => ({
  calories:
    typeof storedData?.calories === "number"
      ? Math.max(0, storedData.calories)
      : 0,
  protein:
    typeof storedData?.protein === "number"
      ? Math.max(0, storedData.protein)
      : 0,
  carbs:
    typeof storedData?.carbs === "number"
      ? Math.max(0, storedData.carbs)
      : 0,
  fat:
    typeof storedData?.fat === "number"
      ? Math.max(0, storedData.fat)
      : 0,
  water:
    typeof storedData?.water === "number"
      ? Math.max(0, storedData.water)
      : 0,
  steps:
    typeof storedData?.steps === "number"
      ? Math.max(0, storedData.steps)
      : 0,
});

export function AppDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [data, setData] = useState<DailyData>(defaultData);
  const [goals, setGoals] = useState<DailyData>(defaultGoals);
  const [meals, setMeals] = useState<TrackedMeal[]>([]);

  const stateRef = useRef({
    data: defaultData,
    meals: [] as TrackedMeal[],
  });

  const operationQueue = useRef<Promise<void>>(Promise.resolve());

  const updateLocalState = useCallback(
    (newData: DailyData, newMeals: TrackedMeal[]) => {
      stateRef.current = {
        data: newData,
        meals: newMeals,
      };

      setData(newData);
      setMeals(newMeals);
    },
    []
  );

  const persistState = useCallback(
    async (newData: DailyData, newMeals: TrackedMeal[]) => {
      const stateToStore = {
        date: getTodayKey(),
        data: newData,
        meals: newMeals,
      };

      updateLocalState(newData, newMeals);

      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(stateToStore)
      );
    },
    [updateLocalState]
  );

  const enqueue = useCallback(
    (operation: () => Promise<void>) => {
      const nextOperation = operationQueue.current.then(operation);

      operationQueue.current = nextOperation.catch(() => undefined);

      return nextOperation;
    },
    []
  );
useEffect(() => {
    const loadData = async () => {
      try {
        const storedData = await AsyncStorage.getItem(STORAGE_KEY);
        const today = getTodayKey();

        if (storedData) {
          const parsed: StoredDayData = JSON.parse(storedData);

          if (parsed.date && parsed.date !== today) {
            updateLocalState(defaultData, []);

            await AsyncStorage.setItem(
              STORAGE_KEY,
              JSON.stringify({
                date: today,
                data: defaultData,
                meals: [],
              })
            );
          } else {
            const loadedData = normalizeData(parsed.data);
            const loadedMeals = Array.isArray(parsed.meals)
              ? parsed.meals
              : [];

            updateLocalState(loadedData, loadedMeals);

            await AsyncStorage.setItem(
              STORAGE_KEY,
              JSON.stringify({
                date: today,
                data: loadedData,
                meals: loadedMeals,
              })
            );
          }
        } else {
          updateLocalState(defaultData, []);

          await AsyncStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
              date: today,
              data: defaultData,
              meals: [],
            })
          );
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
        } else {
          setGoals(defaultGoals);
        }
      } catch {
        updateLocalState(defaultData, []);
        setGoals(defaultGoals);
      }
    };

    loadData();
  }, [updateLocalState]);

  const addMeal = useCallback(
    async (
      food: Food,
      mealType: MealType,
      calories = food.calories,
      protein = food.protein,
      carbs = food.carbohydrates,
      fat = food.fat
    ) => {
      return enqueue(async () => {
        const currentData = stateRef.current.data;
        const currentMeals = stateRef.current.meals;

        const trackedMeal: TrackedMeal = {
          id: `${food.id}-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 8)}`,
          food,
          mealType,
          calories: Math.max(0, calories),
          protein: Math.max(0, protein),
          carbs: Math.max(0, carbs),
          fat: Math.max(0, fat),
        };

        const newMeals = [...currentMeals, trackedMeal];

        const newData: DailyData = {
          ...currentData,
          calories:
            currentData.calories + trackedMeal.calories,
          protein:
            currentData.protein + trackedMeal.protein,
          carbs:
            currentData.carbs + trackedMeal.carbs,
          fat:
            currentData.fat + trackedMeal.fat,
        };

        await persistState(newData, newMeals);
      });
    },
    [enqueue, persistState]
  );

  const removeMeal = useCallback(
    async (id: string) => {
      return enqueue(async () => {
        const currentData = stateRef.current.data;
        const currentMeals = stateRef.current.meals;

        const meal = currentMeals.find(
          (item) => item.id === id
        );

        if (!meal) {
          return;
        }

        const newMeals = currentMeals.filter(
          (item) => item.id !== id
        );

        const newData: DailyData = {
          ...currentData,
          calories: Math.max(
            0,
            currentData.calories - meal.calories
          ),
protein: Math.max(
            0,
            currentData.protein - meal.protein
          ),
          carbs: Math.max(
            0,
            currentData.carbs - meal.carbs
          ),
          fat: Math.max(
            0,
            currentData.fat - meal.fat
          ),
        };

        await persistState(newData, newMeals);
      });
    },
    [enqueue, persistState]
  );

  const addWater = useCallback(
    async (amount: number) => {
      if (!Number.isFinite(amount) || amount <= 0) {
        return;
      }

      return enqueue(async () => {
        const currentData = stateRef.current.data;
        const currentMeals = stateRef.current.meals;

        const newData: DailyData = {
          ...currentData,
          water: currentData.water + amount,
        };

        await persistState(newData, currentMeals);
      });
    },
    [enqueue, persistState]
  );

  const addSteps = useCallback(
    async (amount: number) => {
      if (!Number.isFinite(amount) || amount <= 0) {
        return;
      }

      return enqueue(async () => {
        const currentData = stateRef.current.data;
        const currentMeals = stateRef.current.meals;

        const newData: DailyData = {
          ...currentData,
          steps: currentData.steps + amount,
        };

        await persistState(newData, currentMeals);
      });
    },
    [enqueue, persistState]
  );

  const resetDay = useCallback(async () => {
    return enqueue(async () => {
      await persistState(defaultData, []);
    });
  }, [enqueue, persistState]);

  const calorieProgress = useMemo(
    () =>
      Math.min(
        data.calories / Math.max(goals.calories, 1),
        1
      ),
    [data.calories, goals.calories]
  );

  const proteinProgress = useMemo(
    () =>
      Math.min(
        data.protein / Math.max(goals.protein, 1),
        1
      ),
    [data.protein, goals.protein]
  );

  const carbsProgress = useMemo(
    () =>
      Math.min(
        data.carbs / Math.max(goals.carbs, 1),
        1
      ),
    [data.carbs, goals.carbs]
  );

  const fatProgress = useMemo(
    () =>
      Math.min(
        data.fat / Math.max(goals.fat, 1),
        1
      ),
    [data.fat, goals.fat]
  );

  const waterProgress = useMemo(
    () =>
      Math.min(
        data.water / Math.max(goals.water, 0.1),
        1
      ),
    [data.water, goals.water]
  );

  const stepsProgress = useMemo(
    () =>
      Math.min(
        data.steps / Math.max(goals.steps, 1),
        1
      ),
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
    throw new Error(
      "useAppData must be used inside AppDataProvider"
    );
  }

  return context;
}