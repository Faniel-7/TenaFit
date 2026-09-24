import React, { useMemo, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const FOOD = {
  name: "Oatmeal",
  description: "Whole grain oats",
  servingSize: 100,
  calories: 389,
  protein: 16.9,
  carbs: 66.3,
  fat: 6.9,
  fiber: 10.6,
};

export default function FoodResultScreen() {
  const [servings, setServings] = useState(1);

  const nutrition = useMemo(
    () => ({
      calories: Math.round(FOOD.calories * servings),
      protein: (FOOD.protein * servings).toFixed(1),
      carbs: (FOOD.carbs * servings).toFixed(1),
      fat: (FOOD.fat * servings).toFixed(1),
      fiber: (FOOD.fiber * servings).toFixed(1),
    }),
    [servings]
  );

  const increaseServing = () => {
    setServings((value) =>
      Math.min(5, Number((value + 0.5).toFixed(1)))
    );
  };

  const decreaseServing = () => {
    setServings((value) =>
      Math.max(0.5, Number((value - 0.5).toFixed(1)))
    );
  };

  const handleAddMeal = () => {
    // Meal-storage integration will be added in the next step.
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F7F8FA"
      />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.iconButton,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color="#111827"
          />
        </Pressable>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Food Details</Text>
          <Text style={styles.headerSubtitle}>Scanned food</Text>
        </View>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Food identity */}
        <View style={styles.foodCard}>
          <View style={styles.foodIconContainer}>
            <Ionicons
              name="nutrition-outline"
              size={42}
              color="#FFFFFF"
            />
          </View>

          <View style={styles.foodInfo}>
            <View style={styles.scannedRow}>
              <Ionicons
                name="checkmark-circle"
                size={15}
                color="#64748B"
              />

              <Text style={styles.scannedText}>
                BARCODE SCANNED
              </Text>
            </View>

            <Text style={styles.foodName}>{FOOD.name}</Text>

            <Text style={styles.foodDescription}>
              {FOOD.description}
            </Text>
          </View>
        </View>

        {/* Main calories card */}
        <View style={styles.calorieCard}>
          <View>
            <Text style={styles.overline}>CALORIES</Text>

            <View style={styles.calorieRow}>
              <Text style={styles.calorieNumber}>
                {nutrition.calories}
              </Text>

              <Text style={styles.calorieUnit}>kcal</Text>
            </View>
          </View>

          <View style={styles.calorieIcon}>
            <Ionicons
              name="flame-outline"
              size={27}
              color="#FFFFFF"
            />
          </View>
        </View>

        {/* Plan status */}
        <View style={styles.planCard}>
          <View style={styles.planIcon}>
            <Ionicons
              name="checkmark"
              size={20}
              color="#FFFFFF"
            />
          </View>

          <View style={styles.planContent}>
            <Text style={styles.planTitle}>
              Good fit for your plan
            </Text>
<Text style={styles.planDescription}>
              This food can be included in your daily
              nutrition plan based on the selected serving.
            </Text>
          </View>
        </View>

        {/* Nutrition section */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Nutrition
            </Text>

            <Text style={styles.sectionSubtitle}>
              For your selected serving
            </Text>
          </View>

          <Ionicons
            name="stats-chart-outline"
            size={20}
            color="#94A3B8"
          />
        </View>

        <View style={styles.nutritionGrid}>
          <NutritionItem
            icon="fitness-outline"
            title="Protein"
            value={nutrition.protein}
            unit="g"
          />

          <NutritionItem
            icon="flash-outline"
            title="Carbs"
            value={nutrition.carbs}
            unit="g"
          />

          <NutritionItem
            icon="water-outline"
            title="Fat"
            value={nutrition.fat}
            unit="g"
          />

          <NutritionItem
            icon="leaf-outline"
            title="Fiber"
            value={nutrition.fiber}
            unit="g"
          />
        </View>

        {/* Serving section */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Serving
            </Text>

            <Text style={styles.sectionSubtitle}>
              Adjust the amount you are eating
            </Text>
          </View>
        </View>

        <View style={styles.servingCard}>
          <View>
            <Text style={styles.servingLabel}>
              SERVINGS
            </Text>

            <View style={styles.servingRow}>
              <Text style={styles.servingValue}>
                {servings}
              </Text>

              <Text style={styles.servingUnit}>
                × {FOOD.servingSize} g
              </Text>
            </View>
          </View>

          <View style={styles.servingControls}>
            <Pressable
              onPress={decreaseServing}
              style={({ pressed }) => [
                styles.controlButton,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons
                name="remove"
                size={19}
                color="#111827"
              />
            </Pressable>

            <Pressable
              onPress={increaseServing}
              style={({ pressed }) => [
                styles.controlButton,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons
                name="add"
                size={19}
                color="#111827"
              />
            </Pressable>
          </View>
        </View>

        {/* Scan information */}
        <View style={styles.infoCard}>
          <Ionicons
            name="information-circle-outline"
            size={21}
            color="#64748B"
          />

          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>
              Nutrition information
            </Text>

            <Text style={styles.infoText}>
              TenaFit will use the scanned product's
              nutrition data together with your personal
              nutrition target.
            </Text>
          </View>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Bottom actions */}
      <View style={styles.bottomContainer}>
        <Pressable
          onPress={() => router.push("/scan")}
          style={({ pressed }) => [
            styles.secondaryButton,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons
            name="scan-outline"
            size={20}
            color="#111827"
          />
<Text style={styles.secondaryButtonText}>
            Scan Again
          </Text>
        </Pressable>

        <Pressable
          onPress={handleAddMeal}
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons
            name="add"
            size={21}
            color="#FFFFFF"
          />

          <Text style={styles.primaryButtonText}>
            Add to Meal
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function NutritionItem({
  icon,
  title,
  value,
  unit,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: string;
  unit: string;
}) {
  return (
    <View style={styles.nutritionCard}>
      <View style={styles.nutritionIcon}>
        <Ionicons
          name={icon}
          size={18}
          color="#111827"
        />
      </View>

      <Text style={styles.nutritionTitle}>
        {title}
      </Text>

      <View style={styles.nutritionValueRow}>
        <Text style={styles.nutritionValue}>
          {value}
        </Text>

        <Text style={styles.nutritionUnit}>
          {unit}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FA",
  },

  header: {
    height: 72,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },

  headerCenter: {
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111827",
  },

  headerSubtitle: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: "600",
    color: "#94A3B8",
  },

  headerSpacer: {
    width: 44,
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 8,
  },

  foodCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E8EBEF",
  },

  foodIconContainer: {
    width: 88,
    height: 88,
    borderRadius: 21,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
  },

  foodInfo: {
    flex: 1,
    marginLeft: 15,
  },

  scannedRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  scannedText: {
    marginLeft: 5,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.7,
    color: "#64748B",
  },

  foodName: {
    marginTop: 7,
    fontSize: 23,
    fontWeight: "900",
    color: "#111827",
    letterSpacing: -0.6,
  },

  foodDescription: {
    marginTop: 3,
    fontSize: 11,
    fontWeight: "500",
    color: "#94A3B8",
  },

  calorieCard: {
    marginTop: 14,
    padding: 20,
    borderRadius: 24,
    backgroundColor: "#111827",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  overline: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.2,
    color: "#94A3B8",
  },

  calorieRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 2,
  },

  calorieNumber: {
    fontSize: 43,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -1.5,
  },

  calorieUnit: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: "700",
    color: "#94A3B8",
  },

  calorieIcon: {
    width: 52,
    height: 52,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.09)",
    alignItems: "center",
    justifyContent: "center",
  },

  planCard: {
    marginTop: 14,
    padding: 15,
    borderRadius: 21,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E8EBEF",
    flexDirection: "row",
    alignItems: "center",
  },

  planIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
  },
planContent: {
    flex: 1,
    marginLeft: 12,
  },

  planTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#111827",
  },

  planDescription: {
    marginTop: 3,
    fontSize: 10.5,
    lineHeight: 16,
    color: "#64748B",
  },

  sectionHeader: {
    marginTop: 25,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: "#111827",
    letterSpacing: -0.3,
  },

  sectionSubtitle: {
    marginTop: 3,
    fontSize: 10,
    fontWeight: "600",
    color: "#94A3B8",
  },

  nutritionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
  },

  nutritionCard: {
    width: "48.5%",
    minHeight: 120,
    padding: 14,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E8EBEF",
  },

  nutritionIcon: {
    width: 35,
    height: 35,
    borderRadius: 12,
    backgroundColor: "#F1F3F5",
    alignItems: "center",
    justifyContent: "center",
  },

  nutritionTitle: {
    marginTop: 11,
    fontSize: 10,
    fontWeight: "700",
    color: "#64748B",
  },

  nutritionValueRow: {
    marginTop: 2,
    flexDirection: "row",
    alignItems: "baseline",
  },

  nutritionValue: {
    fontSize: 21,
    fontWeight: "900",
    color: "#111827",
  },

  nutritionUnit: {
    marginLeft: 4,
    fontSize: 10,
    fontWeight: "700",
    color: "#94A3B8",
  },

  servingCard: {
    padding: 15,
    borderRadius: 21,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E8EBEF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  servingLabel: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
    color: "#94A3B8",
  },

  servingRow: {
    marginTop: 2,
    flexDirection: "row",
    alignItems: "baseline",
  },

  servingValue: {
    fontSize: 25,
    fontWeight: "900",
    color: "#111827",
  },

  servingUnit: {
    marginLeft: 5,
    fontSize: 11,
    fontWeight: "600",
    color: "#64748B",
  },

  servingControls: {
    flexDirection: "row",
    gap: 8,
  },

  controlButton: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: "#F1F3F5",
    alignItems: "center",
    justifyContent: "center",
  },

  infoCard: {
    marginTop: 16,
    padding: 15,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E8EBEF",
    flexDirection: "row",
  },

  infoContent: {
    flex: 1,
    marginLeft: 10,
  },

  infoTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#111827",
  },

  infoText: {
    marginTop: 4,
    fontSize: 10,
    lineHeight: 16,
    color: "#64748B",
  },

  bottomSpace: {
    height: 120,
  },

  bottomContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 18,
    backgroundColor: "#F7F8FA",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    flexDirection: "row",
    gap: 10,
  },

  secondaryButton: {
    flex: 0.85,
    height: 54,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDE2E7",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 7,
  },

  secondaryButtonText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#111827",
  },

  primaryButton: {
    flex: 1.15,
    height: 54,
    borderRadius: 18,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 7,
  },

  primaryButtonText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
});