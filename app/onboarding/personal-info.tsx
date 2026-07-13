import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import ScreenContainer from "../../components/common/ScreenContainer";
import AuthHeader from "../../components/auth/AuthHeader";
import AuthInput from "../../components/auth/AuthInput";
import AuthButton from "../../components/auth/AuthButton";
import StepIndicator from "../../components/auth/StepIndicator";
import SelectCard from "../../components/auth/SelectCard";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function PersonalInfoScreen() {
  const [selectedGender, setSelectedGender] = useState<"male" | "female" | "other" | null>(null);

  return (
    <ScreenContainer>
      <View style={styles.container}>

        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color="#FFC107" />
        </Pressable>

        <StepIndicator current={1} total={6} />

        <AuthHeader
          title="Personal"
          highlight="Information"
          subtitle="Tell us the basics we need for your nutrition plan"
        />

        <AuthInput icon="calendar-outline" placeholder="Age" />

        <Text style={styles.label}>Gender</Text>

        <SelectCard
          title="Male"
          subtitle="Biological sex"
          icon="male-outline"
          selected={selectedGender === "male"}
          onPress={() => setSelectedGender("male")}
        />
        <SelectCard
          title="Female"
          subtitle="Biological sex"
          icon="female-outline"
          selected={selectedGender === "female"}
          onPress={() => setSelectedGender("female")}
        />
        <SelectCard
          title="Prefer not to say"
          subtitle="Prefer not to say"
          icon="person-outline"
          selected={selectedGender === "other"}
          onPress={() => setSelectedGender("other")}
        />

        <AuthButton
          title="Continue"
          onPress={() => router.push("/onboarding/physical-info")}
        />
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
  label: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    marginTop: 8,
    marginBottom: 10,
  },
});