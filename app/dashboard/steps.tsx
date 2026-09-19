import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DashboardPage, {
  DashboardCard,
  DashboardSection,
} from "../../components/dashboard/DashboardPage";
import { useAppData } from "../../context/AppDataContext";

const stepAmounts = [500, 1000, 2000, 5000];

export default function StepsScreen() {
  const { data, goals, stepsProgress, addSteps } = useAppData();

  const [addingAmount, setAddingAmount] = useState<number | null>(null);

  const remaining = Math.max(goals.steps - data.steps, 0);
  const goalReached = stepsProgress >= 1;

  const handleAddSteps = async (amount: number) => {
    if (addingAmount !== null) {
      return;
    }

    setAddingAmount(amount);

    try {
      await addSteps(amount);
    } finally {
      setAddingAmount(null);
    }
  };

  return (
    <DashboardPage
      title="Steps"
      subtitle="Track your daily movement and stay active."
      icon="walk-outline"
    >
      <DashboardSection
        title="Today's Activity"
        subtitle="Track your progress toward your daily step goal."
      >
        <DashboardCard
          icon="walk-outline"
          title="Steps completed"
          description={`${data.steps.toLocaleString()} of ${goals.steps.toLocaleString()} steps`}
          value={`${Math.round(stepsProgress * 100)}%`}
        />

        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(stepsProgress * 100, 100)}%`,
                },
              ]}
            />
          </View>

          <View style={styles.progressLabels}>
            <Text style={styles.progressText}>
              {data.steps.toLocaleString()} steps
            </Text>

            <Text style={styles.progressText}>
              {goals.steps.toLocaleString()} goal
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons
              name="walk"
              size={21}
              color="#D7F52C"
            />

            <Text style={styles.statValue}>
              {data.steps.toLocaleString()}
            </Text>

            <Text style={styles.statLabel}>
              Completed
            </Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons
              name="flag-outline"
              size={21}
              color="#FFC107"
            />

            <Text style={styles.statValue}>
              {goals.steps.toLocaleString()}
            </Text>

            <Text style={styles.statLabel}>
              Daily goal
            </Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons
              name="trending-up-outline"
              size={21}
              color="#8F96A3"
            />

            <Text style={styles.statValue}>
              {remaining.toLocaleString()}
            </Text>

            <Text style={styles.statLabel}>
              Remaining
            </Text>
          </View>
        </View>
      </DashboardSection>

      <DashboardSection
        title="Add Steps"
        subtitle="Add steps when you complete additional activity."
      >
        <View style={styles.amountGrid}>
          {stepAmounts.map((amount) => {
            const isAdding = addingAmount === amount;

            return (
              <TouchableOpacity
                key={amount}
                activeOpacity={0.8}
                onPress={() => handleAddSteps(amount)}
                disabled={addingAmount !== null}
style={[
                  styles.amountButton,
                  {
                    opacity:
                      addingAmount !== null && !isAdding
                        ? 0.55
                        : 1,
                  },
                ]}
              >
                {isAdding ? (
                  <ActivityIndicator
                    size="small"
                    color="#D7F52C"
                  />
                ) : (
                  <Ionicons
                    name="add-circle-outline"
                    size={21}
                    color="#D7F52C"
                  />
                )}

                <Text style={styles.amountText}>
                  +{amount.toLocaleString()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </DashboardSection>

      <DashboardSection
        title="Activity Status"
        subtitle="See how close you are to today's movement target."
      >
        <View style={styles.statusCard}>
          <View
            style={[
              styles.statusIcon,
              {
                backgroundColor: goalReached
                  ? "#16251D"
                  : "#1B2110",
              },
            ]}
          >
            <Ionicons
              name={
                goalReached
                  ? "checkmark-circle"
                  : "walk"
              }
              size={26}
              color={
                goalReached
                  ? "#54D68C"
                  : "#D7F52C"
              }
            />
          </View>

          <View style={styles.statusContent}>
            <Text style={styles.statusTitle}>
              {goalReached
                ? "Daily goal reached"
                : `${Math.round(
                    stepsProgress * 100
                  )}% of your goal`}
            </Text>

            <Text style={styles.statusText}>
              {goalReached
                ? "Great job staying active today."
                : `${remaining.toLocaleString()} steps remaining to reach your target.`}
            </Text>
          </View>
        </View>
      </DashboardSection>
    </DashboardPage>
  );
}

const styles = StyleSheet.create({
  progressContainer: {
    marginTop: 16,
  },

  progressTrack: {
    height: 10,
    borderRadius: 10,
    backgroundColor: "#202631",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 10,
    backgroundColor: "#D7F52C",
  },

  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },

  progressText: {
    color: "#737B89",
    fontSize: 10,
    fontWeight: "700",
  },

  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },

  statCard: {
    flex: 1,
    minHeight: 105,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#242A34",
    backgroundColor: "#10141B",
    padding: 13,
    justifyContent: "space-between",
  },

  statValue: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
    marginTop: 8,
  },

  statLabel: {
    color: "#737B89",
    fontSize: 9,
    fontWeight: "700",
    marginTop: 3,
  },

  amountGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  amountButton: {
    width: "25%",
    minWidth: 100,
    height: 58,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#242A34",
    backgroundColor: "#10141B",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 7,
  },

  amountText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
  },

  statusCard: {
    minHeight: 82,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#242A34",
    backgroundColor: "#10141B",
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  statusIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  statusContent: {
    flex: 1,
    marginLeft: 13,
  },
statusTitle: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },

  statusText: {
    color: "#737B89",
    fontSize: 10,
    marginTop: 5,
  },
});