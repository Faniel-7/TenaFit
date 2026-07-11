import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ScreenContainer from "../components/common/ScreenContainer";
import AppCard from "../components/cards/AppCard";
import CircularProgress from "../components/common/CircularProgress";
import BottomNav from "../components/navigation/BottomNav";
import { useTheme } from "../context/ThemeContext";

const days = [
  { d: "FRI", n: "20" },
  { d: "SAT", n: "21" },
  { d: "SUN", n: "22" },
  { d: "MON", n: "23" },
  { d: "TUE", n: "24" },
  { d: "WED", n: "25", active: true },
];

function formatTodayDate() {
  const now = new Date();
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(now);
}

export default function HomeScreen() {
  const { colors } = useTheme();
  const todayDate = formatTodayDate();

  return (
    <ScreenContainer>
      <View style={styles.topBar}>
        <View>
          <Text style={[styles.greeting, { color: colors.subtext }]}>
            Good afternoon,
          </Text>
          <Text style={[styles.name, { color: colors.text }]}>Faniel</Text>
          <Text style={[styles.planTitle, { color: colors.text }]}>
            Your nutrition plan:
          </Text>
          <Text style={[styles.planSub, { color: colors.subtext }]}>
            waiting for your goal setup and daily targets
          </Text>
        </View>

        <Pressable
          style={[
            styles.roundIcon,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Ionicons name="pulse-outline" size={20} color={colors.primary} />
        </Pressable>
      </View>

      <View style={styles.sectionTop}>
        <Text style={[styles.todayLabel, { color: colors.text }]}>Today:</Text>
        <Text style={[styles.dateLabel, { color: colors.subtext }]}>
          {todayDate}
        </Text>
      </View>

      <View style={styles.daysRow}>
        {days.map((item) => (
          <View
            key={item.n + item.d}
            style={[
              styles.dayCard,
              {
                backgroundColor: colors.card,
                borderColor: item.active ? colors.primary : colors.border,
              },
            ]}
          >
            <Text style={[styles.dayName, { color: colors.subtext }]}>
              {item.d}
            </Text>
            <Text style={[styles.dayNumber, { color: colors.text }]}>
              {item.n}
            </Text>
            <View style={styles.dotRow}>
              <View style={[styles.dot, { backgroundColor: colors.primary }]} />
              <View style={[styles.dot, { backgroundColor: "#3A3A3A" }]} />
              <View style={[styles.dot, { backgroundColor: "#3A3A3A" }]} />
            </View>
          </View>
        ))}
      </View>

      <AppCard style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              Progress:
            </Text>
            <Text style={[styles.cardSub, { color: colors.subtext }]}>
              Score based on steps, calories, protein, and hydration.
            </Text>
          </View>

          <CircularProgress
            size={118}
            strokeWidth={12}
            progress={0}
            valueText="0%"
            color={colors.primary}
            trackColor={colors.border}
            textColor={colors.text}
            subTextColor={colors.subtext}
          />
        </View>

        <View style={styles.progressLineWrap}>
          <View style={[styles.progressLine, { backgroundColor: colors.border }]}>
            <View
              style={[
                styles.progressFill,
                { backgroundColor: colors.primary, width: "0%" },
              ]}
            />
          </View>
        </View>
<View style={styles.progressStats}>
          <View>
            <Text style={[styles.bigSmall, { color: colors.primary }]}>0%</Text>
            <Text style={[styles.statCaption, { color: colors.subtext }]}>
              completed
            </Text>
          </View>
          <View style={{ marginLeft: 24 }}>
            <Text style={[styles.bigSmall, { color: colors.text }]}>0%</Text>
            <Text style={[styles.statCaption, { color: colors.subtext }]}>
              target
            </Text>
          </View>
        </View>
      </AppCard>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Numbers</Text>

      <View style={styles.grid}>
        <AppCard style={styles.gridCard}>
          <View style={styles.metricHeader}>
            <Ionicons name="walk-outline" size={18} color={colors.success} />
            <Text style={[styles.metricTitle, { color: colors.text }]}>
              Steps
            </Text>
          </View>
          <View style={[styles.metricBar, { backgroundColor: colors.border }]}>
            <View
              style={[
                styles.metricFill,
                { width: "0%", backgroundColor: colors.success },
              ]}
            />
          </View>
          <Text style={[styles.metricValue, { color: colors.success }]}>
            0
          </Text>
          <Text style={[styles.metricSub, { color: colors.subtext }]}>
            of 7 500
          </Text>
          <Text style={[styles.metricFooter, { color: colors.success }]}>
            avg 0
          </Text>
          <Text style={[styles.metricFooterSmall, { color: colors.subtext }]}>
            last 7 days
          </Text>
        </AppCard>

        <AppCard style={styles.gridCard}>
          <View style={styles.metricHeader}>
            <Ionicons name="flame-outline" size={18} color={colors.warning} />
            <Text style={[styles.metricTitle, { color: colors.text }]}>
              Calories
            </Text>
          </View>
          <View style={[styles.metricBar, { backgroundColor: colors.border }]}>
            <View
              style={[
                styles.metricFill,
                { width: "0%", backgroundColor: colors.warning },
              ]}
            />
          </View>
          <Text style={[styles.metricValue, { color: colors.warning }]}>
            0
          </Text>
          <Text style={[styles.metricSub, { color: colors.subtext }]}>
            of 2 409
          </Text>
          <Text style={[styles.metricFooter, { color: colors.warning }]}>
            avg 0
          </Text>
          <Text style={[styles.metricFooterSmall, { color: colors.subtext }]}>
            last 7 days
          </Text>
        </AppCard>

        <AppCard style={styles.gridCard}>
          <View style={styles.metricHeader}>
            <Ionicons
              name="restaurant-outline"
              size={18}
              color={colors.primary}
            />
            <Text style={[styles.metricTitle, { color: colors.text }]}>
              Protein
            </Text>
          </View>
          <View style={[styles.metricBar, { backgroundColor: colors.border }]}>
            <View
              style={[
                styles.metricFill,
                { width: "0%", backgroundColor: colors.primary },
              ]}
            />
          </View>
          <Text style={[styles.metricValue, { color: colors.primary }]}>
            0g
          </Text>
          <Text style={[styles.metricSub, { color: colors.subtext }]}>
            of 140g
          </Text>
          <Text style={[styles.metricFooter, { color: colors.primary }]}>
            on target
          </Text>
          <Text style={[styles.metricFooterSmall, { color: colors.subtext }]}>
            last 7 days
          </Text>
        </AppCard>
<AppCard style={styles.gridCard}>
          <View style={styles.metricHeader}>
            <Ionicons name="water-outline" size={18} color={colors.secondary} />
            <Text style={[styles.metricTitle, { color: colors.text }]}>
              Water
            </Text>
          </View>
          <View style={[styles.metricBar, { backgroundColor: colors.border }]}>
            <View
              style={[
                styles.metricFill,
                { width: "0%", backgroundColor: colors.secondary },
              ]}
            />
          </View>
          <Text style={[styles.metricValue, { color: colors.secondary }]}>
            0L
          </Text>
          <Text style={[styles.metricSub, { color: colors.subtext }]}>
            of 3.2L
          </Text>
          <Text style={[styles.metricFooter, { color: colors.secondary }]}>
            hydrate
          </Text>
          <Text style={[styles.metricFooterSmall, { color: colors.subtext }]}>
            last 7 days
          </Text>
        </AppCard>
      </View>

      <AppCard style={styles.aiCard}>
        <Text style={[styles.aiTitle, { color: colors.text }]}>
          AI Recommendation
        </Text>
        <Text style={[styles.aiText, { color: colors.subtext }]}>
          Your personalized recommendation will appear after you set your goals.
        </Text>
      </AppCard>

      <BottomNav activeTab="home" />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 22,
  },
  greeting: {
    fontSize: 16,
    fontWeight: "500",
  },
  name: {
    marginTop: 6,
    fontSize: 30,
    fontWeight: "900",
  },
  planTitle: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "800",
  },
  planSub: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: "500",
  },
  roundIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  sectionTop: {
    marginBottom: 16,
  },
  todayLabel: {
    fontSize: 24,
    fontWeight: "900",
  },
  dateLabel: {
    marginTop: 6,
    fontSize: 15,
    fontWeight: "600",
  },
  daysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 18,
  },
  dayCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  dayName: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.6,
  },
  dayNumber: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: "900",
  },
  dotRow: {
    flexDirection: "row",
    gap: 3,
    marginTop: 8,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  progressCard: {
    padding: 18,
    marginBottom: 18,
  },
  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: "900",
  },
  cardSub: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 19,
  },
  progressLineWrap: {
    marginTop: 16,
  },
  progressLine: {
    height: 7,
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
  },
  progressStats: {
    flexDirection: "row",
    gap: 24,
    marginTop: 14,
  },
  bigSmall: {
    fontSize: 18,
    fontWeight: "900",
  },
  statCaption: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  gridCard: {
    width: "48%",
    minHeight: 172,
  },
  metricHeader: {
    flexDirection: "row",
    alignItems: "center",
gap: 8,
    marginBottom: 10,
  },
  metricTitle: {
    fontSize: 16,
    fontWeight: "800",
  },
  metricBar: {
    height: 7,
    borderRadius: 999,
    overflow: "hidden",
    marginBottom: 14,
  },
  metricFill: {
    height: "100%",
    borderRadius: 999,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: "900",
  },
  metricSub: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "600",
  },
  metricFooter: {
    marginTop: 16,
    fontSize: 12,
    fontWeight: "800",
  },
  metricFooterSmall: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: "500",
  },
  aiCard: {
    marginTop: 18,
    marginBottom: 18,
  },
  aiTitle: {
    fontSize: 18,
    fontWeight: "900",
  },
  aiText: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
  },
});