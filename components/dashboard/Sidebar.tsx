import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const dashboardData = {
  user: {
    fullName: "Faniel Negasi",
    level: 12,
    xp: 2850,
    xpGoal: 5000,
  },
};

export default function Sidebar() {
  return (
    <View style={styles.sidebar}>
      {/* LOGO */}

      <View style={styles.sidebarLogo}>
        <Ionicons
          name="fitness"
          size={31}
          color="#FFC107"
        />

        <Text
          style={styles.sidebarLogoText}
        >
          Tena
          <Text
            style={styles.logoAccent}
          >
            Fit
          </Text>
        </Text>
      </View>

      {/* NAVIGATION */}

      <View
        style={styles.sidebarNavigation}
      >
        <SidebarItem
          icon="home"
          label="Home"
          onPress={() =>
            router.replace(
              "/home"
            )
          }
        />

        <SidebarItem
          icon="calendar-outline"
          label="Plan"
          onPress={() =>
            router.replace(
              "/dashboard/plan"
            )
          }
        />

        <SidebarItem
          icon="bar-chart-outline"
          label="Progress"
          onPress={() =>
            router.replace(
              "/dashboard/progress"
            )
          }
        />

        <SidebarItem
          icon="restaurant-outline"
          label="Meals"
          onPress={() =>
            router.replace(
              "/dashboard/meals"
            )
          }
        />

        <SidebarItem
          icon="barbell-outline"
          label="Workouts"
          onPress={() =>
            router.replace(
              "/dashboard/workouts"
            )
          }
        />

        <SidebarItem
          icon="water-outline"
          label="Water"
          onPress={() =>
            router.replace(
              "/dashboard/water"
            )
          }
        />

        <SidebarItem
          icon="document-text-outline"
          label="Reports"
          onPress={() =>
            router.replace(
              "/dashboard/reports"
            )
          }
        />

        <SidebarItem
          icon="settings-outline"
          label="Settings"
          onPress={() =>
            router.replace(
              "/dashboard/settings"
            )
          }
        />
      </View>

      {/* PREMIUM */}

      <View
        style={styles.premiumCard}
      >
        <Ionicons
          name="diamond"
          size={25}
          color="#FFC107"
        />

        <Text
          style={styles.premiumTitle}
        >
          Go Premium
        </Text>

        <Text
          style={styles.premiumText}
        >
          Unlock AI recommendations,
          meal scanner, and more.
        </Text>

        <Pressable
          style={
            styles.upgradeButton
          }
        >
          <Text
            style={styles.upgradeText}
          >
            Upgrade Now
          </Text>
        </Pressable>
      </View>

      {/* USER */}

      <View
        style={styles.sidebarUser}
      >
        <View
          style={
            styles.sidebarUserAvatar
          }
        >
          <Ionicons
            name="person"
            size={22}
            color="#FFFFFF"
          />
        </View>

        <View
          style={styles.sidebarUserInfo}
        >
          <Text
            style={
              styles.sidebarUserName
            }
          >
            {
              dashboardData.user
                .fullName
            }
          </Text>

          <Text
            style={styles.sidebarLevel}
          >
            Level{" "}
            {
              dashboardData.user
                .level
            }
          </Text>
<View
            style={styles.xpTrack}
          >
            <View
              style={[
                styles.xpFill,
                {
                  width: `${
                    (dashboardData.user
                      .xp /
                      dashboardData.user
                        .xpGoal) *
                    100
                  }%`,
                },
              ]}
            />
          </View>

          <Text
            style={styles.xpText}
          >
            {dashboardData.user.xp.toLocaleString()}{" "}
            /{" "}
            {dashboardData.user.xpGoal.toLocaleString()}{" "}
            XP
          </Text>
        </View>
      </View>
    </View>
  );
}

function SidebarItem({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.sidebarItem}
    >
      <Ionicons
        name={icon}
        size={23}
        color="#A8ADB8"
      />

      <Text
        style={styles.sidebarItemText}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles =
  StyleSheet.create({
    sidebar: {
      width: 245,
      backgroundColor:
        "#0B0E14",
      borderRightWidth: 1,
      borderRightColor:
        "#20242D",
      paddingHorizontal: 17,
      paddingTop: 25,
      paddingBottom: 20,
    },

    sidebarLogo: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 35,
      paddingHorizontal: 8,
    },

    sidebarLogoText: {
      color: "#FFFFFF",
      fontSize: 24,
      fontWeight: "900",
      marginLeft: 10,
      letterSpacing: -0.5,
    },

    logoAccent: {
      color: "#FFC107",
    },

    sidebarNavigation: {
      gap: 7,
      flex: 1,
    },

    sidebarItem: {
      height: 47,
      borderRadius: 11,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 13,
    },

    sidebarItemText: {
      color: "#A8ADB8",
      fontSize: 13,
      fontWeight: "700",
      marginLeft: 12,
    },

    premiumCard: {
      backgroundColor:
        "#151922",
      borderWidth: 1,
      borderColor:
        "#2A2F3A",
      borderRadius: 15,
      padding: 15,
      marginBottom: 18,
    },

    premiumTitle: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "900",
      marginTop: 9,
    },

    premiumText: {
      color: "#8F96A3",
      fontSize: 11,
      lineHeight: 17,
      marginTop: 5,
    },

    upgradeButton: {
      height: 34,
      borderRadius: 8,
      backgroundColor:
        "#FFC107",
      alignItems: "center",
      justifyContent:
        "center",
      marginTop: 12,
    },

    upgradeText: {
      color: "#111111",
      fontSize: 11,
      fontWeight: "900",
    },

    sidebarUser: {
      flexDirection: "row",
      alignItems: "center",
    },

    sidebarUserAvatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      borderWidth: 2,
      borderColor:
        "#FFC107",
      backgroundColor:
        "#22252A",
      alignItems: "center",
      justifyContent:
        "center",
    },

    sidebarUserInfo: {
      flex: 1,
      marginLeft: 11,
    },

    sidebarUserName: {
      color: "#FFFFFF",
      fontSize: 13,
      fontWeight: "800",
    },

    sidebarLevel: {
      color: "#9CA3AF",
      fontSize: 11,
      marginTop: 2,
    },

    xpTrack: {
      height: 6,
      borderRadius: 3,
      backgroundColor:
        "#252A33",
      overflow: "hidden",
      marginTop: 8,
    },

    xpFill: {
      height: "100%",
      backgroundColor:
        "#FFC107",
      borderRadius: 3,
    },

    xpText: {
      color: "#9CA3AF",
      fontSize: 10,
      marginTop: 5,
    },
  });