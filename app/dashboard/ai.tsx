import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "../../context/ThemeContext";
import { usePremium } from "../../context/PremiumContext";
import { useAppData } from "../../context/AppDataContext";
import { getAIRecommendation } from "../../lib/ai";
import PremiumGate from "../../components/premium/PremiumGate";
import { getUserProfile } from "../../storage/profileStorage";
import { calculateNutritionTarget } from "../../logic/nutritionCalculator";

type ThemeColors = {
  background: string;
  card: string;
  text: string;
  subtext: string;
  primary: string;
  border: string;
  danger: string;
};

export default function AIScreen() {
  const { colors } = useTheme();
  const { isPremium, loading: premiumLoading } = usePremium();

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

  const router = useRouter();
  const { width } = useWindowDimensions();

  const [recommendation, setRecommendation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const contentWidth = Math.min(
    width > 767 ? 1120 : 620,
    Math.max(width - 36, 0)
  );

  const safeOverall = Math.max(
    0,
    Math.min(Number(overallProgress) || 0, 100)
  );

  const remaining = useMemo(() => {
    return {
      calories: Math.max(
        Number(goals.calories) - Number(data.calories),
        0
      ),
      protein: Math.max(
        Number(goals.protein) - Number(data.protein),
        0
      ),
      carbs: Math.max(
        Number(goals.carbs) - Number(data.carbs),
        0
      ),
      fat: Math.max(
        Number(goals.fat) - Number(data.fat),
        0
      ),
      water: Math.max(
        Number(goals.water) - Number(data.water),
        0
      ),
      steps: Math.max(
        Number(goals.steps) - Number(data.steps),
        0
      ),
    };
  }, [data, goals]);

  const focusItems = useMemo(() => {
    const items: {
      icon: keyof typeof Ionicons.glyphMap;
      title: string;
      text: string;
    }[] = [];

    if (remaining.protein > 0) {
      items.push({
        icon: "nutrition-outline",
        title: "Nutrition",
        text: `${Math.round(
          remaining.calories
        )} kcal and ${Math.round(
          remaining.protein
        )} g protein remain.`,
      });
    } else if (remaining.calories > 0) {
      items.push({
        icon: "restaurant-outline",
        title: "Nutrition",
        text: `${Math.round(
          remaining.calories
        )} kcal remain for today's target.`,
      });
    }

    if (remaining.water > 0.05) {
      items.push({
        icon: "water-outline",
        title: "Hydration",
        text: `${remaining.water.toFixed(
          1
        )} L remain to reach your water goal.`,
      });
    }

    if (remaining.steps > 0) {
      items.push({
        icon: "footsteps-outline",
        title: "Activity",
        text: `${Math.round(
          remaining.steps
        ).toLocaleString()} steps remain to reach your target.`,
      });
    }

    return items.slice(0, 3);
  }, [remaining]);

  const generateRecommendation = async () => {
    if (loading) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const profile = await getUserProfile();

      if (!profile) {
        throw new Error(
          "Your profile information could not be found. Please complete your profile and try again."
        );
      }

      const nutritionTarget =
        calculateNutritionTarget(profile);
const result = await getAIRecommendation({
        profile,
        nutritionTarget,
        caloriesConsumed: Number(data.calories),
        proteinConsumed: Number(data.protein),
        carbohydratesConsumed: Number(data.carbs),
        fatConsumed: Number(data.fat),
        waterConsumed: Number(data.water),
        steps: Number(data.steps),
      });

      setRecommendation(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while generating your recommendation."
      );
    } finally {
      setLoading(false);
    }
  };

  if (premiumLoading) {
    return (
      <View
        style={[
          styles.loadingScreen,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />
      </View>
    );
  }

  if (!isPremium) {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        <View
          style={[
            styles.page,
            {
              width: contentWidth,
            },
          ]}
        >
          <View style={styles.header}>
            <View style={styles.eyebrowRow}>
              <Ionicons
                name="sparkles"
                size={15}
                color={colors.primary}
              />

              <Text
                style={[
                  styles.eyebrow,
                  {
                    color: colors.primary,
                  },
                ]}
              >
                AI COACH
              </Text>
            </View>

            <Text
              style={[
                styles.title,
                {
                  color: colors.text,
                },
              ]}
            >
              Your personal nutrition coach
            </Text>

            <Text
              style={[
                styles.subtitle,
                {
                  color: colors.subtext,
                },
              ]}
            >
              Personalized guidance built around your
              goals, meals, activity and daily progress.
            </Text>
          </View>

          <View
            style={[
              styles.premiumIntro,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.aiIcon,
                {
                  backgroundColor: colors.primary,
                },
              ]}
            >
              <Ionicons
                name="sparkles"
                size={27}
                color="#111111"
              />
            </View>

            <Text
              style={[
                styles.premiumTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              Unlock your AI Coach
            </Text>

            <Text
              style={[
                styles.premiumText,
                {
                  color: colors.subtext,
                },
              ]}
            >
              Get practical nutrition guidance using the
              information you already track in TenaFit.
            </Text>

            <View style={styles.featureList}>
              <Feature
                icon="person-outline"
                text="Uses your personal goals"
                colors={colors}
              />

              <Feature
                icon="analytics-outline"
                text="Reads your daily progress"
                colors={colors}
              />
<Feature
                icon="restaurant-outline"
                text="Adapts food guidance to your preferences"
                colors={colors}
              />
            </View>
          </View>

          <PremiumGate
            title="AI Coach is a Premium feature"
            description="Activate TenaFit Premium to receive personalized nutrition recommendations."
          >
            <View />
          </PremiumGate>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.scrollContent,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <View
        style={[
          styles.page,
          {
            width: contentWidth,
          },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.eyebrowRow}>
            <Ionicons
              name="sparkles"
              size={15}
              color={colors.primary}
            />

            <Text
              style={[
                styles.eyebrow,
                {
                  color: colors.primary,
                },
              ]}
            >
              AI COACH
            </Text>

            <View
              style={[
                styles.premiumBadge,
                {
                  backgroundColor: colors.primary,
                },
              ]}
            >
              <Text style={styles.premiumBadgeText}>
                PREMIUM
              </Text>
            </View>
          </View>

          <Text
            style={[
              styles.title,
              {
                color: colors.text,
              },
            ]}
          >
            Your personal nutrition coach
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                color: colors.subtext,
              },
            ]}
          >
            Use today's real progress to decide what
            deserves your attention next.
          </Text>
        </View>

        <View
          style={[
            styles.snapshotCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.snapshotTop}>
            <View style={styles.snapshotCopy}>
              <Text
                style={[
                  styles.cardEyebrow,
                  {
                    color: colors.subtext,
                  },
                ]}
              >
                YOUR DAY AT A GLANCE
              </Text>

              <Text
                style={[
                  styles.snapshotTitle,
                  {
                    color: colors.text,
                  },
                ]}
              >
                You're {Math.round(safeOverall)}% on
                track
              </Text>
            </View>

            <View
              style={[
                styles.progressCircle,
                {
                  borderColor:
                    safeOverall > 0
                      ? colors.primary
                      : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.progressNumber,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {Math.round(safeOverall)}%
              </Text>
            </View>
          </View>

          <View style={styles.metricsGrid}>
            <Metric
              label="Calories"
              value={`${Math.round(
                Number(data.calories)
              )}`}
              target={`${Math.round(
                Number(goals.calories)
              )} kcal`}
              progress={calorieProgress}
              icon="flame-outline"
              colors={colors}
            />
<Metric
              label="Protein"
              value={`${Math.round(
                Number(data.protein)
              )} g`}
              target={`${Math.round(
                Number(goals.protein)
              )} g`}
              progress={proteinProgress}
              icon="barbell-outline"
              colors={colors}
            />

            <Metric
              label="Water"
              value={`${Number(data.water).toFixed(
                1
              )} L`}
              target={`${Number(goals.water).toFixed(
                1
              )} L`}
              progress={waterProgress}
              icon="water-outline"
              colors={colors}
            />

            <Metric
              label="Steps"
              value={`${Math.round(
                Number(data.steps)
              ).toLocaleString()}`}
              target={`${Math.round(
                Number(goals.steps)
              ).toLocaleString()}`}
              progress={stepsProgress}
              icon="footsteps-outline"
              colors={colors}
            />
          </View>
        </View>

        <View style={styles.sectionHeading}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.text,
              },
            ]}
          >
            What needs attention?
          </Text>

          <Text
            style={[
              styles.sectionSubtitle,
              {
                color: colors.subtext,
              },
            ]}
          >
            A quick read of your current day.
          </Text>
        </View>

        <View
          style={[
            styles.focusCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          {focusItems.length > 0 ? (
            focusItems.map((item, index) => (
              <View
                key={item.title}
                style={[
                  styles.focusRow,
                  index < focusItems.length - 1 &&
                    styles.focusRowBorder,
                  {
                    borderColor: colors.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.focusIcon,
                    {
                      backgroundColor:
                        colors.background,
                    },
                  ]}
                >
                  <Ionicons
                    name={item.icon}
                    size={19}
                    color={colors.primary}
                  />
                </View>

                <View style={styles.focusContent}>
                  <Text
                    style={[
                      styles.focusTitle,
                      {
                        color: colors.text,
                      },
                    ]}
                  >
                    {item.title}
                  </Text>

                  <Text
                    style={[
                      styles.focusText,
                      {
                        color: colors.subtext,
                      },
                    ]}
                  >
                    {item.text}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.completeState}>
              <View
                style={[
                  styles.completeIcon,
                  {
                    backgroundColor:
                      colors.primary,
                  },
                ]}
              >
                <Ionicons
                  name="checkmark"
                  size={21}
                  color="#111111"
                />
              </View>
<View style={styles.focusContent}>
                <Text
                  style={[
                    styles.focusTitle,
                    {
                      color: colors.text,
                    },
                  ]}
                >
                  You're on track
                </Text>

                <Text
                  style={[
                    styles.focusText,
                    {
                      color: colors.subtext,
                    },
                  ]}
                >
                  Your main tracked targets are currently
                  met. Keep the routine going.
                </Text>
              </View>
            </View>
          )}
        </View>

        <View
          style={[
            styles.coachCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.coachIcon,
              {
                backgroundColor: colors.primary,
              },
            ]}
          >
            <Ionicons
              name="sparkles"
              size={21}
              color="#111111"
            />
          </View>

          <Text
            style={[
              styles.coachTitle,
              {
                color: colors.text,
              },
            ]}
          >
            Ask TenaFit AI
          </Text>

          <Text
            style={[
              styles.coachDescription,
              {
                color: colors.subtext,
              },
            ]}
          >
            Get a practical recommendation for the rest
            of your day based on your profile and today's
            tracked data.
          </Text>

          <Pressable
            onPress={generateRecommendation}
            disabled={loading}
            style={({ pressed }) => [
              styles.primaryButton,
              {
                backgroundColor: colors.primary,
                opacity: loading
                  ? 0.65
                  : pressed
                  ? 0.82
                  : 1,
              },
            ]}
          >
            {loading ? (
              <ActivityIndicator color="#111111" />
            ) : (
              <>
                <Ionicons
                  name={
                    recommendation
                      ? "refresh"
                      : "sparkles"
                  }
                  size={18}
                  color="#111111"
                />

                <Text
                  style={styles.primaryButtonText}
                >
                  {recommendation
                    ? "Generate Again"
                    : "Get My Recommendation"}
                </Text>
              </>
            )}
          </Pressable>
        </View>

        {loading ? (
          <View
            style={[
              styles.loadingCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <ActivityIndicator
              size="small"
              color={colors.primary}
            />

            <View style={styles.loadingCopy}>
              <Text
                style={[
                  styles.loadingTitle,
                  {
                    color: colors.text,
                  },
                ]}
              >
                Analyzing your day
              </Text>

              <Text
                style={[
                  styles.loadingText,
                  {
                    color: colors.subtext,
                  },
                ]}
              >
                Preparing guidance from your current
                profile and progress.
              </Text>
            </View>
          </View>
        ) : null}
{error ? (
          <View
            style={[
              styles.errorCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.errorIcon,
                {
                  backgroundColor:
                    colors.background,
                },
              ]}
            >
              <Ionicons
                name="cloud-offline-outline"
                size={20}
                color={colors.danger}
              />
            </View>

            <View style={styles.errorContent}>
              <Text
                style={[
                  styles.errorTitle,
                  {
                    color: colors.text,
                  },
                ]}
              >
                AI recommendation unavailable
              </Text>

              <Text
                style={[
                  styles.errorText,
                  {
                    color: colors.subtext,
                  },
                ]}
              >
                {error}
              </Text>

              <Pressable
                onPress={generateRecommendation}
                style={styles.retryButton}
              >
                <Text
                  style={[
                    styles.retryText,
                    {
                      color: colors.primary,
                    },
                  ]}
                >
                  Try again
                </Text>

                <Ionicons
                  name="arrow-forward"
                  size={15}
                  color={colors.primary}
                />
              </Pressable>
            </View>
          </View>
        ) : null}

        {recommendation ? (
          <View
            style={[
              styles.recommendationCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <View
              style={styles.recommendationHeader}
            >
              <View
                style={[
                  styles.recommendationIcon,
                  {
                    backgroundColor:
                      colors.primary,
                  },
                ]}
              >
                <Ionicons
                  name="sparkles"
                  size={18}
                  color="#111111"
                />
              </View>

              <View
                style={styles.recommendationHeading}
              >
                <Text
                  style={[
                    styles.cardEyebrow,
                    {
                      color: colors.subtext,
                    },
                  ]}
                >
                  TENAFIT AI
                </Text>

                <Text
                  style={[
                    styles.recommendationTitle,
                    {
                      color: colors.text,
                    },
                  ]}
                >
                  Your personal recommendation
                </Text>
              </View>
            </View>

            <Text
              style={[
                styles.recommendationText,
                {
                  color: colors.text,
                },
              ]}
            >
              {recommendation}
            </Text>

            <Pressable
              onPress={generateRecommendation}
              disabled={loading}
              style={styles.secondaryAction}
            >
              <Ionicons
                name="refresh-outline"
                size={17}
                color={colors.primary}
              />
<Text
                style={[
                  styles.secondaryActionText,
                  {
                    color: colors.primary,
                  },
                ]}
              >
                Generate a new recommendation
              </Text>
            </Pressable>
          </View>
        ) : null}

        <View
          style={[
            styles.noteCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Ionicons
            name="information-circle-outline"
            size={18}
            color={colors.subtext}
          />

          <Text
            style={[
              styles.noteText,
              {
                color: colors.subtext,
              },
            ]}
          >
            TenaFit AI uses your profile and daily
            tracking data for general nutrition guidance.
            It does not provide medical diagnosis or
            replace professional care.
          </Text>
        </View>

        <Pressable
          onPress={() =>
            router.push("/dashboard/plan")
          }
          style={styles.planLink}
        >
          <Text
            style={[
              styles.planLinkText,
              {
                color: colors.subtext,
              },
            ]}
          >
            View today's meal plan
          </Text>

          <Ionicons
            name="arrow-forward"
            size={16}
            color={colors.primary}
          />
        </Pressable>
      </View>
    </ScrollView>
  );
}

function Metric({
  label,
  value,
  target,
  progress,
  icon,
  colors,
}: {
  label: string;
  value: string;
  target: string;
  progress: number;
  icon: keyof typeof Ionicons.glyphMap;
  colors: ThemeColors;
}) {
  const percentage = Math.max(
    0,
    Math.min(Number(progress) * 100 || 0, 100)
  );

  return (
    <View style={styles.metric}>
      <View style={styles.metricHeader}>
        <Ionicons
          name={icon}
          size={16}
          color={colors.primary}
        />

        <Text
          style={[
            styles.metricLabel,
            {
              color: colors.subtext,
            },
          ]}
        >
          {label}
        </Text>
      </View>

      <Text
        style={[
          styles.metricValue,
          {
            color: colors.text,
          },
        ]}
      >
        {value}
      </Text>

      <Text
        style={[
          styles.metricTarget,
          {
            color: colors.subtext,
          },
        ]}
      >
        of {target}
      </Text>

      <View
        style={[
          styles.metricTrack,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        <View
          style={[
            styles.metricFill,
            {
              backgroundColor: colors.primary,
              width: `${percentage}%`,
            },
          ]}
        />
      </View>
    </View>
  );
}

function Feature({
  icon,
  text,
  colors,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
  colors: ThemeColors;
}) {
  return (
    <View style={styles.featureRow}>
      <Ionicons
        name={icon}
        size={17}
        color={colors.primary}
      />

      <Text
        style={[
          styles.featureText,
          {
            color: colors.text,
          },
        ]}
      >
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingTop: 26,
    paddingBottom: 44,
    alignItems: "center",
  },

  page: {
    maxWidth: 1120,
    alignSelf: "center",
  },

  header: {
    marginBottom: 22,
  },

  eyebrowRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 9,
  },

  eyebrow: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginLeft: 6,
  },
premiumBadge: {
    marginLeft: 9,
    borderRadius: 7,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },

  premiumBadgeText: {
    color: "#111111",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.8,
  },

  title: {
    fontSize: 30,
    lineHeight: 35,
    fontWeight: "900",
    letterSpacing: -0.7,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    maxWidth: 650,
  },

  snapshotCard: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 20,
    marginBottom: 22,
  },

  snapshotTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
  },

  snapshotCopy: {
    flex: 1,
    paddingRight: 12,
  },

  cardEyebrow: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginBottom: 5,
  },

  snapshotTitle: {
    fontSize: 20,
    fontWeight: "800",
  },

  progressCircle: {
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 5,
    alignItems: "center",
    justifyContent: "center",
  },

  progressNumber: {
    fontSize: 16,
    fontWeight: "900",
  },

  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -6,
  },

  metric: {
    width: "50%",
    paddingHorizontal: 6,
    marginBottom: 18,
  },

  metricHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  metricLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 6,
  },

  metricValue: {
    fontSize: 19,
    fontWeight: "800",
  },

  metricTarget: {
    fontSize: 11,
    marginTop: 2,
    marginBottom: 8,
  },

  metricTrack: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },

  metricFill: {
    height: "100%",
    borderRadius: 3,
  },

  sectionHeading: {
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
  },

  sectionSubtitle: {
    fontSize: 12,
    marginTop: 3,
  },

  focusCard: {
    borderWidth: 1,
    borderRadius: 22,
    overflow: "hidden",
    marginBottom: 18,
  },

  focusRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },

  focusRowBorder: {
    borderBottomWidth: 1,
  },

  focusIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  focusContent: {
    flex: 1,
  },

  focusTitle: {
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 3,
  },

  focusText: {
    fontSize: 12,
    lineHeight: 18,
  },

  completeState: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },

  completeIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  coachCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
  },

  coachIcon: {
    width: 44,
    height: 44,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  coachTitle: {
    fontSize: 21,
    fontWeight: "900",
    marginBottom: 7,
  },

  coachDescription: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 18,
  },

  primaryButton: {
    minHeight: 52,
    borderRadius: 15,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  primaryButtonText: {
    color: "#111111",
    fontSize: 14,
    fontWeight: "900",
    marginLeft: 8,
  },

  loadingCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  loadingCopy: {
    flex: 1,
    marginLeft: 12,
  },

  loadingTitle: {
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 3,
  },

  loadingText: {
    fontSize: 12,
    lineHeight: 18,
  },

  errorCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    marginBottom: 16,
  },
errorIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  errorContent: {
    flex: 1,
  },

  errorTitle: {
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 5,
  },

  errorText: {
    fontSize: 12,
    lineHeight: 18,
  },

  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    alignSelf: "flex-start",
  },

  retryText: {
    fontSize: 13,
    fontWeight: "800",
    marginRight: 5,
  },

  recommendationCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
  },

  recommendationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  recommendationIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  recommendationHeading: {
    flex: 1,
  },

  recommendationTitle: {
    fontSize: 17,
    fontWeight: "800",
  },

  recommendationText: {
    fontSize: 15,
    lineHeight: 24,
  },

  secondaryAction: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
    alignSelf: "flex-start",
  },

  secondaryActionText: {
    fontSize: 12,
    fontWeight: "800",
    marginLeft: 7,
  },

  noteCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 18,
  },

  noteText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 17,
    marginLeft: 9,
  },

  planLink: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    paddingVertical: 8,
  },

  planLinkText: {
    fontSize: 12,
    fontWeight: "700",
    marginRight: 6,
  },

  premiumIntro: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 22,
    marginBottom: 16,
  },

  aiIcon: {
    width: 56,
    height: 56,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  premiumTitle: {
    fontSize: 21,
    fontWeight: "900",
    marginBottom: 7,
  },

  premiumText: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 17,
  },

  featureList: {
    marginTop: 2,
  },

  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 11,
  },

  featureText: {
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 9,
  },
});