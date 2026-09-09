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
import { Food, MealType } from "../../types/nutrition";
import { useAppData } from "../../context/AppDataContext";

type FoodFilter = "all" | "local" | "other";

const mealTypes: {
  key: MealType;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  {
    key: "breakfast",
    label: "Breakfast",
    icon: "sunny-outline",
  },
  {
    key: "lunch",
    label: "Lunch",
    icon: "restaurant-outline",
  },
  {
    key: "dinner",
    label: "Dinner",
    icon: "moon-outline",
  },
  {
    key: "snack",
    label: "Snack",
    icon: "nutrition-outline",
  },
];

export default function MealsScreen() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FoodFilter>("all");
  const [selectedMealType, setSelectedMealType] =
    useState<MealType>("breakfast");

  const { meals, addMeal, removeMeal } = useAppData();

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

  const getMealItems = (mealType: MealType) =>
    meals.filter((meal) => meal.mealType === mealType);

  const getMealCalories = (mealType: MealType) =>
    getMealItems(mealType).reduce(
      (total, meal) => total + meal.calories,
      0
    );

  const handleAddFood = async (food: Food) => {
    await addMeal(food, selectedMealType);
  };

  return (
    <DashboardPage
      title="Meals"
      subtitle="Manage and track what you eat."
      icon="restaurant-outline"
    >
      <DashboardSection
        title="Today's Meals"
        subtitle="Track the foods you have eaten today."
      >
        <View style={styles.mealTypeRow}>
          {mealTypes.map((mealType) => (
            <TouchableOpacity
              key={mealType.key}
              onPress={() =>
                setSelectedMealType(mealType.key)
              }
              style={[
                styles.mealTypeButton,
                selectedMealType === mealType.key &&
                  styles.mealTypeButtonActive,
              ]}
            >
              <Ionicons
                name={mealType.icon}
                size={16}
                color={
                  selectedMealType === mealType.key
                    ? "#05070B"
                    : "#8F96A3"
                }
              />

              <Text
                style={[
                  styles.mealTypeText,
                  selectedMealType === mealType.key &&
                    styles.mealTypeTextActive,
                ]}
              >
                {mealType.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {mealTypes.map((mealType) => {
          const items = getMealItems(mealType.key);
          const calories = getMealCalories(mealType.key);

          return (
            <View
              key={mealType.key}
              style={styles.mealBlock}
            >
              <DashboardCard
                icon={mealType.icon}
                title={mealType.label}
                description={
                  items.length > 0
                    ? `${items.length} food${
                        items.length === 1 ? "" : "s"} added`
                    : "No food added yet"
                }
                value={
                  items.length > 0
                    ? `${Math.round(calories)} kcal`
                    : "Not added"
                }
              />
                {items.length > 0 && (
                <View style={styles.mealItems}>
                  {items.map((meal) => (
                    <View
                      key={meal.id}
                      style={styles.mealItem}
                    >
                      <View style={styles.mealItemInfo}>
                        <Text
                          style={styles.mealItemName}
                          numberOfLines={1}
                        >
                          {meal.food.nameEnglish}
                        </Text>

                        <Text style={styles.mealItemMacros}>
                          {Math.round(meal.calories)} kcal ·{" "}
                          {Math.round(meal.protein)}g protein
                        </Text>
                      </View>

                      <TouchableOpacity
                        onPress={() =>
                          removeMeal(meal.id)
                        }
                        style={styles.removeButton}
                      >
                        <Ionicons
                          name="trash-outline"
                          size={17}
                          color="#FF6B6B"
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })}
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
              onAdd={() => handleAddFood(food)}
              mealType={selectedMealType}
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
  onAdd,
  mealType,
}: {
  food: Food;
  onAdd: () => void;
  mealType: MealType;
}) {
  return (
    <View style={styles.foodCard}>
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

      <TouchableOpacity
        onPress={onAdd}
        activeOpacity={0.8}
        style={styles.addButton}
      >
        <Ionicons
          name="add"
          size={17}
          color="#05070B"
        />

        <Text style={styles.addButtonText}>
          Add to {mealType}
        </Text>
      </TouchableOpacity>
    </View>
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
  mealTypeRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },

  mealTypeButton: {
    flex: 1,
    minHeight: 42,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "#242A34",
    backgroundColor: "#10141B",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },

  mealTypeButtonActive: {
    backgroundColor: "#FFC107",
    borderColor: "#FFC107",
  },

  mealTypeText: {
    color: "#8F96A3",
    fontSize: 9,
    fontWeight: "800",
  },

  mealTypeTextActive: {
    color: "#05070B",
  },

  mealBlock: {
    marginBottom: 10,
  },

  mealItems: {
    marginTop: -2,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#242A34",
    borderRadius: 14,
    backgroundColor: "#0C1016",
    overflow: "hidden",
  },

  mealItem: {
    minHeight: 52,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#242A34",
  },

  mealItemInfo: {
    flex: 1,
    marginRight: 10,
  },

  mealItemName: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },

  mealItemMacros: {
    color: "#737B89",
    fontSize: 9,
    marginTop: 4,
  },
removeButton: {
    width: 34,
    height: 34,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1C1215",
  },

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
    minHeight: 265,
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

  addButton: {
    height: 38,
    marginTop: 15,
    borderRadius: 10,
    backgroundColor: "#FFC107",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },

  addButtonText: {
    color: "#05070B",
    fontSize: 11,
    fontWeight: "900",
    textTransform: "capitalize",
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