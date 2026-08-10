import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type NavItemData = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
};

type Props = {
  active?: string;
  onNavigate?: (label: string) => void;
};

const items: NavItemData[] = [
  {
    icon: "home",
    label: "Home",
  },
  {
    icon: "calendar-outline",
    label: "Plan",
  },
  {
    icon: "bar-chart-outline",
    label: "Progress",
  },
  {
    icon: "person-circle-outline",
    label: "Profile",
  },
];

export default function BottomNav({
  active = "Home",
  onNavigate,
}: Props) {
  return (
    <View style={styles.bottomNav}>
      <NavItem
        {...items[0]}
        active={active === items[0].label}
        onPress={() =>
          onNavigate?.(items[0].label)
        }
      />

      <NavItem
        {...items[1]}
        active={active === items[1].label}
        onPress={() =>
          onNavigate?.(items[1].label)
        }
      />

      <Pressable
        style={styles.addButton}
        onPress={() => onNavigate?.("Add")}
      >
        <Ionicons
          name="add"
          size={38}
          color="#111111"
        />
      </Pressable>

      <NavItem
        {...items[2]}
        active={active === items[2].label}
        onPress={() =>
          onNavigate?.(items[2].label)
        }
      />

      <NavItem
        {...items[3]}
        active={active === items[3].label}
        onPress={() =>
          onNavigate?.(items[3].label)
        }
      />
    </View>
  );
}

function NavItem({
  icon,
  label,
  active,
  onPress,
}: NavItemData & {
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={styles.navItem}
      onPress={onPress}
    >
      <Ionicons
        name={icon}
        size={26}
        color={
          active
            ? "#FFC107"
            : "#9CA3AF"
        }
      />

      <Text
        style={[
          styles.navLabel,
          active && styles.activeNavLabel,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    position: "absolute",
    left: 22,
    right: 22,
    bottom: 18,
    height: 90,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#2A303C",
    backgroundColor: "#0D1119",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 15,
  },

  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },

  navLabel: {
    color: "#9CA3AF",
    fontSize: 12,
    fontWeight: "700",
  },

  activeNavLabel: {
    color: "#FFC107",
  },

  addButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FFC107",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
  },
});