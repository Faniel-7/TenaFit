import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { useAuth } from "../../context/AuthContext";

type SidebarProps = {
  fullName?: string;
};

type SidebarRoute =
  | "/home"
  | "/dashboard/plan"
  | "/dashboard/progress"
  | "/dashboard/meals"
  | "/dashboard/workouts"
  | "/dashboard/water"
  | "/dashboard/reports"
  | "/dashboard/settings";

export default function Sidebar({
  fullName,
}: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const displayName =
    fullName?.trim() ||
    user?.fullName?.trim() ||
    "Your Profile";

  const navigate = (route: SidebarRoute) => {
    router.replace(route);
  };

  const isActive = (route: SidebarRoute) => {
    if (route === "/home") {
      return (
        pathname === "/home" ||
        pathname === "/"
      );
    }

    return pathname === route;
  };

  return (
    <View style={styles.sidebar}>
      <View style={styles.logo}>
        <Ionicons
          name="fitness"
          size={31}
          color="#FFC107"
        />

        <Text style={styles.logoText}>
          Tena
          <Text style={styles.logoAccent}>
            Fit
          </Text>
        </Text>
      </View>

      <View style={styles.navigationViewport}>
        <ScrollView
          style={styles.navigationScroll}
          contentContainerStyle={
            styles.navigationContent
          }
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <SidebarItem
            icon="home"
            label="Home"
            active={isActive("/home")}
            onPress={() => navigate("/home")}
          />

          <SidebarItem
            icon="calendar-outline"
            label="Plan"
            active={isActive(
              "/dashboard/plan"
            )}
            onPress={() =>
              navigate("/dashboard/plan")
            }
          />

          <SidebarItem
            icon="bar-chart-outline"
            label="Progress"
            active={isActive(
              "/dashboard/progress"
            )}
            onPress={() =>
              navigate("/dashboard/progress")
            }
          />

          <SidebarItem
            icon="restaurant-outline"
            label="Meals"
            active={isActive(
              "/dashboard/meals"
            )}
            onPress={() =>
              navigate("/dashboard/meals")
            }
          />

          <SidebarItem
            icon="barbell-outline"
            label="Workouts"
            active={isActive(
              "/dashboard/workouts"
            )}
            onPress={() =>
              navigate("/dashboard/workouts")
            }
          />

          <SidebarItem
            icon="water-outline"
            label="Water"
            active={isActive(
              "/dashboard/water"
            )}
            onPress={() =>
              navigate("/dashboard/water")
            }
          />

          <SidebarItem
            icon="document-text-outline"
            label="Reports"
            active={isActive(
              "/dashboard/reports"
            )}
            onPress={() =>
              navigate("/dashboard/reports")
            }
          />

          <SidebarItem
            icon="settings-outline"
            label="Settings"
            active={isActive(
              "/dashboard/settings"
            )}
            onPress={() =>
              navigate("/dashboard/settings")
            }
          />
        </ScrollView>
      </View>

      <View style={styles.userSection}>
        <View style={styles.avatar}>
          <Ionicons
            name="person"
            size={22}
            color="#FFFFFF"
          />
        </View>

        <View style={styles.userInfo}>
          <Text
            style={styles.userName}
            numberOfLines={1}
          >
            {displayName}
          </Text>
<Text style={styles.level}>
            Level 12
          </Text>

          <View style={styles.xpTrack}>
            <View style={styles.xpFill} />
          </View>

          <Text style={styles.xpText}>
            2,850 / 5,000 XP
          </Text>
        </View>
      </View>
    </View>
  );
}

function SidebarItem({
  icon,
  label,
  active,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.item,
        active && styles.itemActive,
        pressed && styles.itemPressed,
      ]}
    >
      <Ionicons
        name={icon}
        size={23}
        color={
          active
            ? "#FFC107"
            : "#A8ADB8"
        }
      />

      <Text
        style={[
          styles.itemText,
          active &&
            styles.itemTextActive,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 245,
    minWidth: 245,
    height: "100%",
    backgroundColor: "#080A0F",
    borderRightWidth: 1,
    borderRightColor: "#252A34",
    position: "relative",
    overflow: "hidden",
  },

  logo: {
    position: "absolute",
    top: 27,
    left: 25,
    right: 25,
    height: 42,
    flexDirection: "row",
    alignItems: "center",
  },

  logoText: {
    color: "#FFFFFF",
    fontSize: 27,
    fontWeight: "900",
    marginLeft: 9,
    letterSpacing: -1,
  },

  logoAccent: {
    color: "#FFC107",
  },

  navigationViewport: {
    position: "absolute",
    top: 94,
    left: 20,
    right: 20,
    bottom: 125,
    overflow: "hidden",
  },

  navigationScroll: {
    flex: 1,
  },

  navigationContent: {
    paddingBottom: 15,
    gap: 8,
  },

  item: {
    height: 54,
    minHeight: 54,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    flexShrink: 0,
  },

  itemActive: {
    backgroundColor: "#171A22",
  },

  itemPressed: {
    opacity: 0.75,
  },

  itemText: {
    color: "#A8ADB8",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 16,
  },

  itemTextActive: {
    color: "#FFC107",
    fontWeight: "800",
  },

  userSection: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 20,
    borderTopWidth: 1,
    borderTopColor: "#242832",
    paddingTop: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "#FFC107",
    backgroundColor: "#22252A",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  userInfo: {
    flex: 1,
    minWidth: 0,
    marginLeft: 11,
  },

  userName: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },

  level: {
    color: "#9CA3AF",
    fontSize: 11,
    marginTop: 2,
  },

  xpTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "#252A33",
    overflow: "hidden",
    marginTop: 8,
  },

  xpFill: {
    height: "100%",
    width: "57%",
    backgroundColor: "#FFC107",
    borderRadius: 3,
  },

  xpText: {
    color: "#9CA3AF",
    fontSize: 10,
    marginTop: 5,
  },
});