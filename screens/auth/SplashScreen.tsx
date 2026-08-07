import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../context/ThemeContext";

type Props = {
  onGetStarted?: () => void;
};

export default function SplashScreen({ onGetStarted }: Props) {
  const { colors } = useTheme();

  return (
    <LinearGradient
      colors={["#0B0B0D", "#15161A", "#0B0B0D"]}
      style={styles.root}
    >
      <View style={styles.center}>
        <View
          style={[
            styles.logo,
            { backgroundColor: colors.primary + "22", borderColor: colors.primary },
          ]}
        >
          <Text style={[styles.logoText, { color: colors.primary }]}>T</Text>
        </View>

        <Text style={[styles.title, { color: colors.text }]}>TenaFit</Text>
        <Text style={[styles.subtitle, { color: colors.subtext }]}>
          Your personalized nutrition coach
        </Text>

        <Pressable
          onPress={onGetStarted}
          style={[styles.button, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  logo: {
    width: 92,
    height: 92,
    borderRadius: 28,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  logoText: {
    fontSize: 38,
    fontWeight: "900",
  },
  title: {
    fontSize: 34,
    fontWeight: "900",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
  button: {
    marginTop: 28,
    minHeight: 54,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#111111",
    fontSize: 15,
    fontWeight: "800",
  },
});