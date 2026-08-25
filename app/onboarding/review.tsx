import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

import ScreenContainer from "../../components/common/ScreenContainer";
import AuthButton from "../../components/auth/AuthButton";
import StepIndicator from "../../components/auth/StepIndicator";
import ReviewCard from "../../components/auth/ReviewCard";
import { saveUserProfile } from "../../storage/profileStorage";
import {
  UserProfile,
  Gender,
  WeightGoal,
  ActivityLevel,
  FoodPreference,
} from "../../types/userProfile";

const isWeb = Platform.OS === "web";

export default function ReviewScreen() {
  const params = useLocalSearchParams();

  const [isSaving, setIsSaving] = useState(false);

  /*
  =========================================================
  ONBOARDING DATA
  =========================================================

  The onboarding screens pass their values through Expo Router
  parameters.

  We keep the values as strings here and convert numerical
  values when creating the final UserProfile.
  */

  const fullName = getParam(params.fullName);
  const username = getParam(params.username);
  const email = getParam(params.email);

  const age = getParam(params.age);
  const gender = getParam(params.gender);

  const height = getParam(params.height);
  const weight = getParam(params.weight);

  const goal = getParam(params.goal);
  const activityLevel = getParam(params.activityLevel);

  const daysPerWeek = getParam(params.daysPerWeek);
  const minutesPerDay = getParam(params.minutesPerDay);

  const foodPreference = getParam(
    params.foodPreference
  );

  /*
  =========================================================
  DISPLAY VALUES
  =========================================================
  */

  const displayGender =
    formatGender(gender);

  const displayGoal =
    formatGoal(goal);

  const displayActivity =
    formatActivity(activityLevel);

  const displayFoodPreference =
    formatFoodPreference(foodPreference);

  const displayHeight = height
    ? `${height} cm`
    : "Not provided";

  const displayWeight = weight
    ? `${weight} kg`
    : "Not provided";

  const displayCommitment =
    daysPerWeek && minutesPerDay
      ? `${daysPerWeek} Days • ${minutesPerDay} Min`
      : "Not provided";

  /*
  =========================================================
  FINISH SETUP
  =========================================================
  */

  const handleFinishSetup = async () => {
    if (isSaving) {
      return;
    }

    try {
      setIsSaving(true);

      const profile: UserProfile = {
        age: Number(age),
        gender: normalizeGender(gender),

        heightCm: Number(height),
        weightKg: Number(weight),

        goal: normalizeGoal(goal),
        activityLevel:
          normalizeActivityLevel(
            activityLevel
          ),

        daysPerWeek: Number(daysPerWeek),
        minutesPerDay: Number(minutesPerDay),

        foodPreference:
          normalizeFoodPreference(
            foodPreference
          ),
      };

      await saveUserProfile(profile);

      /*
      Replace the onboarding stack with Home
      so the user doesn't return to onboarding
      when pressing the back button.
      */

      router.replace("/home");
    } catch (error) {
      console.error(
        "Failed to finish setup:",
        error
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScreenContainer
      scrollable={isWeb}
      wide={isWeb}
    >
      <View style={styles.container}>
        {/* TOP ROW */}

        <View style={styles.topRow}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Ionicons
              name="arrow-back"
              size={18}
              color="#FFC107"
            />
          </Pressable>
<View style={styles.summaryBadge}>
            <Ionicons
              name="checkmark-circle"
              size={16}
              color="#FFC107"
            />

            <Text style={styles.summaryText}>
              Setup summary
            </Text>
          </View>
        </View>

        {/* STEP INDICATOR */}

        <StepIndicator
          current={6}
          total={6}
        />

        {/* TITLE */}

        <Text style={styles.title}>
          Review your plan
        </Text>

        <Text style={styles.subtitle}>
          Check everything before finishing setup.
        </Text>

        {/* REVIEW GRID */}

        <View style={styles.grid}>
          <ReviewCard
            icon="person-outline"
            label="Gender"
            value={displayGender}
            onEdit={() =>
              router.push(
                "/onboarding/personal-info"
              )
            }
          />

          <ReviewCard
            icon="flag-outline"
            label="Goal"
            value={displayGoal}
            onEdit={() =>
              router.push(
                "/onboarding/goal"
              )
            }
          />

          <ReviewCard
            icon="resize-outline"
            label="Height"
            value={displayHeight}
            onEdit={() =>
              router.push(
                "/onboarding/physical-info"
              )
            }
          />

          <ReviewCard
            icon="barbell-outline"
            label="Weight"
            value={displayWeight}
            onEdit={() =>
              router.push(
                "/onboarding/physical-info"
              )
            }
          />

          <ReviewCard
            icon="fitness-outline"
            label="Activity"
            value={displayActivity}
            onEdit={() =>
              router.push(
                "/onboarding/activity"
              )
            }
          />

          <ReviewCard
            icon="calendar-outline"
            label="Commitment"
            value={displayCommitment}
            onEdit={() =>
              router.push(
                "/onboarding/commitment"
              )
            }
          />

          {/* FOOD PREFERENCE */}

          <ReviewCard
            icon="restaurant-outline"
            label="Food Preference"
            value={displayFoodPreference}
            onEdit={() =>
              router.push(
                "/onboarding/food-preference"
              )
            }
          />
        </View>

        {/* FINISH BUTTON */}

        <View style={styles.buttonWrap}>
          <AuthButton
            title={
              isSaving
                ? "Saving..."
                : "Finish Setup"
            }
            onPress={() => {
              if (!isSaving) {
                void handleFinishSetup();
              }
            }}
          />

          {isSaving && (
            <ActivityIndicator
              size="small"
              color="#FFC107"
              style={styles.loading}
            />
          )}
        </View>
      </View>
    </ScreenContainer>
  );
}

/*
=========================================================
PARAMETER HELPERS
=========================================================
*/

function getParam(
  value:
    | string
    | string[]
    | undefined
): string {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

/*
=========================================================
DISPLAY FORMATTERS
=========================================================
*/

function formatGender(
  value: string
): string {
  switch (value.toLowerCase()) {
    case "male":
      return "Male";

    case "female":
      return "Female";

    default:
      return value || "Not provided";
  }
}

function formatGoal(
  value: string
): string {
  switch (value.toLowerCase()) {
    case "lose":
    case "lose_weight":
    case "lose-weight":
      return "Lose Weight";

    case "maintain":
    case "maintain_weight":
    case "maintain-weight":
      return "Maintain Weight";
case "gain":
    case "gain_weight":
    case "gain-weight":
      return "Gain Weight";

    default:
      return value || "Not provided";
  }
}

function formatActivity(
  value: string
): string {
  switch (value.toLowerCase()) {
    case "sedentary":
    case "no_exercise":
    case "no-exercise":
      return "No Exercise";

    case "light":
    case "light_exercise":
    case "light-exercise":
      return "Light Exercise";

    case "moderate":
    case "moderate_exercise":
    case "moderate-exercise":
      return "Moderate Exercise";

    case "heavy":
    case "heavy_exercise":
    case "heavy-exercise":
      return "Heavy Exercise";

    case "very_active":
    case "very-active":
      return "Very Active";

    default:
      return value || "Not provided";
  }
}

function formatFoodPreference(
  value: string
): string {
  switch (value.toLowerCase()) {
    case "local":
      return "Local Foods";

    case "other":
      return "Other Foods";

    case "local_plus_other":
    case "local-plus-other":
    case "mix":
    case "mixed":
      return "Local + Other";

    default:
      return value || "Not provided";
  }
}

/*
=========================================================
NORMALIZERS
=========================================================
*/

function normalizeGender(
  value: string
): Gender {
  return value.toLowerCase() === "female"
    ? "female"
    : "male";
}

function normalizeGoal(
  value: string
): WeightGoal {
  const normalized =
    value.toLowerCase();

  if (
    normalized === "lose" ||
    normalized === "lose_weight" ||
    normalized === "lose-weight"
  ) {
    return "lose";
  }

  if (
    normalized === "maintain" ||
    normalized === "maintain_weight" ||
    normalized === "maintain-weight"
  ) {
    return "maintain";
  }

  return "gain";
}

function normalizeActivityLevel(
  value: string
): ActivityLevel {
  const normalized =
    value.toLowerCase();

  if (
    normalized === "sedentary" ||
    normalized === "no_exercise" ||
    normalized === "no-exercise"
  ) {
    return "sedentary";
  }

  if (
    normalized === "light" ||
    normalized === "light_exercise" ||
    normalized === "light-exercise"
  ) {
    return "light";
  }

  if (
    normalized === "heavy" ||
    normalized === "heavy_exercise" ||
    normalized === "heavy-exercise"
  ) {
    return "hard";
  }

  if (
    normalized === "very_active" ||
    normalized === "very-active"
  ) {
    return "hard";
  }

  if (
    normalized === "extremely_active" ||
    normalized === "extremely-active"
  ) {
    return "hard";
  }

  return "moderate";
}

function normalizeFoodPreference(
  value: string
): FoodPreference {
  const normalized =
    value.toLowerCase();

  if (normalized === "local") {
    return "local";
  }

  if (normalized === "other") {
    return "other";
  }

  return "local_plus_other" as FoodPreference;
}

/*
=========================================================
STYLES
=========================================================
*/

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
    rowGap: 18,
    columnGap: 12,
    marginBottom: 16,
  },

  buttonWrap: {
    width: isWeb ? 320 : "100%",
    alignSelf: "center",
    marginTop: 10,
  },

  loading: {
    marginTop: 10,
  },
});