import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

type BottomNavProps = {
  onAddPress?: () => void;
};

type NavRoute =
  | "/home"
  | "/dashboard/plan"
  | "/dashboard/progress"
  | "/dashboard/profile";

export default function BottomNav({
  onAddPress,
}: BottomNavProps) {
  const navigate = (
    route: NavRoute
  ) => {
    router.push(route);
  };

  return (
    <View style={styles.bottomNav}>
      <NavItem
        icon="home"
        label="Home"
        active
        onPress={() =>
          navigate("/home")
        }
      />

      <NavItem
        icon="calendar-outline"
        label="Plan"
        onPress={() =>
          navigate("/dashboard/plan")
        }
      />

      <Pressable
        style={styles.addButton}
        onPress={onAddPress}
      >
        <Ionicons
          name="add"
          size={36}
          color="#111111"
        />
      </Pressable>

      <NavItem
        icon="bar-chart-outline"
        label="Progress"
        onPress={() =>
          navigate(
            "/dashboard/progress"
          )
        }
      />

      <NavItem
        icon="person-circle-outline"
        label="Profile"
        onPress={() =>
          navigate(
            "/dashboard/profile"
          )
        }
      />
    </View>
  );
}

function NavItem({
  icon,
  label,
  active = false,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={styles.navItem}
      onPress={onPress}
    >
      <Ionicons
        name={icon}
        size={25}
        color={
          active
            ? "#FFC107"
            : "#9CA3AF"
        }
      />

      <Text
        style={[
          styles.navLabel,
          active &&
            styles.activeNavLabel,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles =
  StyleSheet.create({
    bottomNav: {
      position: "absolute",
      left: 12,
      right: 12,
      bottom: 10,
      height: 73,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: "#2A303C",
      backgroundColor: "#0D1119",
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-around",
      paddingHorizontal: 8,
    },

    navItem: {
      flex: 1,
      alignItems: "center",
      justifyContent:
        "center",
      gap: 3,
    },

    navLabel: {
      color: "#9CA3AF",
      fontSize: 10,
      fontWeight: "700",
    },

    activeNavLabel: {
      color: "#FFC107",
    },

    addButton: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor:
        "#FFC107",
      justifyContent:
        "center",
      alignItems: "center",
      marginHorizontal: 5,
    },
  });