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
import DashboardPage from "../../components/dashboard/DashboardPage";
import { foodDatabase, searchFoods } from "../../data/foods/foodDatabase";
import { Food, MealType } from "../../types/nutrition";
import { useAppData } from "../../context/AppDataContext";
import { useTheme } from "../../context/ThemeContext";

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
  const { colors } = useTheme();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FoodFilter>("all");
  const [selectedMealType, setSelectedMealType] =
    useState<MealType>("breakfast");

  const { meals, addMeal, removeMeal, data, goals } = useAppData();

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

  const caloriesProgress = Math.min(
    data.calories / Math.max(goals.calories, 1),
    1
  );

  return (
    <DashboardPage
      title="Meals"
      subtitle="Track your meals and build better eating habits."
      icon="restaurant-outline"
    >
      <View
        style={[
          styles.summaryCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.summaryTop}>
          <View>
            <Text
              style={[
                styles.summaryEyebrow,
                { color: colors.primary },
              ]}
            >
              TODAY'S NUTRITION
            </Text>

            <Text
              style={[
                styles.summaryTitle,
                { color: colors.text },
              ]}
            >
              {Math.round(data.calories)} kcal
            </Text>

            <Text
              style={[
                styles.summarySubtitle,
                { color: colors.subtext },
              ]}
            >
              of {Math.round(goals.calories)} kcal daily target
            </Text>
          </View>

          <View
            style={[
              styles.summaryIcon,
              { backgroundColor: colors.background },
            ]}
          >
            <Ionicons
              name="flame-outline"
              size={27}
              color={colors.primary}
            />
          </View>
        </View>

        <View
          style={[
            styles.progressTrack,
            { backgroundColor: colors.border },
          ]}
        >
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.round(
                  caloriesProgress * 100
                )}%`,
                backgroundColor: colors.primary,
              },
            ]}
          />
        </View>
        <View style={styles.summaryStats}>
          <SummaryStat
            label="Protein"
            value={`${Math.round(data.protein)}g`}
            target={`${Math.round(goals.protein)}g`}
            colors={colors}
          />

          <SummaryStat
            label="Carbs"
            value={`${Math.round(data.carbs)}g`}
            target={`${Math.round(goals.carbs)}g`}
            colors={colors}
          />

          <SummaryStat
            label="Fat"
            value={`${Math.round(data.fat)}g`}
            target={`${Math.round(goals.fat)}g`}
            colors={colors}
          />
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeading}>
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.text },
            ]}
          >
            Today's meals
          </Text>

          <Text
            style={[
              styles.sectionSubtitle,
              { color: colors.subtext },
            ]}
          >
            Organize everything you've eaten today.
          </Text>
        </View>

        <View
          style={[
            styles.mealCount,
            { backgroundColor: colors.card },
          ]}
        >
          <Text
            style={[
              styles.mealCountText,
              { color: colors.primary },
            ]}
          >
            {meals.length}
          </Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.mealTypeScroll}
      >
        {mealTypes.map((mealType) => {
          const active =
            selectedMealType === mealType.key;
          const count = getMealItems(mealType.key).length;

          return (
            <TouchableOpacity
              key={mealType.key}
              onPress={() =>
                setSelectedMealType(mealType.key)
              }
              activeOpacity={0.8}
              style={[
                styles.mealTypeButton,
                {
                  backgroundColor: active
                    ? colors.primary
                    : colors.card,
                  borderColor: active
                    ? colors.primary
                    : colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.mealTypeIcon,
                  {
                    backgroundColor: active
                      ? "rgba(0,0,0,0.10)"
                      : colors.background,
                  },
                ]}
              >
                <Ionicons
                  name={mealType.icon}
                  size={17}
                  color={
                    active
                      ? "#05070B"
                      : colors.subtext
                  }
                />
              </View>

              <View>
                <Text
                  style={[
                    styles.mealTypeLabel,
                    {
                      color: active
                        ? "#05070B"
                        : colors.text,
                    },
                  ]}
                >
                  {mealType.label}
                </Text>

                <Text
                  style={[
                    styles.mealTypeCount,
                    {
                      color: active
                        ? "rgba(5,7,11,0.65)"
                        : colors.subtext,
                    },
                  ]}
                >
                  {count} {count === 1 ? "food" : "foods"}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.mealSections}>
        {mealTypes.map((mealType) => {
          const items = getMealItems(mealType.key);
          const calories = getMealCalories(mealType.key);
          const active =
            selectedMealType === mealType.key;
return (
            <View
              key={mealType.key}
              style={[
                styles.mealSection,
                active && styles.activeMealSection,
              ]}
            >
              <View style={styles.mealSectionHeader}>
                <View style={styles.mealSectionTitleRow}>
                  <View
                    style={[
                      styles.mealSectionIcon,
                      {
                        backgroundColor:
                          colors.card,
                        borderColor:
                          colors.border,
                      },
                    ]}
                  >
                    <Ionicons
                      name={mealType.icon}
                      size={18}
                      color={colors.primary}
                    />
                  </View>

                  <View>
                    <Text
                      style={[
                        styles.mealSectionTitle,
                        { color: colors.text },
                      ]}
                    >
                      {mealType.label}
                    </Text>

                    <Text
                      style={[
                        styles.mealSectionSubtitle,
                        { color: colors.subtext },
                      ]}
                    >
                      {items.length > 0
                        ? `${items.length} ${
                            items.length === 1 ? "food" : "foods"
                          } logged`
                        : "Nothing logged yet"}
                    </Text>
                  </View>
                </View>

                <View style={styles.mealSectionRight}>
                  <Text
                    style={[
                      styles.mealCalories,
                      { color: colors.primary },
                    ]}
                  >
                    {Math.round(calories)}
                  </Text>

                  <Text
                    style={[
                      styles.mealCaloriesUnit,
                      { color: colors.subtext },
                    ]}
                  >
                    kcal
                  </Text>
                </View>
              </View>

              {items.length > 0 ? (
                <View
                  style={[
                    styles.mealItems,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  {items.map((meal, index) => (
                    <View
                      key={meal.id}
                      style={[
                        styles.mealItem,
                        index < items.length - 1 && {
                          borderBottomWidth: 1,
                          borderBottomColor:
                            colors.border,
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.foodMiniIcon,
                          {
                            backgroundColor:
                              colors.background,
                          },
                        ]}
                      >
                        <Ionicons
                          name="nutrition-outline"
                          size={18}
                          color={colors.primary}
                        />
                      </View>

                      <View
                        style={styles.mealItemInfo}
                      >
                        <Text
                          style={[
styles.mealItemName,
                            { color: colors.text },
                          ]}
                          numberOfLines={1}
                        >
                          {meal.food.nameEnglish}
                        </Text>

                        <Text
                          style={[
                            styles.mealItemMacros,
                            { color: colors.subtext },
                          ]}
                        >
                          {Math.round(meal.calories)} kcal
                          {"  ·  "}
                          {Math.round(meal.protein)}g protein
                        </Text>
                      </View>

                      <TouchableOpacity
                        onPress={() =>
                          removeMeal(meal.id)
                        }
                        activeOpacity={0.8}
                        style={[
                          styles.removeButton,
                          {
                            backgroundColor:
                              colors.background,
                          },
                        ]}
                      >
                        <Ionicons
                          name="trash-outline"
                          size={17}
                          color={colors.danger}
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() =>
                    setSelectedMealType(mealType.key)
                  }
                  activeOpacity={0.8}
                  style={[
                    styles.emptyMeal,
                    {
                      backgroundColor:
                        colors.card,
                      borderColor:
                        colors.border,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.emptyMealIcon,
                      {
                        backgroundColor:
                          colors.background,
                      },
                    ]}
                  >
                    <Ionicons
                      name="add-outline"
                      size={22}
                      color={colors.primary}
                    />
                  </View>

                  <View style={styles.emptyMealText}>
                    <Text
                      style={[
                        styles.emptyMealTitle,
                        { color: colors.text },
                      ]}
                    >
                      Add a food
                    </Text>

                    <Text
                      style={[
                        styles.emptyMealSubtitle,
                        { color: colors.subtext },
                      ]}
                    >
                      Choose a food below for{" "}
                      {mealType.label.toLowerCase()}.
                    </Text>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={colors.subtext}
                  />
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </View>

      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeading}>
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.text },
            ]}
          >
            Food database
          </Text>

          <Text
            style={[
              styles.sectionSubtitle,
              { color: colors.subtext },
            ]}
          >
            Find a food and add it to your selected meal.
          </Text>
        </View>
<View
          style={[
            styles.databaseCount,
            { backgroundColor: colors.card },
          ]}
        >
          <Ionicons
            name="layers-outline"
            size={15}
            color={colors.primary}
          />

          <Text
            style={[
              styles.databaseCountText,
              { color: colors.subtext },
            ]}
          >
            {foodDatabase.length}
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <Ionicons
          name="search-outline"
          size={20}
          color={colors.subtext}
        />

        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search foods..."
          placeholderTextColor={colors.subtext}
          style={[
            styles.searchInput,
            { color: colors.text },
          ]}
        />

        {query.length > 0 && (
          <TouchableOpacity
            onPress={() => setQuery("")}
            activeOpacity={0.8}
          >
            <Ionicons
              name="close-circle"
              size={20}
              color={colors.subtext}
            />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}
      >
        <FilterButton
          label="All foods"
          icon="grid-outline"
          active={filter === "all"}
          onPress={() => setFilter("all")}
          colors={colors}
        />

        <FilterButton
          label="Ethiopian"
          icon="location-outline"
          active={filter === "local"}
          onPress={() => setFilter("local")}
          colors={colors}
        />

        <FilterButton
          label="International"
          icon="globe-outline"
          active={filter === "other"}
          onPress={() => setFilter("other")}
          colors={colors}
        />
      </ScrollView>

      <View style={styles.resultHeader}>
        <View>
          <Text
            style={[
              styles.resultTitle,
              { color: colors.text },
            ]}
          >
            Available foods
          </Text>

          <Text
            style={[
              styles.resultSubtitle,
              { color: colors.subtext },
            ]}
          >
            Adding to{" "}
            {
              mealTypes.find(
                (meal) =>
                  meal.key === selectedMealType
              )?.label
            }
          </Text>
        </View>

        <View
          style={[
            styles.resultBadge,
            { backgroundColor: colors.primary },
          ]}
        >
          <Text style={styles.resultBadgeText}>
            {foods.length}
          </Text>
        </View>
      </View>

      {foods.length > 0 ? (
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
              colors={colors}
            />
          ))}
        </ScrollView>
      ) : (
        <View
          style={[
            styles.empty,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.emptyIcon,
              { backgroundColor: colors.background },
            ]}
          >
            <Ionicons
              name="search-outline"
              size={27}
              color={colors.primary}
            />
          </View>
<Text
            style={[
              styles.emptyTitle,
              { color: colors.text },
            ]}
          >
            No foods found
          </Text>

          <Text
            style={[
              styles.emptyText,
              { color: colors.subtext },
            ]}
          >
            Try another search or change the filter.
          </Text>
        </View>
      )}
    </DashboardPage>
  );
}

function SummaryStat({
  label,
  value,
  target,
  colors,
}: {
  label: string;
  value: string;
  target: string;
  colors: any;
}) {
  return (
    <View style={styles.summaryStat}>
      <Text
        style={[
          styles.summaryStatValue,
          { color: colors.text },
        ]}
      >
        {value}
      </Text>

      <Text
        style={[
          styles.summaryStatLabel,
          { color: colors.subtext },
        ]}
      >
        {label}
      </Text>

      <Text
        style={[
          styles.summaryStatTarget,
          { color: colors.subtext },
        ]}
      >
        / {target}
      </Text>
    </View>
  );
}

function FilterButton({
  label,
  icon,
  active,
  onPress,
  colors,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  active: boolean;
  onPress: () => void;
  colors: any;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.filterButton,
        {
          backgroundColor: active
            ? colors.primary
            : colors.card,
          borderColor: active
            ? colors.primary
            : colors.border,
        },
      ]}
    >
      <Ionicons
        name={icon}
        size={15}
        color={
          active ? "#05070B" : colors.subtext
        }
      />

      <Text
        style={[
          styles.filterText,
          {
            color: active
              ? "#05070B"
              : colors.text,
          },
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
  colors,
}: {
  food: Food;
  onAdd: () => void;
  mealType: MealType;
  colors: any;
}) {
  return (
    <View
      style={[
        styles.foodCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.foodHeader}>
        <View
          style={[
            styles.foodIcon,
            { backgroundColor: colors.background },
          ]}
        >
          <Ionicons
            name="nutrition-outline"
            size={23}
            color={colors.primary}
          />
        </View>

        <View
          style={[
            styles.badge,
            {
              backgroundColor:
                food.cuisine === "local"
                  ? "rgba(215,245,44,0.12)"
                  : colors.background,
            },
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              { color: colors.primary },
            ]}
          >
            {food.cuisine === "local"
              ? "ETHIOPIAN"
              : "INTERNATIONAL"}
          </Text>
        </View>
      </View>

      <Text
        style={[
          styles.foodName,
          { color: colors.text },
        ]}
        numberOfLines={2}
      >
        {food.nameEnglish}
      </Text>

      {food.nameAmharic && (
        <Text
          style={[
            styles.amharic,
            { color: colors.subtext },
          ]}
          numberOfLines={1}
        >
          {food.nameAmharic}
        </Text>
      )}

      <View style={styles.calorieRow}>
        <Text
          style={[
            styles.calories,
            { color: colors.primary },
          ]}
        >
          {food.calories}
        </Text>

        <Text
          style={[
            styles.kcal,
            { color: colors.primary },
          ]}
        >
          kcal
        </Text>
      </View>
<Text
        style={[
          styles.serving,
          { color: colors.subtext },
        ]}
      >
        Per {food.servingSize}
        {food.servingUnit}
      </Text>

      <View
        style={[
          styles.macroRow,
          { borderTopColor: colors.border },
        ]}
      >
        <Macro
          label="Protein"
          value={food.protein}
          colors={colors}
        />

        <Macro
          label="Carbs"
          value={food.carbohydrates}
          colors={colors}
        />

        <Macro
          label="Fat"
          value={food.fat}
          colors={colors}
        />
      </View>

      <TouchableOpacity
        onPress={onAdd}
        activeOpacity={0.8}
        style={[
          styles.addButton,
          { backgroundColor: colors.primary },
        ]}
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
  colors,
}: {
  label: string;
  value: number;
  colors: any;
}) {
  return (
    <View style={styles.macro}>
      <Text
        style={[
          styles.macroValue,
          { color: colors.text },
        ]}
      >
        {Math.round(value)}g
      </Text>

      <Text
        style={[
          styles.macroLabel,
          { color: colors.subtext },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 22,
    marginBottom: 30,
  },

  summaryTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  summaryEyebrow: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.5,
  },

  summaryTitle: {
    fontSize: 32,
    fontWeight: "900",
    marginTop: 5,
  },

  summarySubtitle: {
    fontSize: 12,
    marginTop: 3,
  },

  summaryIcon: {
    width: 58,
    height: 58,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  progressTrack: {
    height: 7,
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 21,
  },

  progressFill: {
    height: "100%",
    borderRadius: 10,
  },

  summaryStats: {
    flexDirection: "row",
    marginTop: 21,
    gap: 10,
  },

  summaryStat: {
    flex: 1,
  },

  summaryStatValue: {
    fontSize: 15,
    fontWeight: "900",
  },

  summaryStatLabel: {
    fontSize: 10,
    marginTop: 3,
  },

  summaryStatTarget: {
    fontSize: 9,
    marginTop: 2,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  sectionHeading: {
    flex: 1,
    paddingRight: 12,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "900",
  },

  sectionSubtitle: {
    fontSize: 11,
    marginTop: 4,
    lineHeight: 17,
  },

  mealCount: {
    width: 39,
    height: 39,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  mealCountText: {
    fontSize: 14,
    fontWeight: "900",
  },

  mealTypeScroll: {
    gap: 10,
    paddingBottom: 18,
  },

  mealTypeButton: {
    minWidth: 145,
    borderWidth: 1,
    borderRadius: 17,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  mealTypeIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  mealTypeLabel: {
    fontSize: 12,
    fontWeight: "900",
  },

  mealTypeCount: {
    fontSize: 9,
    marginTop: 3,
  },

  mealSections: {
    gap: 12,
    marginBottom: 32,
  },

  mealSection: {
    borderRadius: 19,
  },

  activeMealSection: {
    transform: [{ scale: 1 }],
  },

  mealSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 9,
  },

  mealSectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
mealSectionIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  mealSectionTitle: {
    fontSize: 14,
    fontWeight: "900",
  },

  mealSectionSubtitle: {
    fontSize: 9,
    marginTop: 3,
  },

  mealSectionRight: {
    flexDirection: "row",
    alignItems: "baseline",
  },

  mealCalories: {
    fontSize: 17,
    fontWeight: "900",
  },

  mealCaloriesUnit: {
    fontSize: 9,
    marginLeft: 3,
  },

  mealItems: {
    borderWidth: 1,
    borderRadius: 17,
    overflow: "hidden",
  },

  mealItem: {
    minHeight: 68,
    paddingHorizontal: 13,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  foodMiniIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  mealItemInfo: {
    flex: 1,
    marginLeft: 11,
    marginRight: 9,
  },

  mealItemName: {
    fontSize: 12,
    fontWeight: "800",
  },

  mealItemMacros: {
    fontSize: 9,
    marginTop: 4,
  },

  removeButton: {
    width: 35,
    height: 35,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyMeal: {
    minHeight: 69,
    borderWidth: 1,
    borderRadius: 17,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
  },

  emptyMealIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyMealText: {
    flex: 1,
    marginLeft: 11,
  },

  emptyMealTitle: {
    fontSize: 12,
    fontWeight: "900",
  },

  emptyMealSubtitle: {
    fontSize: 9,
    marginTop: 3,
  },

  databaseCount: {
    height: 35,
    paddingHorizontal: 11,
    borderRadius: 11,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  databaseCountText: {
    fontSize: 11,
    fontWeight: "900",
  },

  searchContainer: {
    height: 55,
    borderRadius: 17,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },

  searchInput: {
    flex: 1,
    marginLeft: 11,
    fontSize: 13,
  },

  filterScroll: {
    gap: 8,
    paddingVertical: 13,
  },

  filterButton: {
    height: 38,
    paddingHorizontal: 13,
    borderRadius: 11,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  filterText: {
    fontSize: 10,
    fontWeight: "900",
  },

  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
    marginBottom: 13,
  },

  resultTitle: {
    fontSize: 15,
    fontWeight: "900",
  },

  resultSubtitle: {
    fontSize: 9,
    marginTop: 3,
  },

  resultBadge: {
    minWidth: 34,
    height: 30,
    paddingHorizontal: 9,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  resultBadgeText: {
    color: "#05070B",
    fontSize: 11,
    fontWeight: "900",
  },

  foodRow: {
    gap: 13,
    paddingBottom: 8,
  },

  foodCard: {
    width: 255,
    minHeight: 300,
    padding: 17,
    borderRadius: 20,
    borderWidth: 1,
  },

  foodHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  foodIcon: {
    width: 47,
    height: 47,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  badge: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },

  badgeText: {
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 0.3,
  },

  foodName: {
    fontSize: 16,
    fontWeight: "900",
    marginTop: 16,
    lineHeight: 20,
  },

  amharic: {
    fontSize: 10,
    marginTop: 4,
  },

  calorieRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 16,
  },

  calories: {
    fontSize: 25,
    fontWeight: "900",
  },

  kcal: {
    fontSize: 10,
    fontWeight: "900",
    marginLeft: 4,
  },

  serving: {
    fontSize: 9,
    marginTop: 2,
  },
macroRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 17,
    paddingTop: 13,
    borderTopWidth: 1,
  },

  macro: {
    flex: 1,
  },

  macroValue: {
    fontSize: 11,
    fontWeight: "900",
  },

  macroLabel: {
    fontSize: 8,
    marginTop: 3,
  },

  addButton: {
    height: 40,
    marginTop: 17,
    borderRadius: 11,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },

  addButtonText: {
    color: "#05070B",
    fontSize: 10,
    fontWeight: "900",
  },

  empty: {
    minHeight: 190,
    borderWidth: 1,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    padding: 25,
  },

  emptyIcon: {
    width: 58,
    height: 58,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyTitle: {
    fontSize: 15,
    fontWeight: "900",
    marginTop: 12,
  },

  emptyText: {
    fontSize: 10,
    marginTop: 5,
    textAlign: "center",
  },
});