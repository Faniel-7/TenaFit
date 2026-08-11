import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import GoalCard from "../../components/dashboard/GoalCard";
import MacroCard from "../../components/dashboard/MacroCard";
import QuickAction from "../../components/dashboard/QuickAction";
import MealCard from "../../components/dashboard/MealCard";
import WaterCard from "../../components/dashboard/WaterCard";
import DailyTip from "../../components/dashboard/DailyTip";
import BottomNav from "../../components/dashboard/BottomNav";

const isWeb = Platform.OS === "web";

/*
=========================================================
RESPONSIVE DETECTION
=========================================================
*/

function useIsMobileLayout() {
  const [isMobile, setIsMobile] = useState(() => {
    if (Platform.OS !== "web") {
      return true;
    }

    if (typeof window === "undefined") {
      return false;
    }

    return window.matchMedia(
      "(max-width: 767px)"
    ).matches;
  });

  useEffect(() => {
    if (
      Platform.OS !== "web" ||
      typeof window === "undefined"
    ) {
      return;
    }

    const mediaQuery = window.matchMedia(
      "(max-width: 767px)"
    );

    const updateLayout = () => {
      setIsMobile(mediaQuery.matches);
    };

    updateLayout();

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener(
        "change",
        updateLayout
      );

      return () => {
        mediaQuery.removeEventListener(
          "change",
          updateLayout
        );
      };
    }

    mediaQuery.addListener(updateLayout);

    return () => {
      mediaQuery.removeListener(updateLayout);
    };
  }, []);

  return isMobile;
}

/*
=========================================================
DASHBOARD DATA
=========================================================
*/

const dashboardData = {
  user: {
    firstName: "Faniel",
    fullName: "Faniel Negasi",
    level: 12,
    xp: 2850,
    xpGoal: 5000,
  },

  calories: {
    consumed: 1240,
    goal: 1850,
  },

  macros: {
    protein: {
      current: 82,
      target: 120,
    },

    carbs: {
      current: 140,
      target: 210,
    },

    fats: {
      current: 38,
      target: 60,
    },
  },

  water: {
    consumed: 1.6,
    target: 2.5,
    glassesConsumed: 4,
    totalGlasses: 6,
  },

  tip: "Stay consistent, even on your off days. Your future self will thank you.",
};

/*
=========================================================
HOME
=========================================================
*/

export default function HomeScreen() {
  const isMobile = useIsMobileLayout();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View
        style={[
          styles.screen,
          isMobile
            ? styles.mobileScreen
            : styles.desktopScreen,
        ]}
      >
        {isMobile ? (
          <MobileHome />
        ) : (
          <DesktopHome />
        )}
      </View>
    </SafeAreaView>
  );
}

/*
=========================================================
MOBILE HOME
=========================================================
*/

function MobileHome() {
  return (
    <View style={styles.mobileRoot}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.mobileContent}
      >
        {/* HEADER */}

        <View style={styles.mobileHeader}>
          <View style={styles.logoRow}>
            <View style={styles.logoIcon}>
              <Ionicons
                name="fitness"
                size={27}
                color="#FFC107"
              />
            </View>

            <Text style={styles.logoText}>
              Tena
              <Text style={styles.logoAccent}>
                Fit
              </Text>
            </Text>
          </View>
<View style={styles.headerActions}>
            <Pressable
              style={styles.notificationButton}
            >
              <Ionicons
                name="notifications-outline"
                size={26}
                color="#FFFFFF"
              />

              <View
                style={styles.notificationDot}
              />
            </Pressable>

            <Pressable style={styles.mobileAvatar}>
              <Ionicons
                name="person"
                size={24}
                color="#FFFFFF"
              />
            </Pressable>
          </View>
        </View>

        {/* GREETING */}

        <View style={styles.mobileGreeting}>
          <Text style={styles.mobileGreetingTitle}>
            Good evening,{" "}
            {dashboardData.user.firstName} 👋
          </Text>

          <Text style={styles.mobileGreetingSubtitle}>
            Ready to stay on track and crush your goals?
          </Text>
        </View>

        {/* GOAL */}

        <GoalCard
          mobile
          consumed={
            dashboardData.calories.consumed
          }
          goal={
            dashboardData.calories.goal
          }
        />

        {/* MACROS */}

        <View style={styles.mobileMacroRow}>
          <MacroCard
            icon="fitness-outline"
            title="PROTEIN"
            value={
              dashboardData.macros.protein.current
            }
            target={
              dashboardData.macros.protein.target
            }
            type="protein"
          />

          <MacroCard
            icon="leaf-outline"
            title="CARBS"
            value={
              dashboardData.macros.carbs.current
            }
            target={
              dashboardData.macros.carbs.target
            }
            type="carbs"
          />

          <MacroCard
            icon="water-outline"
            title="FATS"
            value={
              dashboardData.macros.fats.current
            }
            target={
              dashboardData.macros.fats.target
            }
            type="fats"
          />
        </View>

        {/* QUICK ACTIONS */}

        <Text style={styles.mobileSectionTitle}>
          QUICK ACTIONS
        </Text>

        <View style={styles.mobileQuickActions}>
          <QuickAction
            icon="add"
            title="Add Meal"
            subtitle="Log your food"
            onPress={() => router.push("/")}
          />

          <QuickAction
            icon="scan-outline"
            title="Scan Food"
            subtitle="Scan barcode or QR"
            onPress={() => router.push("/")}
          />
        </View>

        {/* LOWER */}

        <View style={styles.mobileLower}>
          <MealCard />

          <WaterCard
            consumed={
              dashboardData.water.consumed
            }
            target={
              dashboardData.water.target
            }
            glassesConsumed={
              dashboardData.water.glassesConsumed
            }
            totalGlasses={
              dashboardData.water.totalGlasses
            }
          />

          <DailyTip
            tip={dashboardData.tip}
          />
        </View>
      </ScrollView>

      <BottomNav
        onAddPress={() => router.push("/")}
      />
    </View>
  );
}

/*
=========================================================
DESKTOP HOME
=========================================================
*/

function DesktopHome() {
  return (
    <View style={styles.desktopRoot}>
      <Sidebar />

      <View style={styles.desktopMain}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            styles.desktopContent
          }
        >
          {/* TOP HEADER */}

          <View style={styles.desktopHeader}>
            <View>
              <Text style={styles.desktopGreetingTitle}>
                Good evening,{" "}
                {dashboardData.user.firstName} 👋
              </Text>
<Text
                style={styles.desktopGreetingSubtitle}
              >
                Ready to stay on track and crush your goals?
              </Text>
            </View>

            <View
              style={styles.desktopHeaderActions}
            >
              <Pressable
                style={styles.notificationButton}
              >
                <Ionicons
                  name="notifications-outline"
                  size={27}
                  color="#FFFFFF"
                />

                <View
                  style={styles.notificationDot}
                />
              </Pressable>

              <Pressable style={styles.desktopAvatar}>
                <Ionicons
                  name="person"
                  size={25}
                  color="#FFFFFF"
                />
              </Pressable>
            </View>
          </View>

          {/* TOP GRID */}

          <View style={styles.desktopTopGrid}>
            <View style={styles.desktopGoalColumn}>
              <GoalCard
                consumed={
                  dashboardData.calories.consumed
                }
                goal={
                  dashboardData.calories.goal
                }
              />
            </View>

            <View style={styles.desktopRightTop}>
              <View style={styles.desktopMacroRow}>
                <MacroCard
                  icon="fitness-outline"
                  title="PROTEIN"
                  value={
                    dashboardData.macros.protein.current
                  }
                  target={
                    dashboardData.macros.protein.target
                  }
                  type="protein"
                />

                <MacroCard
                  icon="leaf-outline"
                  title="CARBS"
                  value={
                    dashboardData.macros.carbs.current
                  }
                  target={
                    dashboardData.macros.carbs.target
                  }
                  type="carbs"
                />

                <MacroCard
                  icon="water-outline"
                  title="FATS"
                  value={
                    dashboardData.macros.fats.current
                  }
                  target={
                    dashboardData.macros.fats.target
                  }
                  type="fats"
                />
              </View>

              <Text
                style={styles.desktopSectionTitle}
              >
                QUICK ACTIONS
              </Text>

              <View
                style={styles.desktopQuickActions}
              >
                <QuickAction
                  icon="add"
                  title="Add Meal"
                  subtitle="Log your food"
                  onPress={() => router.push("/")}
                />

                <QuickAction
                  icon="scan-outline"
                  title="Scan Food"
                  subtitle="Scan barcode or QR"
                  onPress={() => router.push("/")}
                />
              </View>
            </View>
          </View>

          {/* LOWER GRID */}

          <View style={styles.desktopLowerGrid}>
            <MealCard />

            <View style={styles.desktopLowerRight}>
              <WaterCard
                consumed={
                  dashboardData.water.consumed
                }
                target={
                  dashboardData.water.target
                }
                glassesConsumed={
                  dashboardData.water.glassesConsumed
                }
                totalGlasses={
                  dashboardData.water.totalGlasses
                }
              />

              <DailyTip
                tip={dashboardData.tip}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

/*
=========================================================
SIDEBAR
=========================================================
*/
function Sidebar() {
  return (
    <View style={styles.sidebar}>
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

      <View style={styles.sidebarNavigation}>
        <SidebarItem
          icon="home"
          label="Home"
          active
        />

        <SidebarItem
          icon="calendar-outline"
          label="Plan"
        />

        <SidebarItem
          icon="bar-chart-outline"
          label="Progress"
        />

        <SidebarItem
          icon="restaurant-outline"
          label="Meals"
        />

        <SidebarItem
          icon="barbell-outline"
          label="Workouts"
        />

        <SidebarItem
          icon="water-outline"
          label="Water"
        />

        <SidebarItem
          icon="document-text-outline"
          label="Reports"
        />

        <SidebarItem
          icon="settings-outline"
          label="Settings"
        />
      </View>

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

      <View style={styles.sidebarUser}>
        <View style={styles.sidebarUserAvatar}>
          <Ionicons
            name="person"
            size={22}
            color="#FFFFFF"
          />
        </View>

        <View style={styles.sidebarUserInfo}>
          <Text style={styles.sidebarUserName}>
            {dashboardData.user.fullName}
          </Text>

          <Text style={styles.sidebarLevel}>
            Level {dashboardData.user.level}
          </Text>

          <View style={styles.xpTrack}>
            <View
              style={[
                styles.xpFill,
                {
                  width: `${
                    (dashboardData.user.xp /
                      dashboardData.user.xpGoal) *
                    100
                  }%`,
                },
              ]}
            />
          </View>

          <Text style={styles.xpText}>
            {dashboardData.user.xp.toLocaleString()} /{" "}
            {dashboardData.user.xpGoal.toLocaleString()} XP
          </Text>
        </View>
      </View>
    </View>
  );
}

function SidebarItem({
  icon,
  label,
  active = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active?: boolean;
}) {
  return (
    <Pressable
      style={[
        styles.sidebarItem,
        active && styles.sidebarItemActive,
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

/*
=========================================================
STYLES
=========================================================
*/

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    width: "100%",
    backgroundColor: "#05070B",
  },

  screen: {
    flex: 1,
    width: "100%",
    backgroundColor: "#05070B",
  },

  mobileScreen: {
    width: "100%",
  },

  desktopScreen: {
    width: "100%",
  },

  mobileRoot: {
    flex: 1,
    width: "100%",
  },

  mobileContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 115,
    width: "100%",
  },
mobileHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },

  logoRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  logoIcon: {
    marginRight: 8,
  },

  logoText: {
    color: "#FFFFFF",
    fontSize: 27,
    fontWeight: "900",
    letterSpacing: -1,
  },

  logoAccent: {
    color: "#FFC107",
  },

  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
  },

  notificationButton: {
    position: "relative",
    padding: 5,
  },

  notificationDot: {
    position: "absolute",
    right: 4,
    top: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFC107",
  },

  mobileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#22252A",
    borderWidth: 2,
    borderColor: "#FFC107",
    alignItems: "center",
    justifyContent: "center",
  },

  mobileGreeting: {
    marginBottom: 25,
  },

  mobileGreetingTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.7,
  },

  mobileGreetingSubtitle: {
    color: "#A9AFBA",
    fontSize: 15,
    marginTop: 5,
    lineHeight: 21,
  },

  mobileMacroRow: {
    width: "100%",
    flexDirection: "row",
    gap: 9,
    marginBottom: 25,
  },

  mobileSectionTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 10,
  },

  mobileQuickActions: {
    width: "100%",
    flexDirection: "row",
    gap: 10,
    marginBottom: 18,
  },

  mobileLower: {
    width: "100%",
    gap: 16,
  },

  desktopRoot: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    backgroundColor: "#05070B",
  },

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
  },

  sidebarLogo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 35,
    paddingHorizontal: 5,
  },

  sidebarLogoText: {
    color: "#FFFFFF",
    fontSize: 27,
    fontWeight: "900",
    marginLeft: 9,
    letterSpacing: -1,
  },

  sidebarNavigation: {
    gap: 8,
  },

  sidebarItem: {
    height: 54,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },

  sidebarItemActive: {
    backgroundColor: "#171A22",
  },

  sidebarItemText: {
    color: "#A9AFBA",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 16,
  },

  sidebarItemTextActive: {
    color: "#FFC107",
    fontWeight: "800",
  },

  premiumCard: {
    marginTop: "auto",
    borderWidth: 1,
    borderColor: "#393426",
    borderRadius: 18,
    backgroundColor: "#11110D",
    padding: 15,
    alignItems: "center",
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

  sidebarUser: {
    marginTop: 18,
    borderTopWidth: 1,
    borderTopColor: "#242832",
    paddingTop: 16,
    flexDirection: "row",
    alignItems: "center",
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

  desktopMain: {
    flex: 1,
    width: 0,
    backgroundColor: "#05070B",
  },

  desktopContent: {
    width: "100%",
    paddingHorizontal: 36,
    paddingTop: 28,
    paddingBottom: 35,
  },

  desktopHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 27,
  },

  desktopGreetingTitle: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: -0.7,
  },

  desktopGreetingSubtitle: {
    color: "#A9AFBA",
    fontSize: 15,
    marginTop: 5,
  },

  desktopHeaderActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },

  desktopAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#22252A",
    borderWidth: 2,
    borderColor: "#FFC107",
    alignItems: "center",
    justifyContent: "center",
  },

  desktopTopGrid: {
    width: "100%",
    flexDirection: "row",
    gap: 22,
    alignItems: "flex-start",
    marginBottom: 25,
  },

  desktopGoalColumn: {
    flex: 1.45,
    minWidth: 0,
  },

  desktopRightTop: {
    flex: 1,
    minWidth: 0,
  },

  desktopMacroRow: {
    width: "100%",
    flexDirection: "row",
    gap: 12,
  },

  desktopSectionTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
    marginTop: 20,
    marginBottom: 10,
  },

  desktopQuickActions: {
    width: "100%",
    flexDirection: "row",
    gap: 12,
  },

  desktopLowerGrid: {
    width: "100%",
    flexDirection: "row",
    gap: 22,
    alignItems: "flex-start",
  },

  desktopLowerRight: {
    flex: 1,
    minWidth: 0,
    gap: 18,
  },
});