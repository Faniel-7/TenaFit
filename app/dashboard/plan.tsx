import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getUserProfile } from "../../storage/profileStorage";
import { UserProfile } from "../../types/userProfile";
import {
  createDailyPlan,
  DailyPlan,
  PlannedMeal,
} from "../../logic/mealPlanner";

const mealIcons: Record<
  PlannedMeal["meal"],
  keyof typeof Ionicons.glyphMap
> = {
  breakfast: "sunny-outline",
  lunch: "restaurant-outline",
  dinner: "moon-outline",
  snack: "nutrition-outline",
};

export default function PlanScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [plan, setPlan] = useState<DailyPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadPlan = async () => {
      try {
        const savedProfile = await getUserProfile();

        if (!mounted) {
          return;
        }

        if (!savedProfile) {
          router.replace("/onboarding/personal-info");
          return;
        }

        setProfile(savedProfile);
        setPlan(createDailyPlan(savedProfile));
      } catch (error) {
        console.error("Failed to create daily plan:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadPlan();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading || !profile || !plan) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons
          name="nutrition-outline"
          size={38}
          color="#FFC107"
        />

        <Text style={styles.loadingTitle}>
          Building your plan
        </Text>

        <Text style={styles.loadingText}>
          Creating recommendations from your profile.
        </Text>
      </View>
    );
  }

  const goalText =
    profile.goal === "lose"
      ? "weight loss"
      : profile.goal === "gain"
        ? "weight gain"
        : "maintenance";

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>
              TODAY'S PLAN
            </Text>

            <Text style={styles.title}>
              Your Daily Plan
            </Text>

            <Text style={styles.subtitle}>
              Personalized for your {goalText} goal.
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
              DAILY CALORIE TARGET
            </Text>

            <Text style={styles.calories}>
              {plan.targetCalories} kcal
            </Text>

            <Text style={styles.targetDescription}>
              Your target is calculated from your age,
              body measurements, activity level and goal.
            </Text>
          </View>
        </View>

        <View style={styles.macroGrid}>
          <MacroCard
            icon="fitness-outline"
            label="Protein"
            value={`${plan.targetProtein}g`}
          />

          <MacroCard
            icon="leaf-outline"
            label="Carbs"
            value={`${plan.targetCarbohydrates}g`}
          />

          <MacroCard
            icon="water-outline"
            label="Fat"
            value={`${plan.targetFat}g`}
          />

          <MacroCard
            icon="nutrition-outline"
            label="Fiber"
            value={`${plan.targetFiber}g`}
          />
        </View>

        <SectionHeader
          title="Recommended Meals"
          subtitle="Portions are calculated from your daily nutrition target."
        />

        {plan.meals.map((meal) => (
          <MealRecommendationCard
            key={meal.meal}
            meal={meal}
          />
        ))}

        <View style={styles.dailySummary}>
          <View>
            <Text style={styles.summaryLabel}>
              PLAN TOTAL
            </Text>

            <Text style={styles.summaryTitle}>
              {plan.totalCalories} kcal
            </Text>
          </View>

          <View style={styles.summaryRight}>
            <Text style={styles.summaryTarget}>
              Target
            </Text>

            <Text style={styles.summaryTargetValue}>
              {plan.targetCalories} kcal
            </Text>
          </View>
        </View>

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
              Workout recommendations will use your
              activity level and weekly commitment.
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color="#6B7280"
          />
        </View>

        <SectionHeader
          title="Daily Checklist"
          subtitle="Stay on track today"
        />

        <ChecklistItem
          icon="restaurant-outline"
          title="Complete your recommended meals"
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

        <Pressable
          style={styles.backButton}
          onPress={() => router.replace("/home")}
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

function MacroCard({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.macroCard}>
      <Ionicons
        name={icon}
        size={19}
        color="#FFC107"
      />

      <Text style={styles.macroValue}>
        {value}
      </Text>

      <Text style={styles.macroLabel}>
        {label}
      </Text>
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

function MealRecommendationCard({
  meal,
}: {
  meal: PlannedMeal;
}) {
  return (
    <View style={styles.mealCard}>
      <View style={styles.mealHeader}>
        <View style={styles.mealIcon}>
          <Ionicons
            name={mealIcons[meal.meal]}
            size={23}
            color="#FFC107"
          />
        </View>
<View style={styles.mealInfo}>
          <Text style={styles.mealTitle}>
            {meal.title}
          </Text>

          <Text style={styles.mealCalories}>
            {meal.calories} kcal
          </Text>
        </View>

        <View style={styles.mealTarget}>
          <Text style={styles.mealTargetLabel}>
            TARGET
          </Text>

          <Text style={styles.mealTargetValue}>
            {meal.targetCalories} kcal
          </Text>
        </View>
      </View>

      <View style={styles.foodList}>
        {meal.portions.map((portion) => (
          <View
            key={portion.food.id}
            style={styles.foodItem}
          >
            <View style={styles.foodDot} />

            <View style={styles.foodInfo}>
              <Text style={styles.foodName}>
                {portion.food.nameEnglish}
              </Text>

              <Text style={styles.foodDetails}>
                {portion.grams} g · {portion.nutrition.calories} kcal ·{" "}
                {portion.nutrition.protein}g protein
              </Text>
            </View>
          </View>
        ))}

        {meal.portions.length === 0 && (
          <Text style={styles.noFoodText}>
            No suitable foods found for this meal.
          </Text>
        )}
      </View>

      <View style={styles.mealMacros}>
        <MacroValue
          label="Protein"
          value={`${meal.protein}g`}
        />

        <MacroValue
          label="Carbs"
          value={`${meal.carbohydrates}g`}
        />

        <MacroValue
          label="Fat"
          value={`${meal.fat}g`}
        />

        <MacroValue
          label="Fiber"
          value={`${meal.fiber}g`}
        />
      </View>
    </View>
  );
}

function MacroValue({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.mealMacro}>
      <Text style={styles.mealMacroValue}>
        {value}
      </Text>

      <Text style={styles.mealMacroLabel}>
        {label}
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

  loadingContainer: {
    flex: 1,
    backgroundColor: "#05070B",
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },

  loadingTitle: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "900",
    marginTop: 15,
  },

  loadingText: {
    color: "#737B89",
    fontSize: 12,
    marginTop: 6,
    textAlign: "center",
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

  headerText: {
    flex: 1,
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
    marginLeft: 15,
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
    marginBottom: 15,
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
    fontSize: 23,
    fontWeight: "900",
    marginTop: 3,
  },

  targetDescription: {
    color: "#8F96A3",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },

  macroGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 28,
  },

  macroCard: {
    flex: 1,
    minWidth: 130,
    backgroundColor: "#10141B",
    borderWidth: 1,
    borderColor: "#242A34",
    borderRadius: 14,
    padding: 14,
  },

  macroValue: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
    marginTop: 8,
  },

  macroLabel: {
    color: "#737B89",
    fontSize: 10,
    marginTop: 3,
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

  mealCard: {
    backgroundColor: "#10141B",
    borderWidth: 1,
    borderColor: "#242A34",
    borderRadius: 17,
    padding: 16,
    marginBottom: 11,
  },

  mealHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  mealIcon: {
    width: 46,
    height: 46,
    borderRadius: 13,
    backgroundColor: "#1C1A14",
    alignItems: "center",
    justifyContent: "center",
  },

  mealInfo: {
    flex: 1,
    marginLeft: 13,
  },

  mealTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },

  mealCalories: {
    color: "#FFC107",
    fontSize: 11,
    fontWeight: "800",
    marginTop: 4,
  },

  mealTarget: {
    alignItems: "flex-end",
    marginLeft: 8,
  },

  mealTargetLabel: {
    color: "#737B89",
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 0.8,
  },

  mealTargetValue: {
    color: "#D5D8DE",
    fontSize: 10,
    fontWeight: "800",
    marginTop: 3,
  },

  foodList: {
    marginTop: 15,
    paddingTop: 13,
    borderTopWidth: 1,
    borderTopColor: "#242A34",
  },

  foodItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  foodDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#FFC107",
  },

  foodInfo: {
    flex: 1,
    marginLeft: 10,
  },

  foodName: {
    color: "#D5D8DE",
    fontSize: 12,
    fontWeight: "800",
  },

  foodDetails: {
    color: "#737B89",
    fontSize: 10,
    marginTop: 3,
  },

  noFoodText: {
    color: "#737B89",
    fontSize: 11,
  },

  mealMacros: {
    flexDirection: "row",
    gap: 15,
    paddingTop: 10,
  },

  mealMacro: {
    flex: 1,
  },

  mealMacroValue: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "900",
  },

  mealMacroLabel: {
    color: "#737B89",
    fontSize: 9,
    marginTop: 3,
  },

  dailySummary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#171A21",
    borderWidth: 1,
    borderColor: "#303540",
    borderRadius: 17,
    padding: 18,
    marginTop: 8,
    marginBottom: 27,
  },

  summaryLabel: {
    color: "#737B89",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,
  },

  summaryTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
    marginTop: 4,
  },

  summaryRight: {
    alignItems: "flex-end",
  },

  summaryTarget: {
    color: "#737B89",
    fontSize: 10,
  },

  summaryTargetValue: {
    color: "#FFC107",
    fontSize: 13,
    fontWeight: "900",
    marginTop: 3,
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