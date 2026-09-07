import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DashboardPage, {
  DashboardCard,
  DashboardSection,
} from "../../components/dashboard/DashboardPage";
import {
  foodDatabase,
  searchFoods,
} from "../../data/foods/foodDatabase";
import { Food } from "../../types/nutrition";

type FoodFilter = "all" | "local" | "other";

export default function MealsScreen() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] =
    useState<FoodFilter>("all");

  const foods = useMemo(() => {
    let results: Food[] = query.trim()
      ? searchFoods(query)
      : foodDatabase;

    if (filter !== "all") {
      results = results.filter(
        (food) => food.cuisine === filter
      );
    }

    return results;
  }, [query, filter]);

  return (
    <DashboardPage
      title="Meals"
      subtitle="Manage and track what you eat."
      icon="restaurant-outline"
    >
      <DashboardSection
        title="Today's Meals"
        subtitle="Your meals will be connected to your daily nutrition plan next."
      >
        <DashboardCard
          icon="sunny-outline"
          title="Breakfast"
          description="Morning meal"
          value="Not added"
        />

        <DashboardCard
          icon="restaurant-outline"
          title="Lunch"
          description="Midday meal"
          value="Not added"
        />

        <DashboardCard
          icon="moon-outline"
          title="Dinner"
          description="Evening meal"
          value="Not added"
        />

        <DashboardCard
          icon="nutrition-outline"
          title="Snack"
          description="Snacks throughout the day"
          value="Not added"
        />
      </DashboardSection>

      <DashboardSection
        title="Food Database"
        subtitle={`${foodDatabase.length} foods available`}
      >
        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={20}
            color="#737B89"
          />

          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search food..."
            placeholderTextColor="#737B89"
            style={styles.searchInput}
          />

          {query.length > 0 && (
            <TouchableOpacity
              onPress={() => setQuery("")}
            >
              <Ionicons
                name="close-circle"
                size={20}
                color="#737B89"
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.filterRow}>
          <FilterButton
            label="All"
            active={filter === "all"}
            onPress={() => setFilter("all")}
          />

          <FilterButton
            label="Ethiopian"
            active={filter === "local"}
            onPress={() => setFilter("local")}
          />

          <FilterButton
            label="International"
            active={filter === "other"}
            onPress={() => setFilter("other")}
          />
        </View>

        <View style={styles.resultHeader}>
          <Text style={styles.resultTitle}>
            Available Foods
          </Text>

          <Text style={styles.resultCount}>
            {foods.length}
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.foodRow}
        >
          {foods.map((food) => (
            <FoodCard
              key={food.id}
              food={food}
            />
          ))}
        </ScrollView>

        {foods.length === 0 && (
          <View style={styles.empty}>
            <Ionicons
              name="search-outline"
              size={30}
              color="#FFC107"
            />

            <Text style={styles.emptyTitle}>
              No foods found
            </Text>
<Text style={styles.emptyText}>
              Try another search or filter.
            </Text>
          </View>
        )}
      </DashboardSection>
    </DashboardPage>
  );
}

function FilterButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.filterButton,
        active && styles.filterButtonActive,
      ]}
    >
      <Text
        style={[
          styles.filterText,
          active && styles.filterTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function FoodCard({
  food,
}: {
  food: Food;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.foodCard}
    >
      <View style={styles.foodHeader}>
        <View style={styles.foodIcon}>
          <Ionicons
            name="nutrition-outline"
            size={22}
            color="#FFC107"
          />
        </View>

        <View
          style={[
            styles.badge,
            food.cuisine === "local"
              ? styles.localBadge
              : styles.otherBadge,
          ]}
        >
          <Text style={styles.badgeText}>
            {food.cuisine === "local"
              ? "Ethiopian"
              : "International"}
          </Text>
        </View>
      </View>

      <Text
        style={styles.foodName}
        numberOfLines={2}
      >
        {food.nameEnglish}
      </Text>

      {food.nameAmharic && (
        <Text
          style={styles.amharic}
          numberOfLines={1}
        >
          {food.nameAmharic}
        </Text>
      )}

      <View style={styles.calorieRow}>
        <Text style={styles.calories}>
          {food.calories}
        </Text>

        <Text style={styles.kcal}>
          kcal
        </Text>
      </View>

      <Text style={styles.serving}>
        per {food.servingSize}
        {food.servingUnit}
      </Text>

      <View style={styles.macroRow}>
        <Macro
          label="Protein"
          value={food.protein}
        />

        <Macro
          label="Carbs"
          value={food.carbohydrates}
        />

        <Macro
          label="Fat"
          value={food.fat}
        />
      </View>
    </TouchableOpacity>
  );
}

function Macro({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <View style={styles.macro}>
      <Text style={styles.macroValue}>
        {value}g
      </Text>

      <Text style={styles.macroLabel}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    height: 52,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#242A34",
    backgroundColor: "#10141B",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: "#FFFFFF",
    fontSize: 14,
  },

  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },

  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#242A34",
    backgroundColor: "#10141B",
  },

  filterButtonActive: {
    backgroundColor: "#FFC107",
    borderColor: "#FFC107",
  },

  filterText: {
    color: "#8F96A3",
    fontSize: 12,
    fontWeight: "800",
  },

  filterTextActive: {
    color: "#05070B",
  },

  resultHeader: {
    marginTop: 22,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  resultTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },

  resultCount: {
    color: "#FFC107",
    fontSize: 12,
    fontWeight: "900",
  },

  foodRow: {
    gap: 12,
    paddingBottom: 5,
  },

  foodCard: {
    width: 245,
    minHeight: 220,
    padding: 16,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#242A34",
    backgroundColor: "#10141B",
  },
foodHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  foodIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1D1B14",
  },

  badge: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },

  localBadge: {
    backgroundColor: "#292414",
  },

  otherBadge: {
    backgroundColor: "#171C26",
  },

  badgeText: {
    color: "#FFC107",
    fontSize: 9,
    fontWeight: "900",
  },

  foodName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
    marginTop: 15,
  },

  amharic: {
    color: "#737B89",
    fontSize: 11,
    marginTop: 4,
  },

  calorieRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 14,
  },

  calories: {
    color: "#FFC107",
    fontSize: 23,
    fontWeight: "900",
  },

  kcal: {
    color: "#FFC107",
    fontSize: 11,
    fontWeight: "800",
    marginLeft: 4,
  },

  serving: {
    color: "#737B89",
    fontSize: 10,
    marginTop: 2,
  },

  macroRow: {
    flexDirection: "row",
    gap: 14,
    marginTop: 15,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#242A34",
  },

  macro: {
    flex: 1,
  },

  macroValue: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
  },

  macroLabel: {
    color: "#737B89",
    fontSize: 9,
    marginTop: 3,
  },

  empty: {
    minHeight: 150,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#242A34",
    backgroundColor: "#10141B",
    alignItems: "center",
    justifyContent: "center",
    padding: 25,
  },

  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
    marginTop: 10,
  },

  emptyText: {
    color: "#737B89",
    fontSize: 11,
    marginTop: 5,
  },
});