import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../../context/ThemeContext";
import { usePremium } from "../../context/PremiumContext";

interface PremiumGateProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export default function PremiumGate({
  children,
  title = "Premium Feature",
  description = "Upgrade to TenaFit Premium to unlock this feature.",
}: PremiumGateProps) {
  const router = useRouter();
  const { isDark, colors } = useTheme();
  const { isPremium, loading } = usePremium();

  if (loading) {
    return null;
  }

  if (isPremium) {
    return <>{children}</>;
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <View
        style={[
          styles.icon,
          {
            backgroundColor: isDark ? "#2A2414" : "#FFF4D6",
          },
        ]}
      >
        <Text style={styles.iconText}>★</Text>
      </View>

      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>

      <Text style={[styles.description, { color: colors.subtext }]}>
        {description}
      </Text>

      <View
        style={[
          styles.button,
          {
            backgroundColor: colors.primary,
          },
        ]}
        onTouchEnd={() => router.push("/dashboard/premium")}
      >
        <Text style={styles.buttonText}>Unlock Premium</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginVertical: 12,
  },
  icon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  iconText: {
    fontSize: 26,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 24,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});