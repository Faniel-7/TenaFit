import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DashboardPage from "../../components/dashboard/DashboardPage";
import { useAppData } from "../../context/AppDataContext";
import { useTheme } from "../../context/ThemeContext";

const waterAmounts = [0.25, 0.5, 0.75, 1];

export default function WaterScreen() {
  const {
    data,
    goals,
    waterProgress,
    addWater,
  } = useAppData();

  const { colors } = useTheme();

  const remaining = Math.max(goals.water - data.water, 0);
  const percentage = Math.round(waterProgress * 100);
  const isComplete = waterProgress >= 1;

  return (
    <DashboardPage
      title="Water"
      subtitle="Stay hydrated and keep your daily intake on track."
      icon="water-outline"
    >
      <View
        style={[
          styles.heroCard,
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
              TODAY'S HYDRATION
            </Text>

            <View style={styles.amountRow}>
              <Text
                style={[
                  styles.amount,
                  { color: colors.text },
                ]}
              >
                {data.water.toFixed(2)}
              </Text>

              <Text
                style={[
                  styles.amountUnit,
                  { color: colors.subtext },
                ]}
              >
                L
              </Text>
            </View>

            <Text
              style={[
                styles.goalText,
                { color: colors.subtext },
              ]}
            >
              of {goals.water.toFixed(2)} L daily goal
            </Text>
          </View>

          <View
            style={[
              styles.waterCircle,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons
              name={
                isComplete
                  ? "checkmark-circle-outline"
                  : "water-outline"
              }
              size={32}
              color={colors.primary}
            />

            <Text
              style={[
                styles.circlePercentage,
                { color: colors.text },
              ]}
            >
              {percentage}%
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.progressTrack,
            { backgroundColor: colors.border },
          ]}
        >
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min(percentage, 100)}%`,
                backgroundColor: colors.primary,
              },
            ]}
          />
        </View>

        <View style={styles.progressLabels}>
          <Text
            style={[
              styles.progressLabel,
              { color: colors.subtext },
            ]}
          >
            {data.water.toFixed(2)} L consumed
          </Text>

          <Text
            style={[
              styles.progressLabel,
              { color: colors.subtext },
            ]}
          >
            {goals.water.toFixed(2)} L goal
          </Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <StatCard
          icon="water"
          title="Consumed"
          value={`${data.water.toFixed(2)} L`}
          colors={colors}
        />

        <StatCard
          icon="flag-outline"
          title="Daily goal"
          value={`${goals.water.toFixed(2)} L`}
          colors={colors}
        />
<StatCard
          icon="hourglass-outline"
          title="Remaining"
          value={`${remaining.toFixed(2)} L`}
          colors={colors}
        />
      </View>

      <View style={styles.sectionHeader}>
        <View style={styles.sectionText}>
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.text },
            ]}
          >
            Add water
          </Text>

          <Text
            style={[
              styles.sectionSubtitle,
              { color: colors.subtext },
            ]}
          >
            Quickly log the amount you just drank.
          </Text>
        </View>

        <View
          style={[
            styles.sectionBadge,
            { backgroundColor: colors.card },
          ]}
        >
          <Ionicons
            name="add-outline"
            size={15}
            color={colors.primary}
          />
        </View>
      </View>

      <View style={styles.amountGrid}>
        {waterAmounts.map((amount) => (
          <TouchableOpacity
            key={amount}
            activeOpacity={0.8}
            onPress={() => addWater(amount)}
            style={[
              styles.amountButton,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.amountIcon,
                { backgroundColor: colors.background },
              ]}
            >
              <Ionicons
                name="water-outline"
                size={20}
                color={colors.primary}
              />
            </View>

            <View>
              <Text
                style={[
                  styles.amountButtonValue,
                  { color: colors.text },
                ]}
              >
                +{amount}
              </Text>

              <Text
                style={[
                  styles.amountButtonUnit,
                  { color: colors.subtext },
                ]}
              >
                liters
              </Text>
            </View>
          </TouchableOpacity>
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
            Hydration status
          </Text>

          <Text
            style={[
              styles.sectionSubtitle,
              { color: colors.subtext },
            ]}
          >
            Your current progress toward today's target.
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.statusCard,
          {
            backgroundColor: colors.card,
            borderColor: isComplete
              ? colors.primary
              : colors.border,
          },
        ]}
      >
        <View
          style={[
            styles.statusIcon,
            { backgroundColor: colors.background },
          ]}
        >
          <Ionicons
            name={
              isComplete
                ? "checkmark-circle"
                : "water"
            }
            size={27}
            color={colors.primary}
          />
        </View>

        <View style={styles.statusContent}>
          <Text
            style={[
              styles.statusLabel,
              { color: colors.primary },
            ]}
          >
            {isComplete
              ? "GOAL REACHED"
              : `${percentage}% COMPLETE`}
          </Text>

          <Text
            style={[
              styles.statusTitle,
              { color: colors.text },
            ]}
          >
            {isComplete
              ? "You've reached your water goal."
              : `${remaining.toFixed(2)} L left to go`}
          </Text>
<Text
            style={[
              styles.statusText,
              { color: colors.subtext },
            ]}
          >
            {isComplete
              ? "Great job staying hydrated today. Keep it consistent."
              : "Keep drinking throughout the day instead of waiting until you're thirsty."}
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.tipCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <View
          style={[
            styles.tipIcon,
            { backgroundColor: colors.background },
          ]}
        >
          <Ionicons
            name="bulb-outline"
            size={21}
            color={colors.primary}
          />
        </View>

        <View style={styles.tipContent}>
          <Text
            style={[
              styles.tipLabel,
              { color: colors.primary },
            ]}
          >
            HYDRATION TIP
          </Text>

          <Text
            style={[
              styles.tipTitle,
              { color: colors.text },
            ]}
          >
            Drink consistently
          </Text>

          <Text
            style={[
              styles.tipText,
              { color: colors.subtext },
            ]}
          >
            Spreading your water intake across the day
            can make it easier to reach your target.
          </Text>
        </View>
      </View>
    </DashboardPage>
  );
}

function StatCard({
  icon,
  title,
  value,
  colors,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: string;
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
      <View
        style={[
          styles.statIcon,
          { backgroundColor: colors.background },
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
          styles.statValue,
          { color: colors.text },
        ]}
      >
        {value}
      </Text>

      <Text
        style={[
          styles.statLabel,
          { color: colors.subtext },
        ]}
      >
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    borderWidth: 1,
    borderRadius: 25,
    padding: 22,
    marginBottom: 12,
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
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.5,
  },

  amountRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 4,
  },

  amount: {
    fontSize: 40,
    fontWeight: "900",
  },

  amountUnit: {
    fontSize: 16,
    fontWeight: "800",
    marginLeft: 5,
  },

  goalText: {
    fontSize: 11,
    marginTop: 1,
  },

  waterCircle: {
    width: 76,
    height: 76,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  circlePercentage: {
    fontSize: 9,
    fontWeight: "900",
    marginTop: 2,
  },

  progressTrack: {
    height: 9,
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 24,
  },

  progressFill: {
    height: "100%",
    borderRadius: 10,
  },

  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },

  progressLabel: {
    fontSize: 9,
    fontWeight: "700",
  },

  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 31,
  },

  statCard: {
    flex: 1,
    minHeight: 116,
    borderRadius: 17,
    borderWidth: 1,
    padding: 13,
  },

  statIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  statValue: {
    fontSize: 14,
    fontWeight: "900",
    marginTop: 10,
  },
statLabel: {
    fontSize: 8,
    marginTop: 3,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 13,
  },

  sectionText: {
    flex: 1,
    paddingRight: 10,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
  },

  sectionSubtitle: {
    fontSize: 10,
    lineHeight: 16,
    marginTop: 4,
  },

  sectionBadge: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },

  amountGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 31,
  },

  amountButton: {
    width: "48.5%",
    minHeight: 72,
    borderRadius: 17,
    borderWidth: 1,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },

  amountIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  amountButtonValue: {
    fontSize: 15,
    fontWeight: "900",
  },

  amountButtonUnit: {
    fontSize: 8,
    marginTop: 2,
  },

  statusCard: {
    minHeight: 105,
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 13,
  },

  statusIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  statusContent: {
    flex: 1,
    marginLeft: 13,
  },

  statusLabel: {
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1.1,
  },

  statusTitle: {
    fontSize: 13,
    fontWeight: "900",
    marginTop: 4,
  },

  statusText: {
    fontSize: 9,
    lineHeight: 14,
    marginTop: 4,
  },

  tipCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    flexDirection: "row",
    marginBottom: 20,
  },

  tipIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  tipContent: {
    flex: 1,
    marginLeft: 12,
  },

  tipLabel: {
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1.1,
  },

  tipTitle: {
    fontSize: 13,
    fontWeight: "900",
    marginTop: 3,
  },

  tipText: {
    fontSize: 9,
    lineHeight: 15,
    marginTop: 4,
  },
});