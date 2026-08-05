import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type NutrientState = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
  steps: number;
};

type MealInput = {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
};

type AppDataContextType = {
  data: NutrientState & { progress: number };
  goals: {
    calories: number;
    protein: number;
    water: number;
    steps: number;
  };
  percentages: {
    calories: number;
    protein: number;
    water: number;
    steps: number;
  };
  addMeal: (meal: MealInput) => void;
  addWater: (amount: number) => void;
  addSteps: (amount: number) => void;
  resetDay: () => void;
  loading: boolean;
};

const initialData: NutrientState = {
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  water: 0,
  steps: 0,
};

const goals = {
  calories: 2409,
  protein: 140,
  water: 3.2,
  steps: 7500,
};

const STORAGE_KEY = "@tenafit_day_data";

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

function clampPercent(value: number) {
  return Math.max(0, Math.min(100, value));
}

function calculatePercent(current: number, goal: number) {
  return clampPercent(Math.round((current / goal) * 100));
}

function calculateProgress(data: NutrientState) {
  const caloriesProgress = calculatePercent(data.calories, goals.calories);
  const proteinProgress = calculatePercent(data.protein, goals.protein);
  const waterProgress = calculatePercent(data.water, goals.water);
  const stepsProgress = calculatePercent(data.steps, goals.steps);

  const average =
    (caloriesProgress + proteinProgress + waterProgress + stepsProgress) / 4;

  return clampPercent(Math.round(average));
}

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<NutrientState>(initialData);
  const [loading, setLoading] = useState(true);
  const hydratedRef = useRef(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as Partial<NutrientState>;
          setData({
            calories: parsed.calories ?? 0,
            protein: parsed.protein ?? 0,
            carbs: parsed.carbs ?? 0,
            fat: parsed.fat ?? 0,
            water: parsed.water ?? 0,
            steps: parsed.steps ?? 0,
          });
        }
      } catch (error) {
        console.log("Failed to load app data", error);
      } finally {
        hydratedRef.current = true;
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) return;

    const saveData = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (error) {
        console.log("Failed to save app data", error);
      }
    };

    saveData();
  }, [data]);

  const addMeal = (meal: MealInput) => {
    setData((prev) => ({
      ...prev,
      calories: prev.calories + (meal.calories ?? 0),
      protein: prev.protein + (meal.protein ?? 0),
      carbs: prev.carbs + (meal.carbs ?? 0),
      fat: prev.fat + (meal.fat ?? 0),
    }));
  };

  const addWater = (amount: number) => {
    setData((prev) => ({
      ...prev,
      water: prev.water + Math.max(0, amount),
    }));
  };

  const addSteps = (amount: number) => {
    setData((prev) => ({
      ...prev,
      steps: prev.steps + Math.max(0, amount),
    }));
  };

  const resetDay = async () => {
    setData(initialData);
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.log("Failed to clear app data", error);
    }
  };
const percentages = useMemo(
    () => ({
      calories: calculatePercent(data.calories, goals.calories),
      protein: calculatePercent(data.protein, goals.protein),
      water: calculatePercent(data.water, goals.water),
      steps: calculatePercent(data.steps, goals.steps),
    }),
    [data]
  );

  const computedData = useMemo(() => {
    return {
      ...data,
      progress: calculateProgress(data),
    };
  }, [data]);

  const value = useMemo(
    () => ({
      data: computedData,
      goals,
      percentages,
      addMeal,
      addWater,
      addSteps,
      resetDay,
      loading,
    }),
    [computedData, percentages, loading]
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