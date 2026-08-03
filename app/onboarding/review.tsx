import React from "react";
import { View, Text, StyleSheet, Pressable, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import ScreenContainer from "../../components/common/ScreenContainer";
import AuthButton from "../../components/auth/AuthButton";
import StepIndicator from "../../components/auth/StepIndicator";
import ReviewCard from "../../components/auth/ReviewCard";

const isWeb = Platform.OS === "web";

export default function ReviewScreen() {
  return (
    <ScreenContainer scrollable={isWeb} wide={isWeb}>
      <View style={styles.container}>
        <View style={styles.topRow}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={18} color="#FFC107" />
          </Pressable>

          <View style={styles.summaryBadge}>
            <Ionicons name="checkmark-circle" size={16} color="#FFC107" />
            <Text style={styles.summaryText}>Setup summary</Text>
          </View>
        </View>

        <StepIndicator current={6} total={6} />

        <Text style={styles.title}>Review your plan</Text>
        <Text style={styles.subtitle}>
          Check everything before finishing setup.
        </Text>

        <View style={styles.grid}>
          <ReviewCard
            icon="person-outline"
            label="Gender"
            value="Male"
            onEdit={() => router.push("/onboarding/personal-info")}
          />
          <ReviewCard
            icon="flag-outline"
            label="Goal"
            value="Gain Weight"
            onEdit={() => router.push("/onboarding/goal")}
          />
          <ReviewCard
            icon="resize-outline"
            label="Height"
            value="175 cm"
            onEdit={() => router.push("/onboarding/physical-info")}
          />
          <ReviewCard
            icon="barbell-outline"
            label="Weight"
            value="68 kg"
            onEdit={() => router.push("/onboarding/physical-info")}
          />
          <ReviewCard
            icon="fitness-outline"
            label="Activity"
            value="Moderate"
            onEdit={() => router.push("/onboarding/activity")}
          />
          <ReviewCard
            icon="calendar-outline"
            label="Commitment"
            value="5 Days • 60 Min"
            onEdit={() => router.push("/onboarding/commitment")}
          />
        </View>

        <View style={styles.buttonWrap}>
          <AuthButton title="Finish Setup" onPress={() => router.push("/home")} />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: isWeb ? 12 : 24,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
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
  },

  summaryBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#17171E",
    borderWidth: 1,
    borderColor: "#2A2A2A",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    gap: 6,
  },

  summaryText: {
    color: "#FFC107",
    fontWeight: "800",
    fontSize: 12,
  },

  title: {
    color: "#FFFFFF",
    fontSize: isWeb ? 28 : 24,
    fontWeight: "900",
    letterSpacing: -0.5,
    marginTop: 2,
  },

  subtitle: {
    color: "#9CA3AF",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
    marginBottom: 14,
  },

  grid: {
  width: "100%",
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
  rowGap: Platform.OS === "web" ? 18 : 18,
  columnGap: Platform.OS === "web" ? 12 : 12,
  marginBottom: 16,
},

  buttonWrap: {
    width: isWeb ? 320 : "100%",
    alignSelf: "center",
    marginTop: 10,
  },
});