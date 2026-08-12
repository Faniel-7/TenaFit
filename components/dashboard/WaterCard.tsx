import React from "react";
import { View, Text, StyleSheet } from "react-native";

type WaterCardProps = {
  consumed?: number;
  target?: number;
  glassesConsumed?: number;
  totalGlasses?: number;
};

export default function WaterCard({
  consumed = 1.6,
  target = 2.5,
  glassesConsumed = 4,
  totalGlasses = 6,
}: WaterCardProps) {
  return (
    <View style={styles.waterCard}>
      <View style={styles.waterTitleRow}>
        <Text style={styles.waterEmoji}>
          💧
        </Text>

        <Text style={styles.cardTitle}>
          WATER INTAKE
        </Text>
      </View>

      <View style={styles.waterAmount}>
        <Text style={styles.waterMain}>
          {consumed.toFixed(1)}
        </Text>

        <Text style={styles.waterTarget}>
          / {target.toFixed(1)} L
        </Text>
      </View>

      <View style={styles.glasses}>
        {Array.from(
          { length: totalGlasses },
          (_, index) => index + 1
        ).map((item) => {
          const isFull = item <= glassesConsumed;

          return (
            <View
              key={item}
              style={[
                styles.glass,
                isFull && styles.filledGlass,
              ]}
            >
              {isFull && (
                <View
                  style={styles.waterInside}
                />
              )}
            </View>
          );
        })}
      </View>

      <Text style={styles.waterMessage}>
        Keep it up! 💧
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  waterCard: {
    width: "100%",
    borderRadius: 21,
    borderWidth: 1,
    borderColor: "#2A303C",
    backgroundColor: "#0D1119",
    padding: 20,
    minHeight: 225,
  },

  waterTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },

  waterEmoji: {
    fontSize: 21,
  },

  cardTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },

  waterAmount: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 15,
  },

  waterMain: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
  },

  waterTarget: {
    color: "#A9AFBA",
    fontSize: 16,
    marginLeft: 6,
  },

  glasses: {
    flexDirection: "row",
    gap: 9,
    marginTop: 18,
  },

  glass: {
    width: 27,
    height: 36,
    borderWidth: 2,
    borderColor: "#566070",
    borderRadius: 4,
    overflow: "hidden",
    justifyContent: "flex-end",
  },

  filledGlass: {
    borderColor: "#DCEBFF",
  },

  waterInside: {
    width: "100%",
    height: "80%",
    backgroundColor: "#1597E8",
  },

  waterMessage: {
    color: "#A9AFBA",
    fontSize: 13,
    marginTop: 20,
  },
});