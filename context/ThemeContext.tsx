import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { darkColors, lightColors } from "../theme/colors";

type ThemeMode = "light" | "dark";

type ThemeContextType = {
  theme: ThemeMode;
  isDark: boolean;
  colors: typeof lightColors;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
  loading: boolean;
};

const THEME_KEY = "@tenafit_theme";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("light");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const saved = await AsyncStorage.getItem(THEME_KEY);
        if (saved === "dark" || saved === "light") {
          setThemeState(saved);
        }
      } catch (error) {
        console.log("Failed to load theme", error);
      } finally {
        setLoading(false);
      }
    };

    loadTheme();
  }, []);

  const setTheme = async (mode: ThemeMode) => {
    setThemeState(mode);
    try {
      await AsyncStorage.setItem(THEME_KEY, mode);
    } catch (error) {
      console.log("Failed to save theme", error);
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  };

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === "dark",
      colors: theme === "dark" ? darkColors : lightColors,
      toggleTheme,
      setTheme,
      loading,
    }),
    [theme, loading]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return context;
}