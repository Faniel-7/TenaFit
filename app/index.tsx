import React from "react";
import { Redirect } from "expo-router";

import { useAuth } from "../context/AuthContext";

export default function Index() {
  const {
    user,
    loading,
  } = useAuth();

  // Wait until AuthContext finishes
  // checking AsyncStorage.
  if (loading) {
    return null;
  }

  // If a saved account exists,
  // go directly to Home.
  if (user) {
    return <Redirect href="/home" />;
  }

  // No saved account → Welcome.
  return (
    <Redirect href="/auth/welcome" />
  );
}