import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DashboardPage from "../../components/dashboard/DashboardPage";
import { useAppData } from "../../context/AppDataContext";
import { useTheme } from "../../context/ThemeContext";

export default function ProgressScreen() {
  const {
    data,
    goals,
    calorieProgress,
    proteinProgress,
    carbsProgress,
    fatProgress,
    waterProgress,
    stepsProgress,
    overallProgress,
  } = useAppData();

  const { colors } = useTheme();

  const metrics = [
    {
      icon: "flame-outline" as keyof typeof Ionicons.glyphMap,
      title: "Calories",
      current: Math.round(data.calories),
      goal: Math.round(goals.calories),
      unit: "kcal",
      progress: calorieProgress,
    },
    {
      icon: "fitness-outline" as keyof typeof Ionicons.glyphMap,
      title: "Protein",
      current: Math.round(data.protein),
      goal: Math.round(goals.protein),
      unit: "g",
      progress: proteinProgress,
    },
    {
      icon: "nutrition-outline" as keyof typeof Ionicons.glyphMap,
      title: "Carbs",
      current: Math.round(data.carbs),
      goal: Math.round(goals.carbs),
      unit: "g",
      progress: carbsProgress,
    },
    {
      icon: "restaurant-outline" as keyof typeof Ionicons.glyphMap,
      title: "Fat",
      current: Math.round(data.fat),
      goal: Math.round(goals.fat),
      unit: "g",
      progress: fatProgress,
    },
    {
      icon: "water-outline" as keyof typeof Ionicons.glyphMap,
      title: "Water",
      current: data.water.toFixed(2),
      goal: goals.water.toFixed(2),
      unit: "L",
      progress: waterProgress,
    },
    {
      icon: "walk-outline" as keyof typeof Ionicons.glyphMap,
      title: "Steps",
      current: Math.round(data.steps),
      goal: Math.round(goals.steps),
      unit: "steps",
      progress: stepsProgress,
    },
  ];

  const completedMetrics = metrics.filter(
    (metric) => metric.progress >= 1
  ).length;

  return (
    <DashboardPage
      title="Progress"
      subtitle="Track your daily performance and stay consistent."
      icon="trending-up-outline"
    >
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
                styles.eyebrow,
                { color: colors.primary },
              ]}
            >
              TODAY'S PERFORMANCE
            </Text>

            <Text
              style={[
                styles.heroTitle,
                { color: colors.text },
              ]}
            >
              {overallProgress}%
            </Text>

            <Text
              style={[
                styles.heroSubtitle,
                { color: colors.subtext },
              ]}
            >
              of your daily targets completed
            </Text>
          </View>

          <View
            style={[
              styles.heroCircle,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons
              name={
                overallProgress >= 80
                  ? "trophy-outline"
                  : "trending-up-outline"
              }
              size={30}
              color={colors.primary}
            />
          </View>
        </View>

        <View
          style={[
            styles.heroTrack,
            { backgroundColor: colors.border },
          ]}
>
          <View
            style={[
              styles.heroFill,
              {
                width: `${Math.min(
                  overallProgress,
                  100
                )}%`,
                backgroundColor: colors.primary,
              },
            ]}
          />
        </View>

        <View style={styles.heroFooter}>
          <View>
            <Text
              style={[
                styles.heroFooterValue,
                { color: colors.text },
              ]}
            >
              {completedMetrics}
            </Text>

            <Text
              style={[
                styles.heroFooterLabel,
                { color: colors.subtext },
              ]}
            >
              targets completed
            </Text>
          </View>

          <View style={styles.heroFooterRight}>
            <Text
              style={[
                styles.heroFooterValue,
                { color: colors.text },
              ]}
            >
              {6 - completedMetrics}
            </Text>

            <Text
              style={[
                styles.heroFooterLabel,
                { color: colors.subtext },
              ]}
            >
              still in progress
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <View style={styles.sectionText}>
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.text },
            ]}
          >
            Daily targets
          </Text>

          <Text
            style={[
              styles.sectionSubtitle,
              { color: colors.subtext },
            ]}
          >
            See exactly where you stand today.
          </Text>
        </View>

        <View
          style={[
            styles.targetBadge,
            { backgroundColor: colors.card },
          ]}
        >
          <Ionicons
            name="analytics-outline"
            size={15}
            color={colors.primary}
          />

          <Text
            style={[
              styles.targetBadgeText,
              { color: colors.subtext },
            ]}
          >
            6 targets
          </Text>
        </View>
      </View>

      <View style={styles.grid}>
        {metrics.map((metric) => (
          <MetricCard
            key={metric.title}
            icon={metric.icon}
            title={metric.title}
            current={String(metric.current)}
            goal={String(metric.goal)}
            unit={metric.unit}
            progress={metric.progress}
            colors={colors}
          />
        ))}
      </View>

      <View style={styles.sectionHeader}>
        <View style={styles.sectionText}>
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.text },
            ]}
          >
            Today's overview
          </Text>

          <Text
            style={[
              styles.sectionSubtitle,
              { color: colors.subtext },
            ]}
          >
            A quick look at your current numbers.
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.overviewCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <OverviewRow
          icon="flame-outline"
          title="Calories"
          current={`${Math.round(data.calories)} kcal`}
          target={`${Math.round(goals.calories)} kcal`}
          progress={calorieProgress}
          colors={colors}
        />

        <OverviewRow
          icon="fitness-outline"
          title="Protein"
          current={`${Math.round(data.protein)} g`}
          target={`${Math.round(goals.protein)} g`}
          progress={proteinProgress}
          colors={colors}
        />
        <OverviewRow
          icon="water-outline"
          title="Water"
          current={`${data.water.toFixed(2)} L`}
          target={`${goals.water.toFixed(2)} L`}
          progress={waterProgress}
          colors={colors}
        />

        <OverviewRow
          icon="walk-outline"
          title="Steps"
          current={`${Math.round(data.steps)}`}
          target={`${Math.round(goals.steps)}`}
          progress={stepsProgress}
          colors={colors}
          last
        />
      </View>

      <View
        style={[
          styles.insightCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <View
          style={[
            styles.insightIcon,
            { backgroundColor: colors.background },
          ]}
        >
          <Ionicons
            name={
              overallProgress >= 75
                ? "sparkles-outline"
                : "bulb-outline"
            }
            size={22}
            color={colors.primary}
          />
        </View>

        <View style={styles.insightContent}>
          <Text
            style={[
              styles.insightLabel,
              { color: colors.primary },
            ]}
          >
            TODAY'S INSIGHT
          </Text>

          <Text
            style={[
              styles.insightTitle,
              { color: colors.text },
            ]}
          >
            {overallProgress >= 80
              ? "You're doing great today."
              : overallProgress >= 50
              ? "You're making good progress."
              : "There's still time to improve."}
          </Text>

          <Text
            style={[
              styles.insightText,
              { color: colors.subtext },
            ]}
          >
            {overallProgress >= 80
              ? "Keep your momentum going and finish the day strong."
              : overallProgress >= 50
              ? "Keep working toward your remaining nutrition and activity targets."
              : "Focus on your next meal, hydration, and activity goal to move closer to your target."}
          </Text>
        </View>
      </View>
    </DashboardPage>
  );
}

function MetricCard({
  icon,
  title,
  current,
  goal,
  unit,
  progress,
  colors,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  current: string;
  goal: string;
  unit: string;
  progress: number;
  colors: any;
}) {
  const percentage = Math.round(progress * 100);

  return (
    <View
      style={[
        styles.metricCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.metricTop}>
        <View
          style={[
            styles.metricIcon,
            { backgroundColor: colors.background },
          ]}
        >
          <Ionicons
            name={icon}
            size={19}
            color={colors.primary}
          />
        </View>

        <View
          style={[
            styles.percentageBadge,
            {
              backgroundColor:
                percentage >= 100
                  ? colors.primary
                  : colors.background,
            },
          ]}
        >
          <Text
            style={[
              styles.percentageText,
              {
                color:
                  percentage >= 100
                    ? "#05070B"
                    : colors.subtext,
              },
            ]}
          >
            {percentage}%
          </Text>
        </View>
      </View>

      <Text
        style={[
          styles.metricTitle,
          { color: colors.text },
        ]}
      >
        {title}
      </Text>

      <View style={styles.metricValueRow}>
        <Text
          style={[
            styles.metricCurrent,
            { color: colors.text },
          ]}
        >
          {current}
        </Text>
<Text
          style={[
            styles.metricUnit,
            { color: colors.subtext },
          ]}
        >
          {unit}
        </Text>
      </View>

      <Text
        style={[
          styles.metricGoal,
          { color: colors.subtext },
        ]}
      >
        Target {goal} {unit}
      </Text>

      <View
        style={[
          styles.metricTrack,
          { backgroundColor: colors.border },
        ]}
      >
        <View
          style={[
            styles.metricFill,
            {
              width: `${Math.min(percentage, 100)}%`,
              backgroundColor: colors.primary,
            },
          ]}
        />
      </View>
    </View>
  );
}

function OverviewRow({
  icon,
  title,
  current,
  target,
  progress,
  colors,
  last = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  current: string;
  target: string;
  progress: number;
  colors: any;
  last?: boolean;
}) {
  const percentage = Math.round(progress * 100);

  return (
    <View
      style={[
        styles.overviewRow,
        !last && {
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <View
        style={[
          styles.overviewIcon,
          { backgroundColor: colors.background },
        ]}
      >
        <Ionicons
          name={icon}
          size={18}
          color={colors.primary}
        />
      </View>

      <View style={styles.overviewMiddle}>
        <View style={styles.overviewTitleRow}>
          <Text
            style={[
              styles.overviewTitle,
              { color: colors.text },
            ]}
          >
            {title}
          </Text>

          <Text
            style={[
              styles.overviewValue,
              { color: colors.text },
            ]}
          >
            {current}
          </Text>
        </View>

        <View
          style={[
            styles.overviewTrack,
            { backgroundColor: colors.border },
          ]}
        >
          <View
            style={[
              styles.overviewFill,
              {
                width: `${Math.min(percentage, 100)}%`,
                backgroundColor: colors.primary,
              },
            ]}
          />
        </View>

        <Text
          style={[
            styles.overviewTarget,
            { color: colors.subtext },
          ]}
        >
          Target: {target}
        </Text>
      </View>

      <Text
        style={[
          styles.overviewPercentage,
          { color: colors.primary },
        ]}
      >
        {percentage}%
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: 25,
    borderWidth: 1,
    padding: 22,
    marginBottom: 31,
  },

  heroTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  heroText: {
    flex: 1,
  },

  eyebrow: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.5,
  },

  heroTitle: {
    fontSize: 42,
    fontWeight: "900",
    marginTop: 3,
  },

  heroSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },

  heroCircle: {
    width: 65,
    height: 65,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  heroTrack: {
    height: 9,
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 24,
  },

  heroFill: {
    height: "100%",
    borderRadius: 10,
  },

  heroFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },

  heroFooterRight: {
    alignItems: "flex-end",
  },

  heroFooterValue: {
    fontSize: 15,
    fontWeight: "900",
  },

  heroFooterLabel: {
    fontSize: 9,
    marginTop: 3,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  sectionText: {
    flex: 1,
    paddingRight: 12,
  },
sectionTitle: {
    fontSize: 19,
    fontWeight: "900",
  },

  sectionSubtitle: {
    fontSize: 11,
    marginTop: 4,
    lineHeight: 17,
  },

  targetBadge: {
    height: 35,
    paddingHorizontal: 11,
    borderRadius: 11,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  targetBadgeText: {
    fontSize: 9,
    fontWeight: "800",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 11,
    marginBottom: 31,
  },

  metricCard: {
    width: "31.8%",
    minWidth: 210,
    minHeight: 185,
    borderRadius: 20,
    borderWidth: 1,
    padding: 17,
  },

  metricTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  metricIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  percentageBadge: {
    minWidth: 40,
    height: 27,
    paddingHorizontal: 7,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },

  percentageText: {
    fontSize: 9,
    fontWeight: "900",
  },

  metricTitle: {
    fontSize: 12,
    fontWeight: "900",
    marginTop: 15,
  },

  metricValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 6,
  },

  metricCurrent: {
    fontSize: 24,
    fontWeight: "900",
  },

  metricUnit: {
    fontSize: 9,
    marginLeft: 4,
  },

  metricGoal: {
    fontSize: 9,
    marginTop: 3,
  },

  metricTrack: {
    height: 6,
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 17,
  },

  metricFill: {
    height: "100%",
    borderRadius: 10,
  },

  overviewCard: {
    borderRadius: 21,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 20,
  },

  overviewRow: {
    minHeight: 88,
    paddingHorizontal: 15,
    paddingVertical: 13,
    flexDirection: "row",
    alignItems: "center",
  },

  overviewIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  overviewMiddle: {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
  },

  overviewTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  overviewTitle: {
    fontSize: 11,
    fontWeight: "900",
  },

  overviewValue: {
    fontSize: 11,
    fontWeight: "900",
  },

  overviewTrack: {
    height: 5,
    borderRadius: 8,
    overflow: "hidden",
    marginTop: 9,
  },

  overviewFill: {
    height: "100%",
    borderRadius: 8,
  },

  overviewTarget: {
    fontSize: 8,
    marginTop: 5,
  },

  overviewPercentage: {
    width: 40,
    fontSize: 10,
    fontWeight: "900",
    textAlign: "right",
  },

  insightCard: {
    borderRadius: 21,
    borderWidth: 1,
    padding: 18,
    flexDirection: "row",
    marginBottom: 20,
  },

  insightIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  insightContent: {
    flex: 1,
    marginLeft: 12,
  },

  insightLabel: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.2,
  },

  insightTitle: {
    fontSize: 14,
    fontWeight: "900",
    marginTop: 4,
  },

  insightText: {
    fontSize: 10,
    lineHeight: 16,
    marginTop: 5,
  },
});