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

import { useAuth } from "../../context/AuthContext";
import { getUserProfile } from "../../storage/profileStorage";
import { UserProfile } from "../../types/userProfile";
import { calculateNutritionTarget } from "../../logic/nutritionCalculator";

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
HOME DATA
=========================================================
*/

type HomeData = {
  firstName: string;
  fullName: string;

  /*
   * These remain as the existing temporary
   * gamification values until that system
   * is connected later.
   */
  level: number;
  xp: number;
  xpGoal: number;

  calories: {
    consumed: number;
    goal: number;
  };

  macros: {
    protein: {
      current: number;
      target: number;
    };

    carbs: {
      current: number;
      target: number;
    };

    fats: {
      current: number;
      target: number;
    };
  };

  water: {
    consumed: number;
    target: number;
    glassesConsumed: number;
    totalGlasses: number;
  };

  tip: string;
};

/*
=========================================================
HOME
=========================================================
*/

export default function HomeScreen() {
  const isMobile = useIsMobileLayout();

  const { user } = useAuth();

  const [profile, setProfile] =
    useState<UserProfile | null>(null);

  const [loadingProfile, setLoadingProfile] =
    useState(true);

  /*
   * Load the user's saved onboarding
   * profile when Home opens.
   */
  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        const savedProfile =
          await getUserProfile();

        if (mounted) {
          setProfile(savedProfile);
        }
      } catch (error) {
        console.error(
          "Failed to load Home profile:",
          error
        );
      } finally {
        if (mounted) {
          setLoadingProfile(false);
        }
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, []);
/*
   * If there is no profile, send the user
   * back to onboarding.
   */
  useEffect(() => {
    if (
      !loadingProfile &&
      !profile
    ) {
      router.replace(
        "/onboarding/personal-info"
      );
    }
  }, [
    loadingProfile,
    profile,
  ]);

  /*
   * Do not render the dashboard until
   * the profile has been loaded.
   */
  if (
    loadingProfile ||
    !profile
  ) {
    return (
      <SafeAreaView
        style={styles.safeArea}
      >
        <View
          style={
            styles.loadingContainer
          }
        >
          <Text
            style={
              styles.loadingText
            }
          >
            {loadingProfile
              ? "Loading your TenaFit profile..."
              : "Redirecting to setup..."}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  /*
   * The account name comes from AuthContext.
   */
  const fullName =
    user?.fullName?.trim() ||
    "TenaFit User";

  const firstName =
    fullName.split(" ")[0] ||
    "there";

  /*
   * Calculate personalized nutrition
   * targets using the existing nutrition
   * calculator.
   */
  const nutrition =
    calculateNutritionTarget({
      age: profile.age,

      gender: profile.gender,

      weightKg:
        profile.weightKg,

      heightCm:
        profile.heightCm,

      activityLevel:
        profile.activityLevel,

      goal:
        profile.goal,
    });

  /*
   * Build the data structure used by
   * the existing Home UI.
   */
  const homeData: HomeData = {
    firstName,

    fullName,

    /*
     * Keep the existing gamification
     * values for now.
     */
    level: 12,
    xp: 2850,
    xpGoal: 5000,

    /*
     * Meal tracking is not connected yet.
     * Therefore consumed calories start
     * at zero.
     *
     * The calorie TARGET is real and
     * comes from the user's profile.
     */
    calories: {
      consumed: 0,
      goal:
        nutrition.targetCalories,
    },

    /*
     * Macro TARGETS are personalized.
     *
     * Current consumed values remain
     * zero until Tracking is implemented.
     */
    macros: {
      protein: {
        current: 0,
        target:
          nutrition.proteinGrams,
      },

      carbs: {
        current: 0,
        target:
          nutrition.carbohydrateGrams,
      },

      fats: {
        current: 0,
        target:
          nutrition.fatGrams,
      },
    },

    /*
     * Water tracking will be connected
     * during the Tracking step.
     */
    water: {
      consumed: 0,
      target: 2.5,
      glassesConsumed: 0,
      totalGlasses: 6,
    },

    tip:
      "Stay consistent, even on your off days. Your future self will thank you.",
  };

  return (
    <SafeAreaView
      style={styles.safeArea}
    >
      <View
        style={[
          styles.screen,

          isMobile
            ? styles.mobileScreen
            : styles.desktopScreen,
        ]}
      >
        {isMobile ? (
          <MobileHome
            data={homeData}
          />
        ) : (
          <DesktopHome
            data={homeData}
          />
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

function MobileHome({
  data,
}: {
  data: HomeData;
}) {
  return (
    <View style={styles.mobileRoot}>
      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.mobileContent
        }
      >
        {/* HEADER */}

        <View
          style={
            styles.mobileHeader
          }
        >
          <View
            style={styles.logoRow}
          >
            <View
              style={styles.logoIcon}
            >
              <Ionicons
                name="fitness"
                size={27}
                color="#FFC107"
              />
            </View>
<Text
              style={styles.logoText}
            >
              Tena
              <Text
                style={
                  styles.logoAccent
                }
              >
                Fit
              </Text>
            </Text>
          </View>

          <View
            style={
              styles.headerActions
            }
          >
            <Pressable
              style={
                styles.notificationButton
              }
            >
              <Ionicons
                name="notifications-outline"
                size={26}
                color="#FFFFFF"
              />

              <View
                style={
                  styles.notificationDot
                }
              />
            </Pressable>

            <Pressable
              style={styles.mobileAvatar}
            >
              <Ionicons
                name="person"
                size={24}
                color="#FFFFFF"
              />
            </Pressable>
          </View>
        </View>

        {/* GREETING */}

        <View
          style={
            styles.mobileGreeting
          }
        >
          <Text
            style={
              styles.mobileGreetingTitle
            }
          >
            Good evening,{" "}
            {data.firstName} 👋
          </Text>

          <Text
            style={
              styles.mobileGreetingSubtitle
            }
          >
            Ready to stay on track and
            crush your goals?
          </Text>
        </View>

        {/* GOAL */}

        <GoalCard
          mobile
          consumed={
            data.calories.consumed
          }
          goal={
            data.calories.goal
          }
        />

        {/* MACROS */}

        <View
          style={
            styles.mobileMacroRow
          }
        >
          <MacroCard
            icon="fitness-outline"
            title="PROTEIN"
            value={
              data.macros.protein.current
            }
            target={
              data.macros.protein.target
            }
            type="protein"
          />

          <MacroCard
            icon="leaf-outline"
            title="CARBS"
            value={
              data.macros.carbs.current
            }
            target={
              data.macros.carbs.target
            }
            type="carbs"
          />

          <MacroCard
            icon="water-outline"
            title="FATS"
            value={
              data.macros.fats.current
            }
            target={
              data.macros.fats.target
            }
            type="fats"
          />
        </View>

        {/* QUICK ACTIONS */}

        <Text
          style={
            styles.mobileSectionTitle
          }
        >
          QUICK ACTIONS
        </Text>

        <View
          style={
            styles.mobileQuickActions
          }
        >
          <QuickAction
            icon="add"
            title="Add Meal"
            subtitle="Log your food"
            onPress={() => {
              console.log(
                "Add Meal navigation will be connected in the Tracking step."
              );
            }}
          />

          <QuickAction
            icon="scan-outline"
            title="Scan Food"
            subtitle="Scan barcode or QR"
            onPress={() => {
              console.log(
                "Scan Food navigation will be connected in the Scanner step."
              );
            }}
          />
        </View>

        {/* LOWER */}

        <View
          style={styles.mobileLower}
        >
          <MealCard />

          <WaterCard
            consumed={
              data.water.consumed
            }
            target={
              data.water.target
            }
            glassesConsumed={
              data.water.glassesConsumed
            }
            totalGlasses={
              data.water.totalGlasses
            }
          />
<DailyTip
            tip={data.tip}
          />
        </View>
      </ScrollView>

      <BottomNav
        onAddPress={() => {
          console.log(
            "Add Meal navigation will be connected in the Tracking step."
          );
        }}
      />
    </View>
  );
}

/*
=========================================================
DESKTOP HOME
=========================================================
*/

function DesktopHome({
  data,
}: {
  data: HomeData;
}) {
  return (
    <View
      style={styles.desktopRoot}
    >
      <Sidebar data={data} />

      <View
        style={styles.desktopMain}
      >
        <ScrollView
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.desktopContent
          }
        >
          {/* TOP HEADER */}

          <View
            style={
              styles.desktopHeader
            }
          >
            <View>
              <Text
                style={
                  styles.desktopGreetingTitle
                }
              >
                Good evening,{" "}
                {data.firstName} 👋
              </Text>

              <Text
                style={
                  styles.desktopGreetingSubtitle
                }
              >
                Ready to stay on track
                and crush your goals?
              </Text>
            </View>

            <View
              style={
                styles.desktopHeaderActions
              }
            >
              <Pressable
                style={
                  styles.notificationButton
                }
              >
                <Ionicons
                  name="notifications-outline"
                  size={27}
                  color="#FFFFFF"
                />

                <View
                  style={
                    styles.notificationDot
                  }
                />
              </Pressable>

              <Pressable
                style={
                  styles.desktopAvatar
                }
              >
                <Ionicons
                  name="person"
                  size={25}
                  color="#FFFFFF"
                />
              </Pressable>
            </View>
          </View>

          {/* TOP GRID */}

          <View
            style={
              styles.desktopTopGrid
            }
          >
            <View
              style={
                styles.desktopGoalColumn
              }
            >
              <GoalCard
                consumed={
                  data.calories.consumed
                }
                goal={
                  data.calories.goal
                }
              />
            </View>

            <View
              style={
                styles.desktopRightTop
              }
            >
              <View
                style={
                  styles.desktopMacroRow
                }
              >
                <MacroCard
                  icon="fitness-outline"
                  title="PROTEIN"
                  value={
                    data.macros.protein.current
                  }
                  target={
                    data.macros.protein.target
                  }
                  type="protein"
                />

                <MacroCard
                  icon="leaf-outline"
                  title="CARBS"
                  value={
                    data.macros.carbs.current
                  }
                  target={
                    data.macros.carbs.target
                  }
                  type="carbs"
                />

                <MacroCard
                  icon="water-outline"
                  title="FATS"
                  value={
                    data.macros.fats.current
                  }
                  target={
                    data.macros.fats.target
                  }
                  type="fats"
                />
              </View>
<Text
                style={
                  styles.desktopSectionTitle
                }
              >
                QUICK ACTIONS
              </Text>

              <View
                style={
                  styles.desktopQuickActions
                }
              >
                <QuickAction
                  icon="add"
                  title="Add Meal"
                  subtitle="Log your food"
                  onPress={() =>
                    router.push("/")
                  }
                />

                <QuickAction
                  icon="scan-outline"
                  title="Scan Food"
                  subtitle="Scan barcode or QR"
                  onPress={() =>
                    router.push("/")
                  }
                />
              </View>
            </View>
          </View>

          {/* LOWER GRID */}

          <View
            style={
              styles.desktopLowerGrid
            }
          >
            <MealCard />

            <View
              style={
                styles.desktopLowerRight
              }
            >
              <WaterCard
                consumed={
                  data.water.consumed
                }
                target={
                  data.water.target
                }
                glassesConsumed={
                  data.water.glassesConsumed
                }
                totalGlasses={
                  data.water.totalGlasses
                }
              />

              <DailyTip
                tip={data.tip}
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

function Sidebar({
  data,
}: {
  data: HomeData;
}) {
  return (
    <View
      style={styles.sidebar}
    >
      <View
        style={styles.sidebarLogo}
      >
        <Ionicons
          name="fitness"
          size={31}
          color="#FFC107"
        />

        <Text
          style={
            styles.sidebarLogoText
          }
        >
          Tena
          <Text
            style={
              styles.logoAccent
            }
          >
            Fit
          </Text>
        </Text>
      </View>

      <View
        style={
          styles.sidebarNavigation
        }
      >
        <SidebarItem
          icon="home"
          label="Home"
          active
          onPress={() =>
            router.push("/home")
          }
        />

        <SidebarItem
          icon="calendar-outline"
          label="Plan"
          onPress={() =>
            router.push(
              "/dashboard/plan"
            )
          }
        />

        <SidebarItem
          icon="bar-chart-outline"
          label="Progress"
          onPress={() =>
            router.push(
              "/dashboard/progress"
            )
          }
        />

        <SidebarItem
          icon="restaurant-outline"
          label="Meals"
          onPress={() =>
            router.push(
              "/dashboard/meals"
            )
          }
        />

        <SidebarItem
          icon="barbell-outline"
          label="Workouts"
          onPress={() =>
            router.push(
              "/dashboard/workouts"
            )
          }
        />

        <SidebarItem
          icon="water-outline"
          label="Water"
          onPress={() =>
            router.push(
              "/dashboard/water"
            )
          }
        />

        <SidebarItem
          icon="document-text-outline"
          label="Reports"
          onPress={() =>
            router.push(
              "/dashboard/reports"
            )
          }
        />

        <SidebarItem
          icon="settings-outline"
          label="Settings"
          onPress={() =>
            router.push(
              "/dashboard/settings"
            )
          }
        />
      </View>
<View
        style={styles.premiumCard}
      >
        <Ionicons
          name="diamond"
          size={25}
          color="#FFC107"
        />

        <Text
          style={
            styles.premiumTitle
          }
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
            style={
              styles.upgradeText
            }
          >
            Upgrade Now
          </Text>
        </Pressable>
      </View>

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
          style={
            styles.sidebarUserInfo
          }
        >
          <Text
            style={
              styles.sidebarUserName
            }
          >
            {data.fullName}
          </Text>

          <Text
            style={
              styles.sidebarLevel
            }
          >
            Level {data.level}
          </Text>

          <View
            style={styles.xpTrack}
          >
            <View
              style={[
                styles.xpFill,
                {
                  width: `${
                    Math.min(
                      data.xp /
                        data.xpGoal,
                      1
                    ) * 100
                  }%`,
                },
              ]}
            />
          </View>

          <Text
            style={styles.xpText}
          >
            {data.xp.toLocaleString()} /{" "}
            {data.xpGoal.toLocaleString()} XP
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
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.sidebarItem,
        active &&
          styles.sidebarItemActive,
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

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#05070B",
  },

  loadingText: {
    color: "#8B8F98",
    fontSize: 15,
    fontWeight: "600",
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