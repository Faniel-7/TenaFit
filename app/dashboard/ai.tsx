import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../../context/ThemeContext";
import { usePremium } from "../../context/PremiumContext";
import { useAppData } from "../../context/AppDataContext";
import { getAIRecommendation } from "../../lib/ai";
import PremiumGate from "../../components/premium/PremiumGate";
import { getUserProfile } from "../../storage/profileStorage";
import { calculateNutritionTarget } from "../../logic/nutritionCalculator";

export default function AIScreen() {
  const theme = useTheme();
  const colors = {
    ...theme.colors,
    muted: theme.colors.subtext ?? theme.colors.text,
  };
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
  } = useAppData();

  const router = useRouter();
  const [recommendation, setRecommendation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateRecommendation = async () => {
    setLoading(true);
    setError("");

    try {
      const profile = await getUserProfile();

      if (!profile) {
        throw new Error("Your profile information could not be found.");
      }

      const nutritionTarget = calculateNutritionTarget(profile);

      const result = await getAIRecommendation({
        profile,
        nutritionTarget,
        caloriesConsumed: data.calories,
        proteinConsumed: data.protein,
        carbohydratesConsumed: data.carbs,
        fatConsumed: data.fat,
        waterConsumed: data.water,
        steps: data.steps,
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
      <View style={[styles.loadingScreen, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!isPremium) {
    return (
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: colors.background },
        ]}
      >
        <View style={styles.header}>
          <Text style={[styles.eyebrow, { color: colors.primary }]}>
            PREMIUM
          </Text>
          <Text style={[styles.title, { color: colors.text }]}>
            AI Nutrition Coach
          </Text>
          <Text style={[styles.subtitle, { color: colors.subtext }]}>
            Get personalized nutrition guidance based on your TenaFit profile
            and today's progress.
          </Text>
        </View>

        <PremiumGate
          title="Unlock Your AI Coach"
          description="Activate TenaFit Premium to receive personalized nutrition recommendations."
        >
          <Text style={{ display: "none" }}>Unlock premium AI nutrition guidance.</Text>
        </PremiumGate>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.eyebrow, { color: colors.primary }]}>
          PREMIUM
        </Text>

        <Text style={[styles.title, { color: colors.text }]}>
          AI Nutrition Coach
        </Text>

        <Text style={[styles.subtitle, { color: colors.muted }]}>
          Personalized advice based on your nutrition targets and today's
          progress.
        </Text>
      </View>

      <View
        style={[
          styles.summaryCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          Today's progress
        </Text>
<View style={styles.statsGrid}>
          <Stat
            label="Calories"
            value={`${data.calories}`}
            target={`${goals.calories}`}
            progress={calorieProgress}
            colors={colors}
          />

          <Stat
            label="Protein"
            value={`${data.protein} g`}
            target={`${goals.protein} g`}
            progress={proteinProgress}
            colors={colors}
          />

          <Stat
            label="Carbs"
            value={`${data.carbs} g`}
            target={`${goals.carbs} g`}
            progress={carbsProgress}
            colors={colors}
          />

          <Stat
            label="Fat"
            value={`${data.fat} g`}
            target={`${goals.fat} g`}
            progress={fatProgress}
            colors={colors}
          />

          <Stat
            label="Water"
            value={`${data.water.toFixed(1)} L`}
            target={`${goals.water} L`}
            progress={waterProgress}
            colors={colors}
          />

          <Stat
            label="Steps"
            value={`${data.steps}`}
            target={`${goals.steps}`}
            progress={stepsProgress}
            colors={colors}
          />
        </View>
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
        <Text style={[styles.coachTitle, { color: colors.text }]}>
          Ask your AI coach
        </Text>

        <Text style={[styles.coachDescription, { color: colors.muted }]}>
          TenaFit will analyze your current progress and tell you what to
          prioritize for the rest of the day.
        </Text>

        <View
          style={[
            styles.button,
            { backgroundColor: colors.primary },
          ]}
          onTouchEnd={generateRecommendation}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>
              {recommendation ? "Generate Again" : "Get Recommendation"}
            </Text>
          )}
        </View>
      </View>

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
          <Text style={[styles.errorTitle, { color: colors.text }]}>
            Unable to generate recommendation
          </Text>

          <Text style={[styles.errorText, { color: colors.muted }]}>
            {error}
          </Text>
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
          <View style={styles.recommendationHeader}>
            <Text style={styles.star}>★</Text>

            <Text style={[styles.recommendationTitle, { color: colors.text }]}>
              Your recommendation
            </Text>
          </View>

          <Text style={[styles.recommendationText, { color: colors.text }]}>
            {recommendation}
          </Text>
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
        <Text style={[styles.noteTitle, { color: colors.text }]}>
          TenaFit AI
        </Text>

        <Text style={[styles.noteText, { color: colors.muted }]}>
          Recommendations are generated from your TenaFit profile and daily
          tracking data. They are intended for general nutrition guidance and
          not medical diagnosis.
        </Text>
      </View>
    </ScrollView>
  );
}
interface StatProps {
  label: string;
  value: string;
  target: string;
  progress: number;
  colors: {
    text: string;
    muted: string;
    border: string;
    primary: string;
    background: string;
    card: string;
  };
}

function Stat({ label, value, target, progress, colors }: StatProps) {
  const percentage = Math.min(progress * 100, 100);

  return (
    <View style={styles.stat}>
      <Text style={[styles.statLabel, { color: colors.muted }]}>
        {label}
      </Text>

      <Text style={[styles.statValue, { color: colors.text }]}>
        {value}
      </Text>

      <Text style={[styles.statTarget, { color: colors.muted }]}>
        / {target}
      </Text>

      <View
        style={[
          styles.progressTrack,
          { backgroundColor: colors.background },
        ]}
      >
        <View
          style={[
            styles.progressFill,
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

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  summaryCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  stat: {
    width: "47%",
    minWidth: 140,
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
  },
  statTarget: {
    fontSize: 12,
    marginTop: 2,
    marginBottom: 8,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  coachCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  coachTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  coachDescription: {
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 20,
  },
  button: {
    minHeight: 50,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  errorCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  errorText: {
    fontSize: 14,
    lineHeight: 20,
  },
  recommendationCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  recommendationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  star: {
    fontSize: 20,
    marginRight: 8,
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  recommendationText: {
    fontSize: 15,
    lineHeight: 24,
  },
  noteCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
  },
  noteTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 6,
  },
  noteText: {
    fontSize: 12,
    lineHeight: 18,
  },
});