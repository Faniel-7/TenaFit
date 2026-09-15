import React from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import BottomNav from "../../components/dashboard/BottomNav";
import { useAuth } from "../../context/AuthContext";
import { useAppData } from "../../context/AppDataContext";
import { useTheme } from "../../context/ThemeContext";

export default function HomeScreen() {
  const { user } = useAuth();
  const {
    data,
    goals,
    meals,
    calorieProgress,
    proteinProgress,
    carbsProgress,
    fatProgress,
    waterProgress,
    stepsProgress,
    overallProgress,
  } = useAppData();
  const { colors } = useTheme();

  const fullName = user?.fullName?.trim() || "TenaFit User";
  const firstName = fullName.split(" ")[0] || "there";

  const caloriesRemaining = Math.max(
    goals.calories - data.calories,
    0
  );

  const mealCount = meals.length;

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) {
      return "Good morning";
    }

    if (hour < 18) {
      return "Good afternoon";
    }

    return "Good evening";
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: colors.background },
      ]}
    >
      <View style={styles.root}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <View style={styles.header}>
            <View style={styles.brandRow}>
              <View
                style={[
                  styles.logo,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Ionicons
                  name="fitness"
                  size={22}
                  color="#111111"
                />
              </View>

              <Text
                style={[
                  styles.brandText,
                  { color: colors.text },
                ]}
              >
                Tena
                <Text style={{ color: colors.primary }}>
                  Fit
                </Text>
              </Text>
            </View>

            <View style={styles.headerActions}>
              <Pressable
                style={[
                  styles.iconButton,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() =>
                  router.push("/dashboard/settings")
                }
              >
                <Ionicons
                  name="settings-outline"
                  size={21}
                  color={colors.text}
                />
              </Pressable>

              <Pressable
                style={[
                  styles.avatar,
                  { backgroundColor: colors.primary },
                ]}
                onPress={() =>
                  router.push("/dashboard/profile")
                }
              >
                <Text style={styles.avatarText}>
                  {firstName.charAt(0).toUpperCase()}
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.greeting}>
            <Text
              style={[
                styles.greetingTitle,
                { color: colors.text },
              ]}
            >
              {getGreeting()}, {firstName} 👋
            </Text>

            <Text
              style={[
                styles.greetingSubtitle,
                { color: colors.subtext },
              ]}
            >
              Stay consistent and keep moving toward your goals.
            </Text>
          </View>

          <View
            style={[
              styles.hero,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.heroTop}>
              <View style={styles.heroText}>
                <Text
                  style={[
                    styles.heroLabel,
                    { color: colors.primary },
                  ]}
                >
                  TODAY'S GOAL
                </Text>

                <Text
                  style={[
                    styles.heroTitle,
                    { color: colors.text },
                  ]}
                >
                  Keep your nutrition
                  {"\n"}on track
                </Text>

                <Text
                  style={[
                    styles.heroDescription,
                    { color: colors.subtext },
                  ]}
                >
                  {caloriesRemaining > 0
                    ? `${Math.round(
                        caloriesRemaining
                      )} calories remaining today`
                    : "You've reached your calorie target"}
                </Text>
              </View>

              <View
                style={[
                  styles.heroCircle,
                  { borderColor: colors.primary },
                ]}
              >
                <Text
                  style={[
                    styles.heroPercentage,
                    { color: colors.text },
                  ]}
                >
                  {overallProgress}%
                </Text>

                <Text
                  style={[
                    styles.heroComplete,
                    { color: colors.subtext },
                  ]}
                >
                  done
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.heroProgressTrack,
                { backgroundColor: colors.border },
              ]}
            >
              <View
                style={[
                  styles.heroProgressFill,
                  {
                    width: `${overallProgress}%`,
                    backgroundColor: colors.primary,
                  },
                ]}
              />
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text
              style={[
                styles.sectionTitle,
                { color: colors.text },
              ]}
            >
              Today's nutrition
            </Text>

            <Pressable
              onPress={() =>
                router.push("/dashboard/progress")
              }
            >
              <Text
                style={[
                  styles.viewAll,
                  { color: colors.primary },
                ]}
              >
                View progress
              </Text>
            </Pressable>
          </View>

          <View style={styles.statsGrid}>
            <StatCard
              icon="flame-outline"
              title="Calories"
              value={Math.round(data.calories).toString()}
              target={Math.round(goals.calories).toString()}
              unit="kcal"
              progress={calorieProgress}
              colors={colors}
            />

            <StatCard
              icon="fitness-outline"
              title="Protein"
              value={Math.round(data.protein).toString()}
              target={Math.round(goals.protein).toString()}
              unit="g"
              progress={proteinProgress}
              colors={colors}
            />

            <StatCard
              icon="leaf-outline"
              title="Carbs"
              value={Math.round(data.carbs).toString()}
              target={Math.round(goals.carbs).toString()}
              unit="g"
              progress={carbsProgress}
              colors={colors}
            />

            <StatCard
              icon="water-outline"
              title="Fat"
              value={Math.round(data.fat).toString()}
              target={Math.round(goals.fat).toString()}
              unit="g"
              progress={fatProgress}
              colors={colors}
            />
          </View>

          <View style={styles.sectionHeader}>
            <Text
              style={[
                styles.sectionTitle,
                { color: colors.text },
              ]}
            >
              Quick actions
            </Text>
          </View>

          <View style={styles.actionRow}>
            <ActionCard
              icon="restaurant-outline"
              title="Add meal"
              subtitle="Track your food"
              colors={colors}
              onPress={() =>
                router.push("/dashboard/meals")
              }
            />

            <ActionCard
              icon="scan-outline"
              title="Scan food"
              subtitle="Coming soon"
              colors={colors}
              onPress={() =>
                router.push("/dashboard/meals")
              }
            />
          </View>

          <View style={styles.sectionHeader}>
            <Text
              style={[
                styles.sectionTitle,
                { color: colors.text },
              ]}
            >
              Daily activity
            </Text>
          </View>

          <View style={styles.activityRow}>
            <ActivityCard
              icon="water-outline"
              title="Water"
              value={`${data.water.toFixed(1)} L`}
              target={`${goals.water.toFixed(1)} L`}
              progress={waterProgress}
              colors={colors}
              onPress={() =>
                router.push("/dashboard/water")
              }
            />

            <ActivityCard
              icon="walk-outline"
              title="Steps"
              value={data.steps.toLocaleString()}
              target={goals.steps.toLocaleString()}
              progress={stepsProgress}
              colors={colors}
              onPress={() =>
                router.push("/dashboard/workouts")
              }
            />
          </View>

          <View
            style={[
              styles.mealCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.mealIcon,
                { backgroundColor: `${colors.primary}18` },
              ]}
            >
              <Ionicons
                name="restaurant-outline"
                size={22}
                color={colors.primary}
              />
            </View>

            <View style={styles.mealInfo}>
              <Text
                style={[
                  styles.mealTitle,
                  { color: colors.text },
                ]}
              >
                {mealCount === 0
                  ? "No meals logged"
                  : `${mealCount} meals logged today`}
              </Text>

              <Text
                style={[
                  styles.mealSubtitle,
                  { color: colors.subtext },
                ]}
              >
                {mealCount === 0
                  ? "Start tracking your food to see your daily nutrition."
                  : `${Math.round(
                      data.calories
                    )} calories recorded today`}
              </Text>
            </View>

            <Pressable
              style={[
                styles.arrowButton,
                { backgroundColor: `${colors.primary}18` },
              ]}
              onPress={() => router.push("/dashboard/meals")}
            >
              <Ionicons
                name="chevron-forward"
                size={18}
                color={colors.primary}
              />
            </Pressable>
          </View>

          <View
            style={[
              {
                width: `${Math.min(overallProgress, 100)}%`,
                backgroundColor: colors.primary,
              },
            ]}
          >
            <View style={styles.tipIcon}>
              <Ionicons
                name="bulb-outline"
                size={23}
                color="#111111"
              />
            </View>

            <View style={styles.tipContent}>
              <Text
                style={[
                  styles.tipLabel,
                  { backgroundColor: `${colors.primary}18` },
                ]}
              >
                DAILY TIP
              </Text>

              <Text style={styles.tipText}>
                Stay consistent, even on your off days. Small habits build lasting results.
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function StatCard({
  icon,
  title,
  value,
  target,
  unit,
  progress,
  colors,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: string;
  target: string;
  unit: string;
  progress: number;
  colors: any;
}) {
  return (
    <View
      style={[
        styles.statCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.statHeader}>
        <View
          style={[
            styles.statIcon,
            { backgroundColor: `${colors.primary}18` },
          ]}
        >
          <Ionicons
            name={icon}
            size={18}
            color={colors.primary}
          />
        </View>

        <Text
          style={[
            styles.statTitle,
            { color: colors.subtext },
          ]}
        >
          {title}
        </Text>
      </View>

      <Text
        style={[
          styles.statValue,
          { color: colors.text },
        ]}
      >
        {value}
        <Text
          style={[
            styles.statUnit,
            { color: colors.subtext },
          ]}
        >
          {" "}
          {unit}
        </Text>
      </Text>

      <Text
        style={[
          styles.statTarget,
          { color: colors.subtext },
        ]}
      >
        of {target} {unit}
      </Text>

      <View
        style={[
          styles.statTrack,
          { backgroundColor: colors.border },
        ]}
      >
        <View
          style={[
            styles.statFill,
            {
              width: `${Math.min(progress * 100, 100)}%`,
              backgroundColor: colors.primary,
            },
          ]}
        />
      </View>
    </View>
  );
}

function ActionCard({
  icon,
  title,
  subtitle,
  colors,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  colors: any;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[
        styles.actionCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
      onPress={onPress}
    >
      <View
        style={[
          styles.actionIcon,
          { backgroundColor: colors.primary },
        ]}
      >
        <Ionicons
          name={icon}
          size={22}
          color="#111111"
        />
      </View>

      <Text
        style={[
          styles.actionTitle,
          { color: colors.text },
        ]}
      >
        {title}
      </Text>

      <Text
        style={[
          styles.actionSubtitle,
          { color: colors.subtext },
        ]}
      >
        {subtitle}
      </Text>
    </Pressable>
  );
}
function ActivityCard({
  icon,
  title,
  value,
  target,
  progress,
  colors,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: string;
  target: string;
  progress: number;
  colors: any;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[
        styles.activityCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
      onPress={onPress}
    >
      <View
        style={[
          styles.activityIcon,
          { backgroundColor: `${colors.primary}18` },
        ]}
      >
        <Ionicons
          name={icon}
          size={20}
          color={colors.primary}
        />
      </View>

      <Text
        style={[
          styles.activityTitle,
          { color: colors.subtext },
        ]}
      >
        {title}
      </Text>

      <Text
        style={[
          styles.activityValue,
          { color: colors.text },
        ]}
      >
        {value}
      </Text>

      <Text
        style={[
          styles.activityTarget,
          { color: colors.subtext },
        ]}
      >
        of {target}
      </Text>

      <View
        style={[
          styles.activityTrack,
          { backgroundColor: colors.border },
        ]}
      >
        <View
          style={[
            styles.activityFill,
            {
              width: `${Math.min(progress * 100, 100)}%`,
              backgroundColor: colors.primary,
            },
          ]}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  root: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 110,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 25,
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  logo: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  brandText: {
    fontSize: 21,
    fontWeight: "900",
    marginLeft: 10,
  },

  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },

  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 13,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: "#111111",
    fontSize: 16,
    fontWeight: "900",
  },

  greeting: {
    marginBottom: 20,
  },

  greetingTitle: {
    fontSize: 25,
    fontWeight: "900",
  },

  greetingSubtitle: {
    fontSize: 12,
    marginTop: 6,
    lineHeight: 18,
  },

  hero: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    marginBottom: 27,
  },

  heroTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  heroText: {
    flex: 1,
  },

  heroLabel: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.2,
  },

  heroTitle: {
    fontSize: 22,
    lineHeight: 27,
    fontWeight: "900",
    marginTop: 8,
  },

  heroDescription: {
    fontSize: 11,
    lineHeight: 16,
    marginTop: 9,
  },

  heroCircle: {
    width: 91,
    height: 91,
    borderRadius: 46,
    borderWidth: 6,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },

  heroPercentage: {
    fontSize: 20,
    fontWeight: "900",
  },

  heroComplete: {
    fontSize: 9,
    fontWeight: "700",
    marginTop: 2,
    textTransform: "uppercase",
  },

  heroProgressTrack: {
    height: 8,
    borderRadius: 8,
    overflow: "hidden",
    marginTop: 20,
  },

  heroProgressFill: {
    height: "100%",
    borderRadius: 8,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "900",
  },

  viewAll: {
    fontSize: 10,
    fontWeight: "800",
  },
statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 27,
  },

  statCard: {
    width: "48.5%",
    minHeight: 137,
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
  },

  statHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  statIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },

  statTitle: {
    fontSize: 10,
    fontWeight: "800",
    marginLeft: 8,
  },

  statValue: {
    fontSize: 20,
    fontWeight: "900",
    marginTop: 13,
  },

  statUnit: {
    fontSize: 9,
    fontWeight: "700",
  },

  statTarget: {
    fontSize: 9,
    marginTop: 2,
  },

  statTrack: {
    height: 6,
    borderRadius: 6,
    overflow: "hidden",
    marginTop: 12,
  },

  statFill: {
    height: "100%",
    borderRadius: 6,
  },

  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 27,
  },

  actionCard: {
    flex: 1,
    minHeight: 132,
    borderRadius: 18,
    borderWidth: 1,
    padding: 15,
  },

  actionIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  actionTitle: {
    fontSize: 13,
    fontWeight: "900",
    marginTop: 12,
  },

  actionSubtitle: {
    fontSize: 9,
    marginTop: 4,
  },

  activityRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },

  activityCard: {
    flex: 1,
    minHeight: 160,
    borderRadius: 18,
    borderWidth: 1,
    padding: 15,
  },

  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  activityTitle: {
    fontSize: 10,
    fontWeight: "800",
    marginTop: 11,
  },

  activityValue: {
    fontSize: 19,
    fontWeight: "900",
    marginTop: 5,
  },

  activityTarget: {
    fontSize: 9,
    marginTop: 2,
  },

  activityTrack: {
    height: 6,
    borderRadius: 6,
    overflow: "hidden",
    marginTop: 14,
  },

  activityFill: {
    height: "100%",
    borderRadius: 6,
  },

  mealCard: {
    minHeight: 82,
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  mealIcon: {
    width: 47,
    height: 47,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  mealInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },

  mealTitle: {
    fontSize: 13,
    fontWeight: "900",
  },

  mealSubtitle: {
    fontSize: 9,
    lineHeight: 14,
    marginTop: 4,
  },

  arrowButton: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },

  tipCard: {
    borderRadius: 20,
    padding: 17,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  tipIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: "rgba(17,17,17,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },

  tipContent: {
    flex: 1,
    marginLeft: 13,
  },

  tipLabel: {
    color: "#111111",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,
  },

  tipText: {
    color: "#111111",
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "700",
    marginTop: 5,
  },
});