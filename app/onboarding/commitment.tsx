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

type Commitment =
  | "1-2"
  | "3-4"
  | "5-6"
  | "7";

export default function CommitmentScreen() {
  const params = useLocalSearchParams<{
    age?: string;
    gender?: string;
    height?: string;
    weight?: string;
    goal?: string;
    activity?: string;
  }>();

  const [selectedCommitment, setSelectedCommitment] =
    useState<Commitment | null>(null);

  const handleContinue = () => {
    if (!selectedCommitment) {
      return;
    }

    router.push({
      pathname: "/onboarding/food-preference",
      params: {
        age: params.age ?? "",
        gender: params.gender ?? "",
        height: params.height ?? "",
        weight: params.weight ?? "",
        goal: params.goal ?? "",
        activity: params.activity ?? "",
        commitment: selectedCommitment,
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
          current={5}
          total={7}
        />

        {/* HEADER */}

        <AuthHeader
          title="Weekly"
          highlight="Commitment"
          subtitle="How many days can you realistically commit to exercise?"
        />

        {/* 1–2 DAYS */}

        <SelectCard
          title="1–2 Days"
          subtitle="A relaxed start"
          icon="calendar-outline"
          selected={
            selectedCommitment === "1-2"
          }
          onPress={() =>
            setSelectedCommitment("1-2")
          }
        />

        {/* 3–4 DAYS */}

        <SelectCard
          title="3–4 Days"
          subtitle="A balanced routine"
          icon="calendar-outline"
          selected={
            selectedCommitment === "3-4"
          }
          onPress={() =>
            setSelectedCommitment("3-4")
          }
        />

        {/* 5–6 DAYS */}

        <SelectCard
          title="5–6 Days"
          subtitle="A serious commitment"
          icon="calendar-outline"
          selected={
            selectedCommitment === "5-6"
          }
          onPress={() =>
            setSelectedCommitment("5-6")
          }
        />

        {/* 7 DAYS */}

        <SelectCard
          title="7 Days"
          subtitle="Daily activity"
          icon="flame-outline"
          selected={
            selectedCommitment === "7"
          }
          onPress={() =>
            setSelectedCommitment("7")
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