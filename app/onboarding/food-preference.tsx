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

type FoodPreference =
  | "local"
  | "other"
  | "local_plus_other";

export default function FoodPreferenceScreen() {
  const params = useLocalSearchParams<{
    age?: string;
    gender?: string;
    height?: string;
    weight?: string;
    goal?: string;
    activity?: string;
    commitment?: string;
  }>();

  const [selectedPreference, setSelectedPreference] =
    useState<FoodPreference | null>(null);

  const handleContinue = () => {
    if (!selectedPreference) {
      return;
    }

    router.push({
      pathname: "/onboarding/review",
      params: {
        age: params.age ?? "",
        gender: params.gender ?? "",
        height: params.height ?? "",
        weight: params.weight ?? "",
        goal: params.goal ?? "",
        activity: params.activity ?? "",
        commitment: params.commitment ?? "",
        foodPreference: selectedPreference,
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
          current={6}
          total={7}
        />

        {/* HEADER */}

        <AuthHeader
          title="Food"
          highlight="Preference"
          subtitle="What kind of food would you like TenaFit to recommend?"
        />

        {/* LOCAL */}

        <SelectCard
          title="Local Foods"
          subtitle="Focus mainly on Ethiopian and local foods"
          icon="restaurant-outline"
          selected={
            selectedPreference === "local"
          }
          onPress={() =>
            setSelectedPreference("local")
          }
        />

        {/* OTHER */}

        <SelectCard
          title="Other Foods"
          subtitle="Focus mainly on international foods"
          icon="globe-outline"
          selected={
            selectedPreference === "other"
          }
          onPress={() =>
            setSelectedPreference("other")
          }
        />

        {/* LOCAL + OTHER */}

        <SelectCard
          title="Local + Other"
          subtitle="Mix Ethiopian and international foods"
          icon="earth-outline"
          selected={
            selectedPreference === "local_plus_other"
          }
          onPress={() =>
            setSelectedPreference(
              "local_plus_other"
            )
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