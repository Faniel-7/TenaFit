import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Circle, G } from "react-native-svg";
import { useAppData } from "../../context/AppDataContext";
import { useTheme } from "../../context/ThemeContext";

const waterAmounts = [
  {
    amount: 0.25,
    label: "250 ml",
    icon: "water-outline" as keyof typeof Ionicons.glyphMap,
  },
  {
    amount: 0.5,
    label: "500 ml",
    icon: "water" as keyof typeof Ionicons.glyphMap,
  },
  {
    amount: 0.75,
    label: "750 ml",
    icon: "beaker-outline" as keyof typeof Ionicons.glyphMap,
  },
  {
    amount: 1,
    label: "1 L",
    icon: "flask-outline" as keyof typeof Ionicons.glyphMap,
  },
];

export default function WaterScreen() {
  const { width } = useWindowDimensions();
  const { colors, isDark } = useTheme();
  const { data, goals, waterProgress, addWater } = useAppData();

  const [addingAmount, setAddingAmount] = useState<number | null>(null);

  const isMobile = width < 700;

  const waterBlue = isDark ? "#4DB8FF" : "#1689D7";
  const waterBlueSoft = isDark ? "#102638" : "#E8F5FF";

  const consumed = Number(data.water) || 0;
  const goal = Number(goals.water) || 0;

  const safeProgress = Math.max(
    0,
    Math.min(Number(waterProgress) || 0, 1)
  );

  const percentage = Math.round(safeProgress * 100);
  const remaining = Math.max(goal - consumed, 0);
  const goalReached = goal > 0 && consumed >= goal;

  const ringSize = isMobile ? 190 : 210;
  const strokeWidth = 13;
  const center = ringSize / 2;
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - safeProgress * circumference;

  const styles = useMemo(
    () => createStyles(colors, isDark, waterBlue, waterBlueSoft),
    [colors, isDark, waterBlue, waterBlueSoft]
  );

  const handleAddWater = async (amount: number) => {
    if (addingAmount !== null) {
      return;
    }

    setAddingAmount(amount);

    try {
      await addWater(amount);
    } finally {
      setAddingAmount(null);
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            maxWidth: 1120,
            paddingHorizontal: isMobile ? 18 : 28,
          },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.headerText}>
            <View style={styles.eyebrowRow}>
              <View style={styles.eyebrowIcon}>
                <Ionicons
                  name="water"
                  size={15}
                  color={waterBlue}
                />
              </View>

              <Text style={styles.eyebrow}>
                DAILY HYDRATION
              </Text>
            </View>

            <Text style={styles.title}>
              Stay hydrated.
            </Text>

            <Text style={styles.subtitle}>
              Track your water intake and stay on top of your daily target.
            </Text>
          </View>

          <View style={styles.headerIcon}>
            <Ionicons
              name="water-outline"
              size={27}
              color={waterBlue}
            />
          </View>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroGlow} />

          <View
            style={[
              styles.heroContent,
              isMobile && styles.heroContentMobile,
            ]}
          >
            <View style={styles.ringContainer}>
              <Svg
                width={ringSize}
                height={ringSize}
                viewBox={`0 0 ${ringSize} ${ringSize}`}
              >
                <Circle
                  cx={center}
                  cy={center}
                  r={radius}
                  stroke={colors.border}
                  strokeWidth={strokeWidth}
                  fill="none"
                />

                {safeProgress > 0 && (
                  <G
                    rotation="-90"
                    origin={`${center}, ${center}`}
                  >
                    <Circle
                      cx={center}
                      cy={center}
                      r={radius}
                      stroke={waterBlue}
                      strokeWidth={strokeWidth}
                      strokeLinecap="round"
                      fill="none"
                      strokeDasharray={`${circumference} ${circumference}`}
                      strokeDashoffset={strokeDashoffset}
                    />
                  </G>
                )}
              </Svg>

              <View style={styles.ringCenter}>
                <Ionicons
                  name={
                    goalReached
                      ? "checkmark-circle"
                      : "water"
                  }
                  size={24}
                  color={goalReached ? colors.success : waterBlue}
                />

                <Text style={styles.ringPercentage}>
                  {percentage}%
                </Text>

                <Text style={styles.ringLabel}>
                  completed
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.heroInfo,
                isMobile && styles.heroInfoMobile,
              ]}
            >
              <Text style={styles.heroLabel}>
                TODAY'S WATER
              </Text>

              <View style={styles.heroValueRow}>
                <Text style={styles.heroValue}>
                  {consumed.toFixed(2)}
                </Text>

                <Text style={styles.heroUnit}>
                  L
                </Text>
              </View>

              <Text style={styles.heroGoal}>
                of {goal.toFixed(2)} L daily target
              </Text>

              <View style={styles.heroDivider} />

              <View style={styles.heroRemainingRow}>
                <View style={styles.heroRemainingIcon}>
                  <Ionicons
                    name={
                      goalReached
                        ? "checkmark"
                        : "water-outline"
                    }
                    size={17}
                    color={
                      goalReached
                        ? colors.success
                        : waterBlue
                    }
                  />
                </View>

                <View style={styles.heroRemainingText}>
                  <Text style={styles.heroRemainingValue}>
                    {goalReached
                      ? "Goal reached"
                      : `${remaining.toFixed(2)} L remaining`}
                  </Text>

                  <Text style={styles.heroRemainingLabel}>
                    {goalReached
                      ? "Great work today."
                      : "Keep going to reach your target."}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Today's overview
            </Text>

            <Text style={styles.sectionSubtitle}>
              Your hydration numbers for today.
            </Text>
          </View>

          <View style={styles.sectionIcon}>
            <Ionicons
              name="stats-chart-outline"
              size={17}
              color={colors.primary}
            />
          </View>
        </View>
<View
          style={[
            styles.statsRow,
            isMobile && styles.statsRowMobile,
          ]}
        >
          <View style={styles.statCard}>
            <View
              style={[
                styles.statIcon,
                { backgroundColor: waterBlueSoft },
              ]}
            >
              <Ionicons
                name="water"
                size={19}
                color={waterBlue}
              />
            </View>

            <Text style={styles.statValue}>
              {consumed.toFixed(2)} L
            </Text>

            <Text style={styles.statLabel}>
              Consumed
            </Text>
          </View>

          <View style={styles.statCard}>
            <View
              style={[
                styles.statIcon,
                { backgroundColor: colors.primary + "18" },
              ]}
            >
              <Ionicons
                name="flag-outline"
                size={19}
                color={colors.primary}
              />
            </View>

            <Text style={styles.statValue}>
              {goal.toFixed(2)} L
            </Text>

            <Text style={styles.statLabel}>
              Daily target
            </Text>
          </View>

          <View style={styles.statCard}>
            <View
              style={[
                styles.statIcon,
                {
                  backgroundColor: goalReached
                    ? colors.success + "18"
                    : colors.background,
                },
              ]}
            >
              <Ionicons
                name={
                  goalReached
                    ? "checkmark-circle-outline"
                    : "time-outline"
                }
                size={19}
                color={
                  goalReached
                    ? colors.success
                    : colors.subtext
                }
              />
            </View>

            <Text style={styles.statValue}>
              {goalReached
                ? "Done"
                : `${remaining.toFixed(2)} L remaining`}
            </Text>

            <Text style={styles.statLabel}>
              {goalReached ? "Target reached" : "Remaining"}
            </Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Add water
            </Text>

            <Text style={styles.sectionSubtitle}>
              Log the amount you just drank.
            </Text>
          </View>

          <View style={styles.sectionIcon}>
            <Ionicons
              name="add-circle-outline"
              size={18}
              color={colors.primary}
            />
          </View>
        </View>

        <View
          style={[
            styles.amountGrid,
            isMobile && styles.amountGridMobile,
          ]}
        >
          {waterAmounts.map((item) => {
            const isAdding = addingAmount === item.amount;
            const disabled = addingAmount !== null;

            return (
              <Pressable
                key={item.amount}
                onPress={() =>
                  handleAddWater(item.amount)
                }
                disabled={disabled}
                style={({ pressed }) => [
                  styles.amountCard,
                  pressed && !disabled && styles.amountCardPressed,
                  disabled &&
                    !isAdding &&
                    styles.amountCardDisabled,
                ]}
              >
                <View style={styles.amountIcon}>
                  {isAdding ? (
                    <ActivityIndicator
                      size="small"
                      color={waterBlue}
                    />
                  ) : (
                    <Ionicons
                      name={item.icon}
                      size={23}
                      color={waterBlue}
                    />
                  )}
                </View>
<View style={styles.amountTextContainer}>
                  <Text style={styles.amountValue}>
                    +{item.label}
                  </Text>

                  <Text style={styles.amountDescription}>
                    Add to intake
                  </Text>
                </View>

                <Ionicons
                  name="add"
                  size={19}
                  color={colors.subtext}
                />
              </Pressable>
            );
          })}
        </View>

        <View style={styles.statusCard}>
          <View
            style={[
              styles.statusIcon,
              {
                backgroundColor: goalReached
                  ? colors.success + "18"
                  : waterBlueSoft,
              },
            ]}
          >
            <Ionicons
              name={
                goalReached
                  ? "checkmark-circle"
                  : "water"
              }
              size={26}
              color={
                goalReached
                  ? colors.success
                  : waterBlue
              }
            />
          </View>

          <View style={styles.statusContent}>
            <Text style={styles.statusEyebrow}>
              HYDRATION STATUS
            </Text>

            <Text style={styles.statusTitle}>
              {goalReached
                ? "Daily goal reached"
                : percentage === 0
                ? "Let's get started"
                : percentage < 50
                ? "Keep building your intake"
                : "You're making good progress"}
            </Text>

            <Text style={styles.statusText}>
              {goalReached
                ? "You've reached today's water target. Keep it up."
                : ` ${remaining.toFixed(
                    2
                  )} L more will take you to your daily target.`}
            </Text>
          </View>
        </View>

        <View style={styles.tipCard}>
          <View style={styles.tipIcon}>
            <Ionicons
              name="bulb-outline"
              size={21}
              color={colors.primary}
            />
          </View>

          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>
              Stay consistent
            </Text>

            <Text style={styles.tipText}>
              Logging water throughout the day makes it easier to
              stay aware of your hydration instead of trying to catch
              up all at once.
            </Text>
          </View>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
}

function createStyles(
  colors: ReturnType<typeof useTheme>["colors"],
  isDark: boolean,
  waterBlue: string,
  waterBlueSoft: string
) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },

    scrollContent: {
      width: "100%",
      alignSelf: "center",
      paddingTop: Platform.OS === "web" ? 28 : 20,
      paddingBottom: 50,
    },

    header: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      marginBottom: 24,
    },

    headerText: {
      flex: 1,
      paddingRight: 18,
    },

    eyebrowRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 9,
    },

    eyebrowIcon: {
      width: 28,
      height: 28,
      borderRadius: 9,
      backgroundColor: waterBlueSoft,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 8,
    },

    eyebrow: {
      color: waterBlue,
      fontSize: 10,
      fontWeight: "900",
      letterSpacing: 1.2,
    },

    title: {
      color: colors.text,
      fontSize: 31,
      fontWeight: "900",
      letterSpacing: -0.8,
    },

    subtitle: {
      color: colors.subtext,
      fontSize: 13,
      lineHeight: 20,
      marginTop: 6,
      maxWidth: 620,
    },
headerIcon: {
      width: 50,
      height: 50,
      borderRadius: 16,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
    },

    heroCard: {
      backgroundColor: colors.card,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
      marginBottom: 28,
      position: "relative",
    },

    heroGlow: {
      position: "absolute",
      width: 230,
      height: 230,
      borderRadius: 115,
      backgroundColor: waterBlueSoft,
      right: -100,
      top: -100,
      opacity: isDark ? 0.5 : 0.8,
    },

    heroContent: {
      minHeight: 300,
      padding: 26,
      flexDirection: "row",
      alignItems: "center",
    },

    heroContentMobile: {
      flexDirection: "column",
      padding: 22,
    },

    ringContainer: {
      alignItems: "center",
      justifyContent: "center",
    },

    ringCenter: {
      position: "absolute",
      alignItems: "center",
      justifyContent: "center",
    },

    ringPercentage: {
      color: colors.text,
      fontSize: 30,
      fontWeight: "900",
      marginTop: 5,
      letterSpacing: -0.8,
    },

    ringLabel: {
      color: colors.subtext,
      fontSize: 10,
      fontWeight: "700",
      marginTop: 1,
    },

    heroInfo: {
      flex: 1,
      marginLeft: 36,
      paddingRight: 10,
    },

    heroInfoMobile: {
      width: "100%",
      marginLeft: 0,
      marginTop: 22,
      paddingRight: 0,
      alignItems: "center",
    },

    heroLabel: {
      color: colors.subtext,
      fontSize: 10,
      fontWeight: "900",
      letterSpacing: 1.2,
    },

    heroValueRow: {
      flexDirection: "row",
      alignItems: "flex-end",
      marginTop: 4,
    },

    heroValue: {
      color: colors.text,
      fontSize: 48,
      lineHeight: 55,
      fontWeight: "900",
      letterSpacing: -1.5,
    },

    heroUnit: {
      color: waterBlue,
      fontSize: 19,
      fontWeight: "900",
      marginBottom: 9,
      marginLeft: 5,
    },

    heroGoal: {
      color: colors.subtext,
      fontSize: 12,
      marginTop: 1,
    },

    heroDivider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 19,
      width: "100%",
    },

    heroRemainingRow: {
      flexDirection: "row",
      alignItems: "center",
    },

    heroRemainingIcon: {
      width: 38,
      height: 38,
      borderRadius: 12,
      backgroundColor: waterBlueSoft,
      alignItems: "center",
      justifyContent: "center",
    },

    heroRemainingText: {
      flex: 1,
      marginLeft: 11,
    },

    heroRemainingValue: {
      color: colors.text,
      fontSize: 13,
      fontWeight: "900",
    },

    heroRemainingLabel: {
      color: colors.subtext,
      fontSize: 10,
      marginTop: 3,
    },

    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 13,
    },

    sectionTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "900",
      letterSpacing: -0.3,
    },

    sectionSubtitle: {
      color: colors.subtext,
      fontSize: 11,
      marginTop: 3,
    },

    sectionIcon: {
      width: 35,
      height: 35,
      borderRadius: 11,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
    },

    statsRow: {
      flexDirection: "row",
      marginBottom: 29,
    },

    statsRowMobile: {
      flexDirection: "row",
    },

    statCard: {
      flex: 1,
      minHeight: 120,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 17,
      padding: 14,
      marginRight: 10,
    },

    statIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 11,
    },
statValue: {
      color: colors.text,
      fontSize: 15,
      fontWeight: "900",
    },

    statLabel: {
      color: colors.subtext,
      fontSize: 9,
      fontWeight: "700",
      marginTop: 4,
    },

    amountGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginBottom: 29,
    },

    amountGridMobile: {
      flexDirection: "row",
    },

    amountCard: {
      flex: 0.48,
      minHeight: 78,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 17,
      paddingHorizontal: 14,
      paddingVertical: 13,
      flexDirection: "row",
      alignItems: "center",
      marginRight: 10,
      marginBottom: 10,
    },

    amountCardPressed: {
      transform: [{ scale: 0.98 }],
      opacity: 0.85,
    },

    amountCardDisabled: {
      opacity: 0.5,
    },

    amountIcon: {
      width: 43,
      height: 43,
      borderRadius: 13,
      backgroundColor: waterBlueSoft,
      alignItems: "center",
      justifyContent: "center",
    },

    amountTextContainer: {
      flex: 1,
      marginLeft: 11,
    },

    amountValue: {
      color: colors.text,
      fontSize: 14,
      fontWeight: "900",
    },

    amountDescription: {
      color: colors.subtext,
      fontSize: 9,
      marginTop: 3,
    },

    statusCard: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 18,
      padding: 17,
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },

    statusIcon: {
      width: 51,
      height: 51,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
    },

    statusContent: {
      flex: 1,
      marginLeft: 13,
    },

    statusEyebrow: {
      color: waterBlue,
      fontSize: 8,
      fontWeight: "900",
      letterSpacing: 1,
      marginBottom: 3,
    },

    statusTitle: {
      color: colors.text,
      fontSize: 14,
      fontWeight: "900",
    },

    statusText: {
      color: colors.subtext,
      fontSize: 10,
      lineHeight: 16,
      marginTop: 4,
    },

    tipCard: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 18,
      padding: 17,
      flexDirection: "row",
      alignItems: "flex-start",
    },

    tipIcon: {
      width: 43,
      height: 43,
      borderRadius: 13,
      backgroundColor: colors.primary + "18",
      alignItems: "center",
      justifyContent: "center",
    },

    tipContent: {
      flex: 1,
      marginLeft: 12,
    },

    tipTitle: {
      color: colors.text,
      fontSize: 13,
      fontWeight: "900",
    },

    tipText: {
      color: colors.subtext,
      fontSize: 10,
      lineHeight: 16,
      marginTop: 4,
    },

    bottomSpace: {
      height: 30,
    },
  });
}