import React from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "../context/ThemeContext";
import { AuthProvider } from "../context/AuthContext";
import { AppDataProvider } from "../context/AppDataContext";
import { PremiumProvider } from "../context/PremiumContext";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <PremiumProvider>
            <AppDataProvider>
              <Stack screenOptions={{ headerShown: false }} />
            </AppDataProvider>
          </PremiumProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}