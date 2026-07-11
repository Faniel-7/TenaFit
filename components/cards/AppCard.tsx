import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { useTheme } from "../../context/ThemeContext";

type AppCardProps = ViewProps & {
  children: React.ReactNode;
};

export default function AppCard({ children, style, ...rest }: AppCardProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
});