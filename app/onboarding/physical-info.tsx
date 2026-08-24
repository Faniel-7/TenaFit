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
import AuthInput from "../../components/auth/AuthInput";
import AuthButton from "../../components/auth/AuthButton";
import StepIndicator from "../../components/auth/StepIndicator";

export default function PhysicalInfoScreen() {
  const params = useLocalSearchParams<{
    age?: string;
    gender?: string;
  }>();

  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const handleContinue = () => {
    if (!height.trim() || !weight.trim()) {
      return;
    }

    const heightNumber = Number(height);
    const weightNumber = Number(weight);

    if (
      !Number.isFinite(heightNumber) ||
      !Number.isFinite(weightNumber) ||
      heightNumber <= 0 ||
      weightNumber <= 0
    ) {
      return;
    }

    router.push({
      pathname: "/onboarding/goal",
      params: {
        age: params.age ?? "",
        gender: params.gender ?? "",
        height: String(heightNumber),
        weight: String(weightNumber),
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

        {/* STEP */}

        <StepIndicator
          current={2}
          total={6}
        />

        {/* HEADER */}

        <AuthHeader
          title="Physical"
          highlight="Details"
          subtitle="Help us understand your body"
        />

        {/* HEIGHT */}

        <AuthInput
          placeholder="Height (cm)"
          icon="resize-outline"
          value={height}
          onChangeText={setHeight}
          keyboardType="decimal-pad"
        />

        {/* WEIGHT */}

        <AuthInput
          placeholder="Weight (kg)"
          icon="scale-outline"
          value={weight}
          onChangeText={setWeight}
          keyboardType="decimal-pad"
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