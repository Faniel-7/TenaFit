import React from "react";
import { Stack, Redirect, usePathname } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ThemeProvider } from "../context/ThemeContext";
import {
  AuthProvider,
  useAuth,
} from "../context/AuthContext";

function AuthGuard() {
  const {
    user,
    loading,
  } = useAuth();

  const pathname = usePathname();

  if (loading) {
    return null;
  }

  /*
   * Routes that do not require
   * authentication.
   */
  const publicRoutes = [
    "/",
    "/auth/welcome",
    "/auth/login",
    "/auth/signup",
    "/auth/forget-password",
  ];

  const isPublicRoute =
    publicRoutes.includes(pathname);

  /*
   * Not logged in + trying to
   * access a protected screen.
   */
  if (!user && !isPublicRoute) {
    return (
      <Redirect
        href="/auth/welcome"
      />
    );
  }

  /*
   * Already logged in + trying
   * to access authentication screens.
   */
  if (
    user &&
    (
      pathname === "/auth/welcome" ||
      pathname === "/auth/login" ||
      pathname === "/auth/signup"
    )
  ) {
    return (
      <Redirect href="/home" />
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <AuthGuard />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}