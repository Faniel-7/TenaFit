import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";

type AppCardProps = ViewProps & {
  children: React.ReactNode;
};

export default function AppCard({ children, style, ...rest }: AppCardProps) {
  return (
    <View style={[styles.card, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 16,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
});