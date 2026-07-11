import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";

type CircularProgressProps = {
  size?: number;
  strokeWidth?: number;
  progress: number;
  valueText: string;
  label?: string;
  color: string;
  trackColor?: string;
  textColor: string;
  subTextColor: string;
};

export default function CircularProgress({
  size = 120,
  strokeWidth = 12,
  progress,
  valueText,
  label,
  color,
  trackColor = "#2A2B31",
  textColor,
  subTextColor,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const safeProgress = Math.max(0, Math.min(100, progress));
  const strokeDashoffset = circumference - (circumference * safeProgress) / 100;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          originX={size / 2}
          originY={size / 2}
        />
      </Svg>

      <View style={styles.center}>
        <Text style={[styles.valueText, { color: textColor }]}>{valueText}</Text>
        {label ? (
          <Text style={[styles.labelText, { color: subTextColor }]}>
            {label}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  valueText: {
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: -1,
  },
  labelText: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "700",
  },
});