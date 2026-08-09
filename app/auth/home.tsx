import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import ScreenContainer from "../../components/common/ScreenContainer";

export default function HomeScreen() {
  return (
    <ScreenContainer scrollable={false} wide>
      <View style={styles.screen}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {/* =====================================================
              HEADER
          ===================================================== */}

          <View style={styles.header}>
            <View style={styles.logoRow}>
              <View style={styles.logoIcon}>
                <Ionicons
                  name="fitness"
                  size={28}
                  color="#FFC107"
                />
              </View>

              <Text style={styles.logoText}>
                Tena
                <Text style={styles.logoAccent}>Fit</Text>
              </Text>
            </View>

            <View style={styles.headerActions}>
              <Pressable style={styles.notificationButton}>
                <Ionicons
                  name="notifications-outline"
                  size={27}
                  color="#FFFFFF"
                />

                <View style={styles.notificationDot} />
              </Pressable>

              <Pressable style={styles.avatar}>
                <Ionicons
                  name="person"
                  size={27}
                  color="#FFFFFF"
                />
              </Pressable>
            </View>
          </View>

          {/* =====================================================
              GREETING
          ===================================================== */}

          <View style={styles.greeting}>
            <Text style={styles.greetingTitle}>
              Good evening, Faniel 👋
            </Text>

            <Text style={styles.greetingSubtitle}>
              Ready to stay on track and crush your goals?
            </Text>
          </View>

          {/* =====================================================
              TODAY'S GOAL
          ===================================================== */}

          <View style={styles.goalCard}>
            <View style={styles.goalContent}>
              <View style={styles.sectionHeading}>
                <Ionicons
                  name="radio-button-on-outline"
                  size={25}
                  color="#FFC107"
                />

                <Text style={styles.goalHeading}>
                  TODAY'S GOAL
                </Text>
              </View>

              <View style={styles.calorieRow}>
                <Text style={styles.calories}>
                  1,850
                </Text>

                <Text style={styles.kcal}>
                  kcal
                </Text>
              </View>

              <Text style={styles.goalLabel}>
                Daily Calorie Goal
              </Text>

              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: "67%" },
                  ]}
                />
              </View>

              <View style={styles.goalStats}>
                <Text style={styles.consumedText}>
                  <Text style={styles.yellowText}>
                    1,240 kcal
                  </Text>{" "}
                  consumed
                </Text>

                <Text style={styles.goalStatText}>
                  1,850 kcal goal
                </Text>
              </View>
            </View>

            <View style={styles.circularProgress}>
              <View style={styles.circularInner}>
                <Ionicons
                  name="flame"
                  size={30}
                  color="#FFC107"
                />
<Text style={styles.percentText}>
                  67%
                </Text>

                <Text style={styles.ofGoal}>
                  of goal
                </Text>
              </View>
            </View>
          </View>

          {/* =====================================================
              MACROS
          ===================================================== */}

          <View style={styles.macroRow}>
            <MacroCard
              icon="fitness-outline"
              title="PROTEIN"
              value="82"
              target="120 g"
              percentage="68%"
              progress="68%"
              type="protein"
            />

            <MacroCard
              icon="leaf-outline"
              title="CARBS"
              value="140"
              target="210 g"
              percentage="67%"
              progress="67%"
              type="carbs"
            />

            <MacroCard
              icon="water-outline"
              title="FATS"
              value="38"
              target="60 g"
              percentage="63%"
              progress="63%"
              type="fats"
            />
          </View>

          {/* =====================================================
              QUICK ACTIONS
          ===================================================== */}

          <Text style={styles.sectionTitle}>
            QUICK ACTIONS
          </Text>

          <View style={styles.quickActions}>
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

          {/* =====================================================
              LOWER CONTENT
          ===================================================== */}

          <View style={styles.lowerGrid}>
            {/* ================= MEALS ================= */}

            <View style={styles.mealsCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>
                  TODAY'S MEALS
                </Text>

                <Pressable>
                  <Text style={styles.viewAll}>
                    View all
                  </Text>
                </Pressable>
              </View>

              <MealRow
                icon="sunny-outline"
                title="Breakfast"
                description="Oatmeal, Banana, Protein Shake"
                calories="420"
                type="breakfast"
              />

              <MealRow
                icon="sunny-outline"
                title="Lunch"
                description="Chicken, Rice, Vegetables"
                calories="580"
                type="lunch"
              />

              <MealRow
                icon="moon-outline"
                title="Dinner"
                description="No meals added"
                calories="--"
                type="dinner"
              />

              <MealRow
                icon="nutrition-outline"
                title="Snacks"
                description="No snacks added"
                calories="--"
                type="snacks"
              />

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>
                  TOTAL CONSUMED
                </Text>

                <Text style={styles.totalValue}>
                  1,000{" "}
                  <Text style={styles.totalUnit}>
                    kcal
                  </Text>
                </Text>
              </View>
            </View>

            {/* ================= RIGHT COLUMN ================= */}

            <View style={styles.rightColumn}>
              {/* WATER */}
<View style={styles.waterCard}>
                <View style={styles.waterTitleRow}>
                  <Text style={styles.waterEmoji}>
                    💧
                  </Text>

                  <Text style={styles.cardTitle}>
                    WATER INTAKE
                  </Text>
                </View>

                <View style={styles.waterAmount}>
                  <Text style={styles.waterMain}>
                    1.6
                  </Text>

                  <Text style={styles.waterTarget}>
                    / 2.5 L
                  </Text>
                </View>

                <View style={styles.glasses}>
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <View
                      key={item}
                      style={[
                        styles.glass,
                        item <= 4 &&
                          styles.filledGlass,
                        item === 5 &&
                          styles.partialGlass,
                      ]}
                    >
                      {item <= 4 && (
                        <View
                          style={styles.waterInside}
                        />
                      )}

                      {item === 5 && (
                        <View
                          style={[
                            styles.waterInside,
                            styles.partialWater,
                          ]}
                        />
                      )}
                    </View>
                  ))}
                </View>

                <Text style={styles.waterMessage}>
                  Keep it up! 💧
                </Text>
              </View>

              {/* DAILY TIP */}

              <View style={styles.tipCard}>
                <View style={styles.tipTitleRow}>
                  <Ionicons
                    name="bulb-outline"
                    size={23}
                    color="#FFC107"
                  />

                  <Text style={styles.tipTitle}>
                    DAILY TIP
                  </Text>
                </View>

                <Text style={styles.tipText}>
                  Stay consistent, even on your
                  off days. Your future self will
                  thank you.
                </Text>

                <Text style={styles.quote}>
                  “
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* =====================================================
            BOTTOM NAVIGATION
        ===================================================== */}

        <View style={styles.bottomNav}>
          <NavItem
            icon="home"
            label="Home"
            active
          />

          <NavItem
            icon="calendar-outline"
            label="Plan"
          />

          <Pressable
            style={styles.addButton}
            onPress={() => router.push("/")}
          >
            <Ionicons
              name="add"
              size={38}
              color="#111111"
            />
          </Pressable>

          <NavItem
            icon="bar-chart-outline"
            label="Progress"
          />

          <NavItem
            icon="person-circle-outline"
            label="Profile"
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

/* ============================================================
   MACRO CARD
============================================================ */

type MacroType =
  | "protein"
  | "carbs"
  | "fats";

function MacroCard({
  icon,
  title,
  value,
  target,
  percentage,
  progress,
  type,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: string;
  target: string;
  percentage: string;
  progress: `${number}%`;
  type: MacroType;
}) {
  return (
    <View style={styles.macroCard}>
      <View style={styles.macroTop}>
        <View
          style={[
            styles.macroIcon,
            type === "protein" &&
              styles.proteinIcon,
            type === "carbs" &&
              styles.carbsIcon,
            type === "fats" &&
              styles.fatsIcon,
          ]}
        >
          <Ionicons
            name={icon}
            size={23}
            color={
              type === "protein"
                ? "#FFC107"
                : type === "carbs"
                ? "#82D94E"
                : "#C060FF"
            }
          />
        </View>

        <Text
          style={[
            styles.macroTitle,
            type === "protein" &&
              styles.proteinText,
            type === "carbs" &&
              styles.carbsText,
            type === "fats" &&
              styles.fatsText,
          ]}
        >
          {title}
        </Text>
      </View>

      <Text style={styles.macroValue}>
        {value}
        <Text style={styles.macroTarget}>
          {" "}
          / {target}
        </Text>
      </Text>

      <View style={styles.macroTrack}>
        <View
          style={[
            styles.macroFill,
            { width: progress },
            type === "protein" &&
              styles.proteinFill,
            type === "carbs" &&
              styles.carbsFill,
            type === "fats" &&
              styles.fatsFill,
          ]}
        />
      </View>

      <Text
        style={[
          styles.macroPercentage,
          type === "protein" &&
            styles.proteinText,
          type === "carbs" &&
            styles.carbsText,
          type === "fats" &&
            styles.fatsText,
        ]}
      >
        {percentage}
      </Text>
    </View>
  );
}

/* ============================================================
   QUICK ACTION
============================================================ */

function QuickAction({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={styles.quickAction}
      onPress={onPress}
    >
      <View style={styles.quickIcon}>
        <Ionicons
          name={icon}
          size={30}
          color="#FFC107"
        />
      </View>

      <View style={styles.quickText}>
        <Text style={styles.quickTitle}>
          {title}
        </Text>

        <Text style={styles.quickSubtitle}>
          {subtitle}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={26}
        color="#FFC107"
      />
    </Pressable>
  );
}

/* ============================================================
   MEAL ROW
============================================================ */

function MealRow({
  icon,
  title,
  description,
  calories,
  type,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  calories: string;
  type: string;
}) {
  return (
    <Pressable style={styles.mealRow}>
      <View
        style={[
          styles.mealIcon,
          type === "breakfast" &&
            styles.breakfastIcon,
          type === "lunch" &&
            styles.lunchIcon,
          type === "dinner" &&
            styles.dinnerIcon,
          type === "snacks" &&
            styles.snacksIcon,
        ]}
      >
        <Ionicons
          name={icon}
          size={22}
          color="#FFC107"
        />
      </View>

      <View style={styles.mealInfo}>
        <Text style={styles.mealTitle}>
          {title}
        </Text>

        <Text
          style={styles.mealDescription}
          numberOfLines={1}
        >
          {description}
        </Text>
      </View>

      <View style={styles.mealCalories}>
        <Text style={styles.calorieNumber}>
          {calories}
        </Text>

        <Text style={styles.calorieUnit}>
          kcal
        </Text>
      </View>
<Ionicons
        name="chevron-forward"
        size={22}
        color="#FFC107"
      />
    </Pressable>
  );
}

/* ============================================================
   NAV ITEM
============================================================ */

function NavItem({
  icon,
  label,
  active = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active?: boolean;
}) {
  return (
    <Pressable style={styles.navItem}>
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
          active &&
            styles.activeNavLabel,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

/* ============================================================
   STYLES
============================================================ */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#05070B",
  },

  content: {
    width: "100%",
    maxWidth: 1450,
    alignSelf: "center",

    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 125,
  },

  /* ==========================================================
     HEADER
  ========================================================== */

  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },

  logoRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  logoIcon: {
    marginRight: 10,
  },

  logoText: {
    fontSize: 30,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -1,
  },

  logoAccent: {
    color: "#FFC107",
  },

  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },

  notificationButton: {
    position: "relative",
    padding: 5,
    marginRight: 18,
  },

  notificationDot: {
    position: "absolute",
    right: 5,
    top: 3,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFC107",
  },

  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "#FFC107",
    backgroundColor: "#22252A",
    justifyContent: "center",
    alignItems: "center",
  },

  /* ==========================================================
     GREETING
  ========================================================== */

  greeting: {
    marginBottom: 34,
  },

  greetingTitle: {
    fontSize: 38,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -1,
  },

  greetingSubtitle: {
    color: "#B6BAC3",
    fontSize: 20,
    marginTop: 7,
  },

  /* ==========================================================
     TODAY'S GOAL
  ========================================================== */

  goalCard: {
    width: "100%",
    minHeight: 300,

    borderRadius: 26,
    borderWidth: 1,
    borderColor: "#2D3340",
    backgroundColor: "#0D1119",

    padding: 32,

    flexDirection: "row",
    flexWrap: "wrap",

    justifyContent: "space-between",
    alignItems: "center",

    overflow: "hidden",
    marginBottom: 28,
  },

  goalContent: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "55%",

    minWidth: 280,
  },

  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },

  goalHeading: {
    color: "#FFC107",
    fontSize: 21,
    fontWeight: "900",
    marginLeft: 12,
  },

  calorieRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },

  calories: {
    color: "#FFFFFF",
    fontSize: 72,
    fontWeight: "900",
    letterSpacing: -3,
  },

  kcal: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "800",
    marginLeft: 10,
  },

  goalLabel: {
    color: "#A9AFBA",
    fontSize: 19,
    marginTop: 3,
    marginBottom: 20,
  },

  progressTrack: {
    width: "82%",
    height: 16,
    borderRadius: 10,
    backgroundColor: "#202632",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#FFC107",
    borderRadius: 10,
  },
goalStats: {
    width: "82%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 17,
  },

  consumedText: {
    color: "#A9AFBA",
    fontSize: 15,
  },

  yellowText: {
    color: "#FFC107",
    fontWeight: "900",
  },

  goalStatText: {
    color: "#A9AFBA",
    fontSize: 15,
  },

  circularProgress: {
    width: 210,
    height: 210,
    borderRadius: 105,

    borderWidth: 18,
    borderColor: "#FFC107",
    borderLeftColor: "#252C38",
    borderBottomColor: "#252C38",

    justifyContent: "center",
    alignItems: "center",

    marginLeft: 35,
    marginTop: 10,
  },

  circularInner: {
    alignItems: "center",
  },

  percentText: {
    color: "#FFFFFF",
    fontSize: 43,
    fontWeight: "900",
    marginTop: 4,
  },

  ofGoal: {
    color: "#B5BAC3",
    fontSize: 16,
    marginTop: -3,
  },

  /* ==========================================================
     MACROS

     IMPORTANT:
     The cards have a minimum width.
     On desktop they stay beside each other.
     On narrow screens they automatically wrap.
  ========================================================== */

  macroRow: {
    width: "100%",

    flexDirection: "row",
    flexWrap: "wrap",

    alignItems: "stretch",

    marginBottom: 34,
  },

  macroCard: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "30%",

    minWidth: 260,
    minHeight: 215,

    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#2A303C",
    backgroundColor: "#0D1119",

    padding: 22,

    marginRight: 16,
    marginBottom: 16,
  },

  macroTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  macroIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,

    justifyContent: "center",
    alignItems: "center",

    marginRight: 13,
  },

  proteinIcon: {
    backgroundColor: "#30270B",
    borderWidth: 1,
    borderColor: "#8E7200",
  },

  carbsIcon: {
    backgroundColor: "#102316",
    borderWidth: 1,
    borderColor: "#276B35",
  },

  fatsIcon: {
    backgroundColor: "#24122F",
    borderWidth: 1,
    borderColor: "#7A38A5",
  },

  macroTitle: {
    fontSize: 19,
    fontWeight: "900",
  },

  proteinText: {
    color: "#FFC107",
  },

  carbsText: {
    color: "#82D94E",
  },

  fatsText: {
    color: "#C060FF",
  },

  macroValue: {
    color: "#FFFFFF",
    fontSize: 31,
    fontWeight: "900",
    marginTop: 15,
  },

  macroTarget: {
    color: "#B4BAC4",
    fontSize: 17,
    fontWeight: "500",
  },

  macroTrack: {
    height: 13,
    borderRadius: 8,
    backgroundColor: "#202632",
    overflow: "hidden",
    marginTop: 19,
  },

  macroFill: {
    height: "100%",
    borderRadius: 8,
  },

  proteinFill: {
    backgroundColor: "#FFC107",
  },

  carbsFill: {
    backgroundColor: "#82D94E",
  },

  fatsFill: {
    backgroundColor: "#C060FF",
  },

  macroPercentage: {
    fontSize: 18,
    fontWeight: "900",
    marginTop: 16,
  },

  /* ==========================================================
     QUICK ACTIONS

     minWidth makes them automatically become vertical
     when the available screen becomes too narrow.
  ========================================================== */

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 14,
  },

  quickActions: {
    width: "100%",

    flexDirection: "row",
    flexWrap: "wrap",

    marginBottom: 28,
  },

  quickAction: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "45%",

    minWidth: 320,
    minHeight: 125,

    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#4D4430",
    backgroundColor: "#15140F",

    paddingHorizontal: 22,

    flexDirection: "row",
    alignItems: "center",

    marginRight: 18,
    marginBottom: 18,
  },

  quickIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,

    borderWidth: 2,
    borderColor: "#FFC107",

    justifyContent: "center",
    alignItems: "center",

    flexShrink: 0,
  },

  quickText: {
    flex: 1,
    marginLeft: 18,
  },

  quickTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
  },
quickSubtitle: {
    color: "#9CA3AF",
    fontSize: 15,
    marginTop: 5,
  },

  /* ==========================================================
     LOWER SECTION

     Desktop:
       Meals | Water
              | Tip

     Narrow screen:
       Meals
       Water
       Tip
  ========================================================== */

  lowerGrid: {
    width: "100%",

    flexDirection: "row",
    flexWrap: "wrap",

    alignItems: "flex-start",
  },

  mealsCard: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "58%",

    minWidth: 330,

    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#2A303C",
    backgroundColor: "#0D1119",

    padding: 22,

    marginRight: 18,
    marginBottom: 18,
  },

  rightColumn: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "36%",

    minWidth: 320,

    marginBottom: 18,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  cardTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
  },

  viewAll: {
    color: "#FFC107",
    fontSize: 15,
    fontWeight: "800",
  },

  /* ==========================================================
     MEALS
  ========================================================== */

  mealRow: {
    minHeight: 85,

    flexDirection: "row",
    alignItems: "center",

    borderBottomWidth: 1,
    borderBottomColor: "#222833",
  },

  mealIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,

    justifyContent: "center",
    alignItems: "center",

    marginRight: 14,
  },

  breakfastIcon: {
    backgroundColor: "#30270B",
  },

  lunchIcon: {
    backgroundColor: "#132516",
  },

  dinnerIcon: {
    backgroundColor: "#101E38",
  },

  snacksIcon: {
    backgroundColor: "#32151A",
  },

  mealInfo: {
    flex: 1,
    minWidth: 0,
  },

  mealTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
  },

  mealDescription: {
    color: "#9CA3AF",
    fontSize: 13,
    marginTop: 4,
  },

  mealCalories: {
    alignItems: "flex-end",
    marginRight: 14,
  },

  calorieNumber: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },

  calorieUnit: {
    color: "#9CA3AF",
    fontSize: 12,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 20,
  },

  totalLabel: {
    color: "#9CA3AF",
    fontSize: 16,
    fontWeight: "700",
  },

  totalValue: {
    color: "#FFC107",
    fontSize: 24,
    fontWeight: "900",
  },

  totalUnit: {
    fontSize: 14,
  },

  /* ==========================================================
     WATER
  ========================================================== */

  waterCard: {
    width: "100%",

    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#2A303C",
    backgroundColor: "#0D1119",

    padding: 22,
    minHeight: 275,

    marginBottom: 18,
  },

  waterTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  waterEmoji: {
    fontSize: 24,
    marginRight: 10,
  },

  waterAmount: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 20,
  },

  waterMain: {
    color: "#FFFFFF",
    fontSize: 40,
    fontWeight: "900",
  },

  waterTarget: {
    color: "#A9AFBA",
    fontSize: 18,
    marginLeft: 7,
  },

  glasses: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 20,
  },

  glass: {
    width: 30,
    height: 38,

    borderWidth: 2,
    borderColor: "#566070",
    borderRadius: 4,

    overflow: "hidden",

    justifyContent: "flex-end",

    marginRight: 10,
    marginBottom: 8,
  },

  filledGlass: {
    borderColor: "#DCEBFF",
  },

  partialGlass: {
    borderColor: "#566070",
  },

  waterInside: {
    width: "100%",
    height: "80%",
    backgroundColor: "#1597E8",
  },

  partialWater: {
    height: "40%",
  },

  waterMessage: {
    color: "#A9AFBA",
    fontSize: 15,
    marginTop: 16,
  },
/* ==========================================================
     DAILY TIP
  ========================================================== */

  tipCard: {
    width: "100%",

    minHeight: 210,

    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#4D4430",
    backgroundColor: "#12130F",

    padding: 22,

    overflow: "hidden",
  },

  tipTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  tipTitle: {
    color: "#FFC107",
    fontSize: 18,
    fontWeight: "900",
    marginLeft: 10,
  },

  tipText: {
    color: "#FFFFFF",
    fontSize: 17,
    lineHeight: 27,
    marginTop: 28,
    maxWidth: 320,
  },

  quote: {
    position: "absolute",
    right: 20,
    bottom: -18,

    color: "#423B21",
    fontSize: 120,
    fontWeight: "900",
  },

  /* ==========================================================
     BOTTOM NAV
  ========================================================== */

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

    paddingVertical: 8,
  },

  navLabel: {
    color: "#9CA3AF",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 5,
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