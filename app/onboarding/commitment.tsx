import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  router,
  useLocalSearchParams,
} from "expo-router";

import ScreenContainer from "../../components/common/ScreenContainer";
import AuthHeader from "../../components/auth/AuthHeader";
import AuthButton from "../../components/auth/AuthButton";
import StepIndicator from "../../components/auth/StepIndicator";
import SelectCard from "../../components/auth/SelectCard";

const DAYS_OPTIONS = [
  {
    value: 1,
    title: "1 Day",
    subtitle: "A relaxed start",
  },
  {
    value: 2,
    title: "2 Days",
    subtitle: "Easy routine",
  },
  {
    value: 3,
    title: "3 Days",
    subtitle: "Balanced routine",
  },
  {
    value: 4,
    title: "4 Days",
    subtitle: "Active routine",
  },
  {
    value: 5,
    title: "5 Days",
    subtitle: "Serious commitment",
  },
  {
    value: 6,
    title: "6 Days",
    subtitle: "Very active",
  },
  {
    value: 7,
    title: "7 Days",
    subtitle: "Daily activity",
  },
];

const MINUTE_OPTIONS = [
  {
    value: 20,
    title: "20 Minutes",
    subtitle: "Quick workout",
  },
  {
    value: 30,
    title: "30 Minutes",
    subtitle: "Short workout",
  },
  {
    value: 45,
    title: "45 Minutes",
    subtitle: "Balanced workout",
  },
  {
    value: 60,
    title: "60 Minutes",
    subtitle: "Full workout",
  },
  {
    value: 90,
    title: "90 Minutes",
    subtitle: "Extended workout",
  },
];

export default function CommitmentScreen() {
  const params =
    useLocalSearchParams<{
      age?: string;
      gender?: string;
      height?: string;
      weight?: string;
      goal?: string;
      activityLevel?: string;
      daysPerWeek?: string;
      minutesPerDay?: string;
      foodPreference?: string;
    }>();

  const [daysPerWeek, setDaysPerWeek] =
    useState<number | null>(
      getNumber(
        params.daysPerWeek
      )
    );

  const [minutesPerDay, setMinutesPerDay] =
    useState<number | null>(
      getNumber(
        params.minutesPerDay
      )
    );

  const handleContinue = () => {
    if (
      daysPerWeek === null ||
      minutesPerDay === null
    ) {
      return;
    }

    router.push({
      pathname:
        "/onboarding/food-preference",

      params: {
        age: params.age ?? "",
        gender: params.gender ?? "",
        height: params.height ?? "",
        weight: params.weight ?? "",
        goal: params.goal ?? "",

        activityLevel:
          params.activityLevel ?? "",

        daysPerWeek:
          String(daysPerWeek),

        minutesPerDay:
          String(minutesPerDay),

        foodPreference:
          params.foodPreference ?? "",
      },
    });
  };

  return (
    <ScreenContainer>
      <View style={styles.container}>

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

        <StepIndicator
          current={5}
          total={7}
        />

        <AuthHeader
          title="Weekly"
          highlight="Commitment"
          subtitle="Choose a realistic workout schedule for you"
        />

        <View style={styles.sections}>

          {/* DAYS */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Days per Week
            </Text>

            <View style={styles.options}>
              {DAYS_OPTIONS.map(
                (option) => (
                  <SelectCard
                    key={option.value}
                    title={
                      option.title
                    }
                    subtitle={
option.subtitle
                    }
                    icon="calendar-outline"
                    selected={
                      daysPerWeek ===
                      option.value
                    }
                    onPress={() =>
                      setDaysPerWeek(
                        option.value
                      )
                    }
                  />
                )
              )}
            </View>
          </View>

          {/* MINUTES */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Workout Time per Day
            </Text>

            <View style={styles.options}>
              {MINUTE_OPTIONS.map(
                (option) => (
                  <SelectCard
                    key={option.value}
                    title={
                      option.title
                    }
                    subtitle={
                      option.subtitle
                    }
                    icon="time-outline"
                    selected={
                      minutesPerDay ===
                      option.value
                    }
                    onPress={() =>
                      setMinutesPerDay(
                        option.value
                      )
                    }
                  />
                )
              )}
            </View>
          </View>

        </View>

        <AuthButton
          title="Continue"
          onPress={handleContinue}
        />

      </View>
    </ScreenContainer>
  );
}

function getNumber(
  value?: string
): number | null {
  if (!value) {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : null;
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

  sections: {
    flex: 1,

    flexDirection: "row",

    gap: 35,
  },

  section: {
    flex: 1,
  },

  sectionTitle: {
    color: "#FFFFFF",

    fontSize: 18,
    fontWeight: "800",

    marginBottom: 10,
  },

  options: {
    gap: 8,
  },
});