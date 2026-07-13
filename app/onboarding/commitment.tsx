import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, Platform } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import ScreenContainer from "../../components/common/ScreenContainer";
import AuthHeader from "../../components/auth/AuthHeader";
import AuthButton from "../../components/auth/AuthButton";
import StepIndicator from "../../components/auth/StepIndicator";

const isWeb = Platform.OS === "web";

const DAYS = [1, 2, 3, 4, 5, 6, 7];
const MINUTES = [15, 30, 45, 60, 75, 90, 120];

export default function CommitmentScreen() {
  const [day, setDay] = useState(5);
  const [minute, setMinute] = useState(60);

  return (
    <ScreenContainer wide={isWeb}>
      <View style={styles.container}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color="#FFC107" />
        </Pressable>

        <StepIndicator current={5} total={6} />

        <AuthHeader
          title="Weekly"
          highlight="Commitment"
          subtitle="Tell us how much time you can realistically dedicate."
        />

        {isWeb ? (
          <View style={styles.webLayout}>
            <View style={styles.sectionContainer}>
              <Text style={styles.section}>Days per week</Text>

              <View style={styles.grid}>
                {DAYS.map((item) => (
                  <Pressable
                    key={item}
                    style={[styles.option, day === item && styles.selected]}
                    onPress={() => setDay(item)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        day === item && styles.selectedText,
                      ]}
                    >
                      {item}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.section}>Workout time per day</Text>

              <View style={styles.grid}>
                {MINUTES.map((item) => (
                  <Pressable
                    key={item}
                    style={[styles.option, minute === item && styles.selected]}
                    onPress={() => setMinute(item)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        minute === item && styles.selectedText,
                      ]}
                    >
                      {item} min
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        ) : (
          <>
            <Text style={styles.section}>Days per week</Text>

            <View style={styles.grid}>
              {DAYS.map((item) => (
                <Pressable
                  key={item}
                  style={[styles.option, day === item && styles.selected]}
                  onPress={() => setDay(item)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      day === item && styles.selectedText,
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.section}>Workout time per day</Text>

            <View style={styles.grid}>
              {MINUTES.map((item) => (
                <Pressable
                  key={item}
                  style={[styles.option, minute === item && styles.selected]}
                  onPress={() => setMinute(item)}
>
                  <Text
                    style={[
                      styles.optionText,
                      minute === item && styles.selectedText,
                    ]}
                  >
                    {item} min
                  </Text>
                </Pressable>
              ))}
            </View>
          </>
        )}

        <View style={isWeb ? styles.webButtonWrap : styles.buttonWrap}>
          <AuthButton
            title="Continue"
            onPress={() => router.push("/onboarding/review")}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 28,
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

  webLayout: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "stretch",
    marginTop: 10,
    marginBottom: 12,
  },

  sectionContainer: {
    width: "100%",
    marginBottom: 20,
  },

  section: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 16,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  option: {
    width: "30%",
    height: 60,
    borderRadius: 18,
    backgroundColor: "#18181F",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },

  selected: {
    backgroundColor: "#FFC107",
    borderColor: "#FFC107",
  },

  optionText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  selectedText: {
    color: "#111111",
  },

  buttonWrap: {
    marginTop: 6,
  },

  webButtonWrap: {
    width: 280,
    alignSelf: "center",
    marginTop: 10,
  },
});