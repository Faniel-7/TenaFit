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

type Goal = "lose" | "maintain" | "gain";

export default function GoalScreen() {
  const params = useLocalSearchParams<{
    age?: string;
    gender?: string;
    height?: string;
    weight?: string;
  }>();

  const [selectedGoal, setSelectedGoal] =
    useState<Goal | null>(null);

  const handleContinue = () => {
    if (!selectedGoal) {
      return;
    }

    router.push({
      pathname: "/onboarding/activity",
      params: {
        age: params.age ?? "",
        gender: params.gender ?? "",
        height: params.height ?? "",
        weight: params.weight ?? "",
        goal: selectedGoal,
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
          current={3}
          total={6}
        />

        {/* HEADER */}

        <AuthHeader
          title="Your"
          highlight="Goal"
          subtitle="What would you like to achieve?"
        />

        {/* LOSE WEIGHT */}

        <SelectCard
          title="Lose Weight"
          subtitle="Burn fat and reach a healthier weight"
          icon="trending-down-outline"
          selected={selectedGoal === "lose"}
          onPress={() =>
            setSelectedGoal("lose")
          }
        />

        {/* MAINTAIN */}

        <SelectCard
          title="Maintain Weight"
          subtitle="Keep your current weight and stay healthy"
          icon="remove-outline"
          selected={selectedGoal === "maintain"}
          onPress={() =>
            setSelectedGoal("maintain")
          }
        />

        {/* GAIN */}

        <SelectCard
          title="Gain Weight"
          subtitle="Build healthy weight and muscle"
          icon="trending-up-outline"
          selected={selectedGoal === "gain"}
          onPress={() =>
            setSelectedGoal("gain")
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