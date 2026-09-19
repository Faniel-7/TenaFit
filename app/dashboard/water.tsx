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

const waterAmounts = [0.25, 0.5, 0.75, 1];

export default function WaterScreen() {
  const {
    data,
    goals,
    waterProgress,
    addWater,
  } = useAppData();

  const [addingAmount, setAddingAmount] = useState<number | null>(null);

  const remaining = Math.max(goals.water - data.water, 0);
  const goalReached = waterProgress >= 1;

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
    <DashboardPage
      title="Water"
      subtitle="Stay hydrated and track your daily water intake."
      icon="water-outline"
    >
      <DashboardSection
        title="Today's Hydration"
        subtitle="Track your water intake throughout the day."
      >
        <DashboardCard
          icon="water-outline"
          title="Water consumed"
          description={`${data.water.toFixed(2)} L of ${goals.water.toFixed(2)} L`}
          value={`${Math.round(waterProgress * 100)}%`}
        />

        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(waterProgress * 100, 100)}%`,
                },
              ]}
            />
          </View>

          <View style={styles.progressLabels}>
            <Text style={styles.progressText}>
              {data.water.toFixed(2)} L
            </Text>

            <Text style={styles.progressText}>
              {goals.water.toFixed(2)} L goal
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons
              name="water"
              size={21}
              color="#4DB8FF"
            />

            <Text style={styles.statValue}>
              {data.water.toFixed(2)} L
            </Text>

            <Text style={styles.statLabel}>
              Consumed
            </Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons
              name="flag-outline"
              size={21}
              color="#FFC107"
            />

            <Text style={styles.statValue}>
              {goals.water.toFixed(2)} L
            </Text>

            <Text style={styles.statLabel}>
              Daily goal
            </Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons
              name="alert-circle-outline"
              size={21}
              color="#8F96A3"
            />

            <Text style={styles.statValue}>
              {remaining.toFixed(2)} L
            </Text>

            <Text style={styles.statLabel}>
              Remaining
            </Text>
          </View>
        </View>
      </DashboardSection>

      <DashboardSection
        title="Add Water"
        subtitle="Choose how much water you just drank."
      >
        <View style={styles.amountGrid}>
          {waterAmounts.map((amount) => {
            const isAdding = addingAmount === amount;

            return (
              <TouchableOpacity
                key={amount}
                activeOpacity={0.8}
                onPress={() => handleAddWater(amount)}
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
                    color="#4DB8FF"
                  />
                ) : (
                  <Ionicons
                    name="water-outline"
                    size={21}
                    color="#4DB8FF"
                  />
                )}

                <Text style={styles.amountText}>
                  +{amount} L
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </DashboardSection>

      <DashboardSection
        title="Hydration Status"
        subtitle="Your progress toward today's target."
      >
        <View style={styles.statusCard}>
          <View
            style={[
              styles.statusIcon,
              {
                backgroundColor: goalReached
                  ? "#16251D"
                  : "#121E27",
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
                  ? "#54D68C"
                  : "#4DB8FF"
              }
            />
          </View>

          <View style={styles.statusContent}>
            <Text style={styles.statusTitle}>
              {goalReached
                ? "Daily goal reached"
                : `${Math.round(
                    waterProgress * 100
                  )}% of your goal`}
            </Text>

            <Text style={styles.statusText}>
              {goalReached
                ? "Great job staying hydrated today."
                : `${remaining.toFixed(
                    2
                  )} L remaining to reach your target.`}
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
    backgroundColor: "#4DB8FF",
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