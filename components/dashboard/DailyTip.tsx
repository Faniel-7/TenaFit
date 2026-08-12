import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type DailyTipProps = {
  tip?: string;
};

export default function DailyTip({
  tip = "Stay consistent, even on your off days. Your future self will thank you.",
}: DailyTipProps) {
  return (
    <View style={styles.tipCard}>
      <View style={styles.tipTitleRow}>
        <Ionicons
          name="bulb-outline"
          size={22}
          color="#FFC107"
        />

        <Text style={styles.tipTitle}>
          DAILY TIP
        </Text>
      </View>

      <Text style={styles.tipText}>
        {tip}
      </Text>

      <Text style={styles.quote}>
        “
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tipCard: {
    width: "100%",
    minHeight: 180,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: "#4D4430",
    backgroundColor: "#12130F",
    padding: 20,
    overflow: "hidden",
  },

  tipTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },

  tipTitle: {
    color: "#FFC107",
    fontSize: 16,
    fontWeight: "900",
  },

  tipText: {
    color: "#FFFFFF",
    fontSize: 14,
    lineHeight: 22,
    marginTop: 23,
    maxWidth: 330,
  },

  quote: {
    position: "absolute",
    right: 17,
    bottom: -18,
    color: "#423B21",
    fontSize: 110,
    fontWeight: "900",
  },
});