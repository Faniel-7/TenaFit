import React from "react";
import { View, StyleSheet } from "react-native";

type Props = {
  current: number;
  total: number;
};

export default function ProgressSteps({
  current,
  total,
}: Props) {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            {
              backgroundColor:
                index < current ? "#FFC107" : "#333",
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
    gap: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});