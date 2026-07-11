import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";

type TabKey = "home" | "workouts" | "progress" | "profile";

type Props = {
  activeTab?: TabKey;
  onTabPress?: (tab: TabKey) => void;
};

export default function BottomNav({
  activeTab = "progress",
  onTabPress,
}: Props) {
  const { colors } = useTheme();

  const tabs: {
    key: TabKey;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
  }[] = [
    { key: "home", label: "Home", icon: "home" },
    { key: "workouts", label: "Workouts", icon: "barbell" },
    { key: "progress", label: "Progress", icon: "stats-chart" },
    { key: "profile", label: "Profile", icon: "person-outline" },
  ];

  return (
    <View
      style={[
        styles.bar,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      {tabs.map((tab) => {
        const active = tab.key === activeTab;

        return (
          <Pressable
            key={tab.key}
            onPress={() => onTabPress?.(tab.key)}
            style={({ pressed }) => [
              styles.item,
              active && { backgroundColor: colors.background },
              pressed && styles.pressed,
            ]}
          >
            <Ionicons
              name={tab.icon}
              size={22}
              color={active ? colors.primary : colors.subtext}
            />
            <Text
              style={[
                styles.label,
                { color: active ? colors.primary : colors.subtext },
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 28,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginTop: 18,
    marginBottom: 8,
  },
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 22,
    gap: 4,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
  },
});