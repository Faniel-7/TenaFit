import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DashboardPage, {
  DashboardCard,
  DashboardSection,
} from "../../components/dashboard/DashboardPage";
import { useAppData } from "../../context/AppDataContext";

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

  return (
    <DashboardPage
      title="Progress"
      subtitle="See how you're doing with today's nutrition and activity."
      icon="trending-up-outline"
    >
      <DashboardSection
        title="Today's Progress"
        subtitle="Your progress toward your daily targets."
      >
        <View style={styles.overallCard}>
          <View style={styles.overallIcon}>
            <Ionicons
              name="trending-up-outline"
              size={27}
              color="#FFC107"
            />
          </View>

          <View style={styles.overallContent}>
            <Text style={styles.overallTitle}>
              Daily completion
            </Text>

            <Text style={styles.overallValue}>
              {overallProgress}%
            </Text>

            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${overallProgress}%`,
                  },
                ]}
              />
            </View>
          </View>
        </View>

        <View style={styles.grid}>
          <ProgressCard
            icon="flame-outline"
            title="Calories"
            current={`${Math.round(data.calories)} kcal`}
            goal={`${Math.round(goals.calories)} kcal`}
            progress={calorieProgress}
          />

          <ProgressCard
            icon="fitness-outline"
            title="Protein"
            current={`${Math.round(data.protein)} g`}
            goal={`${Math.round(goals.protein)} g`}
            progress={proteinProgress}
          />

          <ProgressCard
            icon="nutrition-outline"
            title="Carbs"
            current={`${Math.round(data.carbs)} g`}
            goal={`${Math.round(goals.carbs)} g`}
            progress={carbsProgress}
          />

          <ProgressCard
            icon="water-outline"
            title="Water"
            current={`${data.water.toFixed(2)} L`}
            goal={`${goals.water.toFixed(2)} L`}
            progress={waterProgress}
          />

          <ProgressCard
            icon="walk-outline"
            title="Steps"
            current={`${Math.round(data.steps)}`}
            goal={`${Math.round(goals.steps)}`}
            progress={stepsProgress}
          />

          <ProgressCard
            icon="restaurant-outline"
            title="Fat"
            current={`${Math.round(data.fat)} g`}
            goal={`${Math.round(goals.fat)} g`}
            progress={fatProgress}
          />
        </View>
      </DashboardSection>

      <DashboardSection
        title="Daily Summary"
        subtitle="Your current numbers for today."
      >
        <DashboardCard
          icon="flame-outline"
          title="Calories"
          description="Calories consumed today"
          value={`${Math.round(data.calories)} / ${Math.round(
            goals.calories
          )} kcal`}
        />

        <DashboardCard
          icon="barbell-outline"
          title="Protein"
          description="Protein consumed today"
          value={`${Math.round(data.protein)} / ${Math.round(
            goals.protein
          )} g`}
        />

        <DashboardCard
          icon="water-outline"
          title="Water"
          description="Water consumed today"
          value={`${data.water.toFixed(2)} / ${goals.water.toFixed(
            2
          )} L`}
        />
        <DashboardCard
          icon="walk-outline"
          title="Steps"
          description="Steps recorded today"
          value={`${Math.round(data.steps)} / ${Math.round(
            goals.steps
          )}`}
        />
      </DashboardSection>
    </DashboardPage>
  );
}

function ProgressCard({
  icon,
  title,
  current,
  goal,
  progress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  current: string;
  goal: string;
  progress: number;
}) {
  return (
    <View style={styles.progressCard}>
      <View style={styles.cardHeader}>
        <View style={styles.cardIcon}>
          <Ionicons
            name={icon}
            size={19}
            color="#FFC107"
          />
        </View>

        <Text style={styles.cardTitle}>
          {title}
        </Text>
      </View>

      <Text style={styles.currentValue}>
        {current}
      </Text>

      <Text style={styles.goalValue}>
        Goal: {goal}
      </Text>

      <View style={styles.smallTrack}>
        <View
          style={[
            styles.smallFill,
            {
              width: `${Math.min(progress * 100, 100)}%`,
            },
          ]}
        />
      </View>

      <Text style={styles.percentage}>
        {Math.round(progress * 100)}%
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overallCard: {
    minHeight: 120,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#242A34",
    backgroundColor: "#10141B",
    padding: 17,
    flexDirection: "row",
    alignItems: "center",
  },

  overallIcon: {
    width: 55,
    height: 55,
    borderRadius: 16,
    backgroundColor: "#1D1B14",
    alignItems: "center",
    justifyContent: "center",
  },

  overallContent: {
    flex: 1,
    marginLeft: 15,
  },

  overallTitle: {
    color: "#8F96A3",
    fontSize: 11,
    fontWeight: "700",
  },

  overallValue: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "900",
    marginTop: 2,
  },

  progressTrack: {
    height: 8,
    borderRadius: 8,
    backgroundColor: "#252B35",
    overflow: "hidden",
    marginTop: 9,
  },

  progressFill: {
    height: "100%",
    borderRadius: 8,
    backgroundColor: "#FFC107",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 12,
  },

  progressCard: {
    
    width: "50%",
    minWidth: 180,
    minHeight: 145,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#242A34",
    backgroundColor: "#10141B",
    padding: 14,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  cardIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#1D1B14",
    alignItems: "center",
    justifyContent: "center",
  },

  cardTitle: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
    marginLeft: 9,
  },

  currentValue: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "900",
    marginTop: 13,
  },

  goalValue: {
    color: "#737B89",
    fontSize: 9,
    fontWeight: "700",
    marginTop: 4,
  },

  smallTrack: {
    height: 6,
    borderRadius: 6,
    backgroundColor: "#252B35",
    overflow: "hidden",
    marginTop: 12,
  },

  smallFill: {
    height: "100%",
    borderRadius: 6,
    backgroundColor: "#FFC107",
  },

  percentage: {
    color: "#FFC107",
    fontSize: 10,
    fontWeight: "900",
    marginTop: 6,
  },
});