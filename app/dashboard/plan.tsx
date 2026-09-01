import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function PlanScreen() {
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* HEADER */}

        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>
              TODAY'S PLAN
            </Text>

            <Text style={styles.title}>
              Your Daily Plan
            </Text>

            <Text style={styles.subtitle}>
              Your personalized plan for today.
            </Text>
          </View>

          <View style={styles.dateBadge}>
            <Ionicons
              name="calendar-outline"
              size={18}
              color="#FFC107"
            />

            <Text style={styles.dateText}>
              Today
            </Text>
          </View>
        </View>

        {/* DAILY TARGET */}

        <View style={styles.targetCard}>
          <View style={styles.targetIcon}>
            <Ionicons
              name="flame-outline"
              size={25}
              color="#FFC107"
            />
          </View>

          <View style={styles.targetInfo}>
            <Text style={styles.cardLabel}>
              DAILY TARGET
            </Text>

            <Text style={styles.calories}>
              Personalized
            </Text>

            <Text style={styles.targetDescription}>
              Your calorie and nutrition targets
              will appear here after the nutrition
              engine is connected.
            </Text>
          </View>
        </View>

        {/* MEALS */}

        <SectionHeader
          title="Meals"
          subtitle="Your meals for today"
        />

        <PlanItem
          icon="sunny-outline"
          title="Breakfast"
          description="Your recommended breakfast"
          status="Not planned"
        />

        <PlanItem
          icon="restaurant-outline"
          title="Lunch"
          description="Your recommended lunch"
          status="Not planned"
        />

        <PlanItem
          icon="moon-outline"
          title="Dinner"
          description="Your recommended dinner"
          status="Not planned"
        />

        <PlanItem
          icon="nutrition-outline"
          title="Snacks"
          description="Healthy snack recommendations"
          status="Not planned"
        />

        {/* WORKOUT */}

        <SectionHeader
          title="Workout"
          subtitle="Your activity for today"
        />

        <View style={styles.workoutCard}>
          <View style={styles.workoutIcon}>
            <Ionicons
              name="barbell-outline"
              size={26}
              color="#FFC107"
            />
          </View>

          <View style={styles.workoutInfo}>
            <Text style={styles.workoutTitle}>
              Today's Workout
            </Text>

            <Text style={styles.workoutDescription}>
              Your workout plan will be generated
              from your activity level and weekly
              commitment.
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color="#6B7280"
          />
        </View>

        {/* DAILY CHECKLIST */}

        <SectionHeader
          title="Daily Checklist"
          subtitle="Stay on track today"
        />

        <ChecklistItem
          icon="restaurant-outline"
          title="Complete your meals"
        />

        <ChecklistItem
          icon="water-outline"
          title="Reach your water goal"
        />

        <ChecklistItem
          icon="barbell-outline"
          title="Complete your workout"
        />

        <ChecklistItem
          icon="checkmark-circle-outline"
          title="Stay within your daily targets"
        />

        {/* BACK */}
<Pressable
          style={styles.backButton}
          onPress={() =>
            router.replace("/home")
          }
        >
          <Ionicons
            name="arrow-back"
            size={18}
            color="#FFC107"
          />

          <Text style={styles.backText}>
            Back to Home
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>
        {title}
      </Text>

      <Text style={styles.sectionSubtitle}>
        {subtitle}
      </Text>
    </View>
  );
}

function PlanItem({
  icon,
  title,
  description,
  status,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  status: string;
}) {
  return (
    <View style={styles.planItem}>
      <View style={styles.planIcon}>
        <Ionicons
          name={icon}
          size={23}
          color="#FFC107"
        />
      </View>

      <View style={styles.planInfo}>
        <Text style={styles.planTitle}>
          {title}
        </Text>

        <Text style={styles.planDescription}>
          {description}
        </Text>
      </View>

      <Text style={styles.planStatus}>
        {status}
      </Text>
    </View>
  );
}

function ChecklistItem({
  icon,
  title,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
}) {
  return (
    <View style={styles.checkItem}>
      <Ionicons
        name={icon}
        size={22}
        color="#6B7280"
      />

      <Text style={styles.checkText}>
        {title}
      </Text>

      <View style={styles.emptyCircle} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05070B",
  },

  content: {
    padding: 28,
    paddingBottom: 50,
    maxWidth: 1100,
    width: "100%",
    alignSelf: "center",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 28,
  },

  eyebrow: {
    color: "#FFC107",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.4,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
    marginTop: 5,
  },

  subtitle: {
    color: "#8F96A3",
    fontSize: 14,
    marginTop: 5,
  },

  dateBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: "#151922",
    borderWidth: 1,
    borderColor: "#2A2F3A",
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 10,
  },

  dateText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },

  targetCard: {
    flexDirection: "row",
    backgroundColor: "#11151D",
    borderWidth: 1,
    borderColor: "#2A2F3A",
    borderRadius: 18,
    padding: 20,
    marginBottom: 30,
  },

  targetIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#211D12",
    alignItems: "center",
    justifyContent: "center",
  },

  targetInfo: {
    flex: 1,
    marginLeft: 15,
  },

  cardLabel: {
    color: "#8F96A3",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
  },

  calories: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
    marginTop: 3,
  },

  targetDescription: {
    color: "#8F96A3",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },

  sectionHeader: {
    marginBottom: 12,
    marginTop: 8,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "900",
  },

  sectionSubtitle: {
    color: "#737B89",
    fontSize: 12,
    marginTop: 3,
  },

  planItem: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#10141B",
    borderWidth: 1,
    borderColor: "#242A34",
    borderRadius: 14,
    paddingHorizontal: 15,
    marginBottom: 9,
  },

  planIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#1C1A14",
    alignItems: "center",
    justifyContent: "center",
  },
planInfo: {
    flex: 1,
    marginLeft: 13,
  },

  planTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },

  planDescription: {
    color: "#737B89",
    fontSize: 11,
    marginTop: 3,
  },

  planStatus: {
    color: "#737B89",
    fontSize: 10,
    fontWeight: "700",
    marginLeft: 8,
  },

  workoutCard: {
    minHeight: 82,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#10141B",
    borderWidth: 1,
    borderColor: "#242A34",
    borderRadius: 15,
    padding: 15,
    marginBottom: 25,
  },

  workoutIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#1C1A14",
    alignItems: "center",
    justifyContent: "center",
  },

  workoutInfo: {
    flex: 1,
    marginLeft: 14,
  },

  workoutTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },

  workoutDescription: {
    color: "#737B89",
    fontSize: 11,
    lineHeight: 17,
    marginTop: 4,
  },

  checkItem: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#10141B",
    borderWidth: 1,
    borderColor: "#242A34",
    borderRadius: 13,
    paddingHorizontal: 15,
    marginBottom: 8,
  },

  checkText: {
    flex: 1,
    color: "#D5D8DE",
    fontSize: 13,
    fontWeight: "700",
    marginLeft: 12,
  },

  emptyCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#454B57",
  },

  backButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 25,
    paddingVertical: 10,
  },

  backText: {
    color: "#FFC107",
    fontSize: 13,
    fontWeight: "800",
  },
});