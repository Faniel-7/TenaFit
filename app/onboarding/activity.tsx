import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

import ScreenContainer from "../../components/common/ScreenContainer";
import AuthHeader from "../../components/auth/AuthHeader";
import AuthButton from "../../components/auth/AuthButton";
import StepIndicator from "../../components/auth/StepIndicator";
import SelectCard from "../../components/auth/SelectCard";

type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "hard";

export default function ActivityScreen() {
  const params = useLocalSearchParams<{
    age?: string;
    gender?: string;
    height?: string;
    weight?: string;
    goal?: string;
  }>();

  const [selectedActivity, setSelectedActivity] =
    useState<ActivityLevel | null>(null);

  const handleContinue = () => {
    if (!selectedActivity) {
      return;
    }

    router.push({
      pathname: "/onboarding/commitment",
      params: {
        age: params.age ?? "",
        gender: params.gender ?? "",
        height: params.height ?? "",
        weight: params.weight ?? "",
        goal: params.goal ?? "",
        activity: selectedActivity,
      },
    });
  };

  return (
    <ScreenContainer>
      <View style={styles.container}>

        {/* BACK BUTTON */}

        <Pressable
          onPress={() => router.back()}
          style={styles.backBtn}
        >
          <Ionicons
            name="arrow-back"
            size={20}
            color="#FFC107"
          />
        </Pressable>

        {/* STEP INDICATOR */}

        <StepIndicator
          current={4}
          total={6}
        />

        {/* HEADER */}

        <AuthHeader
          title="Activity"
          highlight="Level"
          subtitle="How active are you on a typical week?"
        />

        {/* SEDENTARY */}

        <SelectCard
          title="Sedentary"
          subtitle="Little or no exercise"
          icon="bed-outline"
          selected={
            selectedActivity === "sedentary"
          }
          onPress={() =>
            setSelectedActivity("sedentary")
          }
        />

        {/* LIGHT */}

        <SelectCard
          title="Light Exercise"
          subtitle="Exercise 1–3 days per week"
          icon="walk-outline"
          selected={
            selectedActivity === "light"
          }
          onPress={() =>
            setSelectedActivity("light")
          }
        />

        {/* MODERATE */}

        <SelectCard
          title="Moderate Exercise"
          subtitle="Exercise 3–5 days per week"
          icon="fitness-outline"
          selected={
            selectedActivity === "moderate"
          }
          onPress={() =>
            setSelectedActivity("moderate")
          }
        />

        {/* HARD */}

        <SelectCard
          title="Hard Exercise"
          subtitle="Intense exercise 6–7 days per week"
          icon="barbell-outline"
          selected={
            selectedActivity === "hard"
          }
          onPress={() =>
            setSelectedActivity("hard")
          }
        />

        {/* CONTINUE */}

        <AuthButton
          title="Continue"
          onPress={handleContinue}
        />

      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },

  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#17171E",
    borderWidth: 1,
    borderColor: "#2A2A2A",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },
});