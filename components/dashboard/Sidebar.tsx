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

      {/* =====================================================
          LOGO
      ====================================================== */}

      <View style={styles.sidebarLogo}>
        <Ionicons
          name="fitness"
          size={31}
          color="#FFC107"
        />

        <Text style={styles.sidebarLogoText}>
          Tena
          <Text style={styles.logoAccent}>
            Fit
          </Text>
        </Text>
      </View>

      {/* =====================================================
          NAVIGATION VIEWPORT

          IMPORTANT:
          This View is the clipping boundary.

          Nothing inside the navigation ScrollView is allowed
          to visually escape into the Premium/Profile area.
      ====================================================== */}

      <View style={styles.navigationViewport}>

        <ScrollView
          style={styles.navigationScroll}
          contentContainerStyle={
            styles.sidebarNavigation
          }
          showsVerticalScrollIndicator={false}
          bounces={false}
        >

          <SidebarItem
            icon="home"
            label="Home"
            active={isActive("/home")}
            onPress={() =>
              navigate("/home")
            }
          />

          <SidebarItem
            icon="calendar-outline"
            label="Plan"
            active={isActive(
              "/dashboard/plan"
            )}
            onPress={() =>
              navigate(
                "/dashboard/plan"
              )
            }
          />

          <SidebarItem
            icon="bar-chart-outline"
            label="Progress"
            active={isActive(
              "/dashboard/progress"
            )}
            onPress={() =>
              navigate(
                "/dashboard/progress"
              )
            }
          />

          <SidebarItem
            icon="restaurant-outline"
            label="Meals"
            active={isActive(
              "/dashboard/meals"
            )}
            onPress={() =>
              navigate(
                "/dashboard/meals"
              )
            }
          />

          <SidebarItem
            icon="barbell-outline"
            label="Workouts"
            active={isActive(
              "/dashboard/workouts"
            )}
            onPress={() =>
              navigate(
                "/dashboard/workouts"
              )
            }
          />

          <SidebarItem
            icon="water-outline"
            label="Water"
            active={isActive(
              "/dashboard/water"
            )}
            onPress={() =>
              navigate(
                "/dashboard/water"
              )
            }
          />
<SidebarItem
            icon="document-text-outline"
            label="Reports"
            active={isActive(
              "/dashboard/reports"
            )}
            onPress={() =>
              navigate(
                "/dashboard/reports"
              )
            }
          />

          <SidebarItem
            icon="settings-outline"
            label="Settings"
            active={isActive(
              "/dashboard/settings"
            )}
            onPress={() =>
              navigate(
                "/dashboard/settings"
              )
            }
          />

        </ScrollView>

      </View>

      {/* =====================================================
          BOTTOM AREA

          This is completely outside the navigation viewport.
      ====================================================== */}

      <View style={styles.sidebarBottom}>

        {/* PREMIUM */}

        <View style={styles.premiumCard}>

          <Ionicons
            name="diamond"
            size={25}
            color="#FFC107"
          />

          <Text style={styles.premiumTitle}>
            Go Premium
          </Text>

          <Text style={styles.premiumText}>
            Unlock AI recommendations,
            meal scanner, and more.
          </Text>

          <Pressable
            style={styles.upgradeButton}
          >
            <Text style={styles.upgradeText}>
              Upgrade Now
            </Text>
          </Pressable>

        </View>

        {/* USER */}

        <View style={styles.sidebarUser}>

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
              numberOfLines={1}
            >
              {displayName}
            </Text>

            <Text
              style={
                styles.sidebarLevel
              }
            >
              Level 12
            </Text>

            <View style={styles.xpTrack}>
              <View
                style={[
                  styles.xpFill,
                  {
                    width: "57%",
                  },
                ]}
              />
            </View>

            <Text style={styles.xpText}>
              2,850 / 5,000 XP
            </Text>

          </View>

        </View>

      </View>

    </View>
  );
}

function SidebarItem({
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
      onPress={onPress}
      style={({ pressed }) => [
        styles.sidebarItem,
        active &&
          styles.sidebarItemActive,
        pressed &&
          styles.sidebarItemPressed,
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
          styles.sidebarItemText,
          active &&
            styles.sidebarItemTextActive,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({

  /* =========================================================
     SIDEBAR
  ========================================================== */

  sidebar: {
    width: 245,
    minWidth: 245,
    height: "100%",
    backgroundColor: "#080A0F",
    borderRightWidth: 1,
    borderRightColor: "#252A34",
    paddingHorizontal: 20,
    paddingTop: 27,
    paddingBottom: 20,
    overflow: "hidden",
  },

  /* =========================================================
     LOGO
  ========================================================== */
sidebarLogo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 35,
    paddingHorizontal: 5,
    flexShrink: 0,
  },

  sidebarLogoText: {
    color: "#FFFFFF",
    fontSize: 27,
    fontWeight: "900",
    marginLeft: 9,
    letterSpacing: -1,
  },

  logoAccent: {
    color: "#FFC107",
  },

  /* =========================================================
     NAVIGATION VIEWPORT

     THIS IS THE IMPORTANT FIX.

     flex: 1 gives navigation the remaining space.

     overflow: "hidden" creates a hard visual boundary so
     ScrollView content cannot paint over Premium.
  ========================================================== */

  navigationViewport: {
    flex: 1,
    minHeight: 0,
    flexShrink: 1,
    overflow: "hidden",
  },

  /* =========================================================
     SCROLLVIEW
  ========================================================== */

  navigationScroll: {
    flex: 1,
    minHeight: 0,
  },

  sidebarNavigation: {
    gap: 8,
    paddingBottom: 10,
  },

  /* =========================================================
     NAVIGATION ITEMS
  ========================================================== */

  sidebarItem: {
    height: 54,
    minHeight: 54,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    flexShrink: 0,
  },

  sidebarItemActive: {
    backgroundColor: "#171A22",
  },

  sidebarItemPressed: {
    opacity: 0.75,
  },

  sidebarItemText: {
    color: "#A8ADB8",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 16,
  },

  sidebarItemTextActive: {
    color: "#FFC107",
    fontWeight: "800",
  },

  /* =========================================================
     BOTTOM AREA
  ========================================================== */

  sidebarBottom: {
    flexShrink: 0,
    paddingTop: 12,
    backgroundColor: "#080A0F",
  },

  /* =========================================================
     PREMIUM
  ========================================================== */

  premiumCard: {
    backgroundColor: "#11110D",
    borderWidth: 1,
    borderColor: "#393426",
    borderRadius: 18,
    padding: 15,
    alignItems: "center",
    flexShrink: 0,
  },

  premiumTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
    marginTop: 7,
  },

  premiumText: {
    color: "#A9AFBA",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    marginTop: 7,
  },

  upgradeButton: {
    width: "100%",
    height: 38,
    borderRadius: 10,
    backgroundColor: "#FFC107",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },

  upgradeText: {
    color: "#111111",
    fontSize: 12,
    fontWeight: "900",
  },

  /* =========================================================
     USER
  ========================================================== */

  sidebarUser: {
    marginTop: 18,
    borderTopWidth: 1,
    borderTopColor: "#242832",
    paddingTop: 16,
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 0,
  },

  sidebarUserAvatar: {
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

  sidebarUserInfo: {
    flex: 1,
    minWidth: 0,
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
    backgroundColor: "#252A33",
    overflow: "hidden",
    marginTop: 8,
  },

  xpFill: {
    height: "100%",
    backgroundColor: "#FFC107",
    borderRadius: 3,
  },

  xpText: {
    color: "#9CA3AF",
    fontSize: 10,
    marginTop: 5,
  },

});