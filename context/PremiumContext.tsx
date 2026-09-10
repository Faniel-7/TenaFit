import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PREMIUM_CODES } from "../data/premiumCodes";

const PREMIUM_STATUS_KEY = "@tenafit_premium";
const USED_CODES_KEY = "@tenafit_used_premium_codes";

type PremiumContextType = {
  isPremium: boolean;
  loading: boolean;
  activatePremium: (code: string) => Promise<{
    success: boolean;
    error?: string;
  }>;
  deactivatePremium: () => Promise<void>;
};

const PremiumContext = createContext<
  PremiumContextType | undefined
>(undefined);

type Props = {
  children: ReactNode;
};

export function PremiumProvider({ children }: Props) {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    restorePremium();
  }, []);

  const restorePremium = async () => {
    try {
      const stored = await AsyncStorage.getItem(PREMIUM_STATUS_KEY);
      setIsPremium(stored === "true");
    } catch {
      setIsPremium(false);
    } finally {
      setLoading(false);
    }
  };

  const activatePremium = async (code: string) => {
    const normalizedCode = code.trim().toUpperCase();

    if (!normalizedCode) {
      return {
        success: false,
        error: "Please enter a premium code.",
      };
    }

    if (!PREMIUM_CODES.includes(normalizedCode as never)) {
      return {
        success: false,
        error: "Invalid premium code.",
      };
    }

    try {
      const storedUsedCodes =
        await AsyncStorage.getItem(USED_CODES_KEY);

      const usedCodes: string[] = storedUsedCodes
        ? JSON.parse(storedUsedCodes)
        : [];

      if (usedCodes.includes(normalizedCode)) {
        return {
          success: false,
          error: "This premium code has already been used.",
        };
      }

      usedCodes.push(normalizedCode);

      await AsyncStorage.setItem(
        USED_CODES_KEY,
        JSON.stringify(usedCodes)
      );

      await AsyncStorage.setItem(
        PREMIUM_STATUS_KEY,
        "true"
      );

      setIsPremium(true);

      return {
        success: true,
      };
    } catch {
      return {
        success: false,
        error: "Could not activate premium. Please try again.",
      };
    }
  };

  const deactivatePremium = async () => {
    await AsyncStorage.removeItem(PREMIUM_STATUS_KEY);
    setIsPremium(false);
  };

  return (
    <PremiumContext.Provider
      value={{
        isPremium,
        loading,
        activatePremium,
        deactivatePremium,
      }}
    >
      {children}
    </PremiumContext.Provider>
  );
}

export function usePremium() {
  const context = useContext(PremiumContext);

  if (!context) {
    throw new Error(
      "usePremium must be used inside PremiumProvider"
    );
  }

  return context;
}