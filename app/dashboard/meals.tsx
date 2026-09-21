import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import DashboardPage from "../../components/dashboard/DashboardPage";
import { foodDatabase, searchFoods } from "../../data/foods/foodDatabase";
import { Food, MealType } from "../../types/nutrition";
import { useAppData } from "../../context/AppDataContext";
import { useTheme } from "../../context/ThemeContext";

type FoodFilter = "all" | "local" | "other";

type IconName = keyof typeof Ionicons.glyphMap;

const mealTypes: {
  key: MealType;
  label: string;
  icon: IconName;
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

const mealAccent: Record<
  MealType,
  {
    icon: string;
    background: string;
  }
> = {
  breakfast: {
    icon: "#FFD54A",
    background: "#2A2412",
  },
  lunch: {
    icon: "#D7F52C",
    background: "#20280E",
  },
  dinner: {
    icon: "#9FA8DA",
    background: "#171A2B",
  },
  snack: {
    icon: "#67E8F9",
    background: "#10242A",
  },
};

export default function MealsScreen() {
  const { colors, isDark } = useTheme();
  const { width } = useWindowDimensions();

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FoodFilter>("all");
  const [selectedMealType, setSelectedMealType] =
    useState<MealType>("breakfast");
  const [addingFoodId, setAddingFoodId] =
    useState<string | null>(null);

  const {
    meals,
    addMeal,
    removeMeal,
    data,
    goals,
  } = useAppData();

  const isCompact = width < 390;
  const isWide = width >= 900;

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
    meals.filter(
      (meal) => meal.mealType === mealType
    );

  const getMealCalories = (mealType: MealType) =>
    getMealItems(mealType).reduce(
      (total, meal) => total + meal.calories,
      0
    );

  const consumedCalories = Math.max(
    0,
    Number(data.calories) || 0
  );

  const calorieTarget = Math.max(
    0,
    Number(goals.calories) || 0
  );

  const calorieProgress =
    calorieTarget > 0
      ? Math.min(
          consumedCalories / calorieTarget,
          1
        )
      : 0;

  const caloriesRemaining = Math.max(
    0,
    calorieTarget - consumedCalories
  );

  const handleAddFood = async (food: Food) => {
    try {
      setAddingFoodId(food.id);
      await addMeal(food, selectedMealType);
    } finally {
      setAddingFoodId(null);
    }
  };

  const selectedMealLabel =
    mealTypes.find(
      (item) => item.key === selectedMealType
    )?.label ?? "Breakfast";

  return (
    <DashboardPage
      title="Meals"
      subtitle="Track what you eat and stay aligned with your plan."
      icon="restaurant-outline"
    >
      <View
        style={[
          styles.pageContent,
          {
            maxWidth: isWide ? 1120 : 620,
          },
        ]}
      >
        <View
          style={[
            styles.heroCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.heroTop}>
            <View style={styles.heroHeading}>
<View style={styles.eyebrowRow}>
                <View
                  style={[
                    styles.eyebrowDot,
                    {
                      backgroundColor:
                        colors.primary,
                    },
                  ]}
                />

                <Text
                  style={[
                    styles.eyebrow,
                    {
                      color: colors.primary,
                    },
                  ]}
                >
                  TODAY'S NUTRITION
                </Text>
              </View>

              <Text
                style={[
                  styles.heroCalories,
                  {
                    color: colors.text,
                    fontSize: isCompact ? 29 : 34,
                  },
                ]}
              >
                {Math.round(consumedCalories)}
                <Text
                  style={[
                    styles.heroCaloriesUnit,
                    {
                      color: colors.subtext,
                    },
                  ]}
                >
                  {" "}
                  kcal
                </Text>
              </Text>

              <Text
                style={[
                  styles.heroSubtitle,
                  {
                    color: colors.subtext,
                  },
                ]}
              >
                of {Math.round(calorieTarget)} kcal daily
                target
              </Text>
            </View>

            <View
              style={[
                styles.heroIcon,
                {
                  backgroundColor: colors.primary,
                },
              ]}
            >
              <Ionicons
                name="flame"
                size={27}
                color="#111111"
              />
            </View>
          </View>

          <View style={styles.progressRow}>
            <View
              style={[
                styles.progressTrack,
                {
                  backgroundColor: isDark
                    ? "#292D34"
                    : "#E5E7EB",
                },
              ]}
            >
              {calorieProgress > 0 && (
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${calorieProgress * 100}%`,
                      backgroundColor:
                        colors.primary,
                    },
                  ]}
                />
              )}
            </View>

            <Text
              style={[
                styles.progressPercent,
                {
                  color: colors.text,
                },
              ]}
            >
              {Math.round(calorieProgress * 100)}%
            </Text>
          </View>

          <View style={styles.remainingRow}>
            <View>
              <Text
                style={[
                  styles.remainingLabel,
                  {
                    color: colors.subtext,
                  },
                ]}
              >
                REMAINING
              </Text>

              <Text
                style={[
                  styles.remainingValue,
                  {
                    color:
                      caloriesRemaining > 0
                        ? colors.primary
                        : colors.danger,
                  },
                ]}
              >
                {Math.round(caloriesRemaining)} kcal
              </Text>
            </View>

            <View
              style={[
                styles.statusPill,
                {
                  backgroundColor:
                    calorieProgress >= 1
                      ? isDark
                        ? "#2A1717"
: "#FEECEC"
                      : isDark
                        ? "#20280E"
                        : "#F1F8D2",
                },
              ]}
            >
              <Ionicons
                name={
                  calorieProgress >= 1
                    ? "checkmark-circle-outline"
                    : "flash-outline"
                }
                size={15}
                color={
                  calorieProgress >= 1
                    ? colors.danger
                    : colors.primary
                }
              />

              <Text
                style={[
                  styles.statusText,
                  {
                    color:
                      calorieProgress >= 1
                        ? colors.danger
                        : colors.primary,
                  },
                ]}
              >
                {calorieProgress >= 1
                  ? "Target reached"
                  : "On track"}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.macroSummary,
              {
                borderTopColor: colors.border,
              },
            ]}
          >
            <NutritionStat
              icon="fitness-outline"
              label="Protein"
              value={`${Math.round(data.protein)}g`}
              target={`${Math.round(goals.protein)}g`}
              color="#F97316"
              colors={colors}
            />

            <NutritionStat
              icon="leaf-outline"
              label="Carbs"
              value={`${Math.round(data.carbs)}g`}
              target={`${Math.round(goals.carbs)}g`}
              color="#22C55E"
              colors={colors}
            />

            <NutritionStat
              icon="water-outline"
              label="Fat"
              value={`${Math.round(data.fat)}g`}
              target={`${Math.round(goals.fat)}g`}
              color="#38BDF8"
              colors={colors}
            />
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <View style={styles.sectionText}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              Today's meals
            </Text>

            <Text
              style={[
                styles.sectionSubtitle,
                {
                  color: colors.subtext,
                },
              ]}
            >
              Your food log for today.
            </Text>
          </View>

          <View
            style={[
              styles.countBadge,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons
              name="restaurant-outline"
              size={14}
              color={colors.primary}
            />

            <Text
              style={[
                styles.countBadgeText,
                {
                  color: colors.text,
                },
              ]}
            >
              {meals.length}
            </Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={
            styles.mealTypeScroll
          }
        >
          {mealTypes.map((mealType) => {
            const active =
              selectedMealType === mealType.key;
            const count =
              getMealItems(mealType.key).length;
            const accent =
              mealAccent[mealType.key];

            return (
              <Pressable
                key={mealType.key}
onPress={() =>
                  setSelectedMealType(
                    mealType.key
                  )
                }
                style={({ pressed }) => [
                  styles.mealTypeButton,
                  {
                    backgroundColor: active
                      ? colors.primary
                      : colors.card,
                    borderColor: active
                      ? colors.primary
                      : colors.border,
                    opacity: pressed ? 0.75 : 1,
                  },
                ]}
              >
                <View
                  style={[
                    styles.mealTypeIcon,
                    {
                      backgroundColor: active
                        ? "rgba(0,0,0,0.10)"
                        : isDark
                          ? accent.background
                          : "#F3F4F6",
                    },
                  ]}
                >
                  <Ionicons
                    name={mealType.icon}
                    size={17}
                    color={
                      active
                        ? "#111111"
                        : accent.icon
                    }
                  />
                </View>

                <View>
                  <Text
                    style={[
                      styles.mealTypeLabel,
                      {
                        color: active
                          ? "#111111"
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
                          ? "rgba(17,17,17,0.62)"
                          : colors.subtext,
                      },
                    ]}
                  >
                    {count}{" "}
                    {count === 1
                      ? "food"
                      : "foods"}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.mealSections}>
          {mealTypes.map((mealType) => {
            const items =
              getMealItems(mealType.key);
            const calories =
              getMealCalories(mealType.key);
            const active =
              selectedMealType === mealType.key;
            const accent =
              mealAccent[mealType.key];

            return (
              <View
                key={mealType.key}
                style={[
                  styles.mealSection,
                  active && {
                    borderColor:
                      colors.primary,
                  },
                ]}
              >
                <View style={styles.mealSectionHeader}>
                  <View
                    style={
                      styles.mealSectionHeading
                    }
                  >
                    <View
                      style={[
                        styles.mealSectionIcon,
                        {
                          backgroundColor:
                            isDark
                              ? accent.background
                              : "#F3F4F6",
                        },
                      ]}
                    >
                      <Ionicons
                        name={mealType.icon}
                        size={19}
                        color={accent.icon}
                      />
                    </View>

                    <View
                      style={styles.mealSectionInfo}
                    >
                      <View
style={
                          styles.mealSectionTitleRow
                        }
                      >
                        <Text
                          style={[
                            styles.mealSectionTitle,
                            {
                              color:
                                colors.text,
                            },
                          ]}
                        >
                          {mealType.label}
                        </Text>

                        {active && (
                          <View
                            style={[
                              styles.activeDot,
                              {
                                backgroundColor:
                                  colors.primary,
                              },
                            ]}
                          />
                        )}
                      </View>

                      <Text
                        style={[
                          styles.mealSectionSubtitle,
                          {
                            color:
                              colors.subtext,
                          },
                        ]}
                      >
                        {items.length > 0
                          ? `${items.length} ${
                              items.length ===
                              1
                                ? "food"
                                : "foods"
                            } logged`
                          : "Nothing logged yet"}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={
                      styles.mealCaloriesBlock
                    }
                  >
                    <Text
                      style={[
                        styles.mealCalories,
                        {
                          color:
                            colors.primary,
                        },
                      ]}
                    >
                      {Math.round(calories)}
                    </Text>

                    <Text
                      style={[
                        styles.mealCaloriesUnit,
                        {
                          color:
                            colors.subtext,
                        },
                      ]}
                    >
                      kcal
                    </Text>
                  </View>
                </View>

                {items.length > 0 ? (
                  <View
                    style={[
                      styles.loggedFoods,
                      {
                        backgroundColor:
                          isDark
                            ? "#111317"
                            : "#F8F8F8",
                        borderColor:
                          colors.border,
                      },
                    ]}
                  >
                    {items.map((meal, index) => (
                      <View
                        key={meal.id}
                        style={[
                          styles.loggedFood,
                          index <
                            items.length - 1 && {
                            borderBottomWidth: 1,
                            borderBottomColor:
                              colors.border,
                          },
                        ]}
                      >
                        <View
                          style={[
                            styles.foodIcon,
                            {
                              backgroundColor:
                                colors.card,
                              borderColor:
colors.border,
                            },
                          ]}
                        >
                          <Ionicons
                            name="nutrition-outline"
                            size={18}
                            color={
                              colors.primary
                            }
                          />
                        </View>

                        <View
                          style={
                            styles.loggedFoodInfo
                          }
                        >
                          <Text
                            style={[
                              styles.loggedFoodName,
                              {
                                color:
                                  colors.text,
                              },
                            ]}
                            numberOfLines={1}
                          >
                            {meal.food
                              .nameEnglish}
                          </Text>

                          <Text
                            style={[
                              styles.loggedFoodMeta,
                              {
                                color:
                                  colors.subtext,
                              },
                            ]}
                          >
                            {Math.round(
                              meal.calories
                            )}{" "}
                            kcal ·{" "}
                            {Math.round(
                              meal.protein
                            )}
                            g protein
                          </Text>
                        </View>

                        <Pressable
                          onPress={() =>
                            removeMeal(meal.id)
                          }
                          style={({ pressed }) => [
                            styles.deleteButton,
                            {
                              backgroundColor:
                                isDark
                                  ? "#241719"
                                  : "#FEECEC",
                              opacity: pressed
                                ? 0.65
                                : 1,
                            },
                          ]}
                        >
                          <Ionicons
                            name="trash-outline"
                            size={16}
                            color={
                              colors.danger
                            }
                          />
                        </Pressable>
                      </View>
                    ))}
                  </View>
                ) : (
                  <Pressable
                    onPress={() =>
                      setSelectedMealType(
                        mealType.key
                      )
                    }
                    style={({ pressed }) => [
                      styles.emptyMeal,
                      {
                        backgroundColor:
                          colors.card,
                        borderColor:
                          colors.border,
                        opacity: pressed
                          ? 0.7
                          : 1,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.emptyMealIcon,
                        {
                          backgroundColor:
                            isDark
                              ? "#20280E"
                              : "#F1F8D2",
},
                      ]}
                    >
                      <Ionicons
                        name="add"
                        size={21}
                        color={
                          colors.primary
                        }
                      />
                    </View>

                    <View
                      style={
                        styles.emptyMealInfo
                      }
                    >
                      <Text
                        style={[
                          styles.emptyMealTitle,
                          {
                            color:
                              colors.text,
                          },
                        ]}
                      >
                        Add your first food
                      </Text>

                      <Text
                        style={[
                          styles.emptyMealSubtitle,
                          {
                            color:
                              colors.subtext,
                          },
                        ]}
                      >
                        Select {mealType.label.toLowerCase()}{" "}
                        below to start logging.
                      </Text>
                    </View>

                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color={
                        colors.subtext
                      }
                    />
                  </Pressable>
                )}
              </View>
            );
          })}
        </View>

        <View style={styles.sectionHeader}>
          <View style={styles.sectionText}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              Add food
            </Text>

            <Text
              style={[
                styles.sectionSubtitle,
                {
                  color: colors.subtext,
                },
              ]}
            >
              Adding to {selectedMealLabel}
            </Text>
          </View>

          <View
            style={[
              styles.databaseBadge,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons
              name="layers-outline"
              size={14}
              color={colors.primary}
            />

            <Text
              style={[
                styles.databaseBadgeText,
                {
                  color: colors.subtext,
                },
              ]}
            >
              {foodDatabase.length}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.searchBox,
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
            placeholderTextColor={
              colors.subtext
            }
            style={[
              styles.searchInput,
              {
                color: colors.text,
              },
            ]}
            returnKeyType="search"
          />

          {query.length > 0 && (
            <Pressable
              onPress={() => setQuery("")}
            >
              <Ionicons
                name="close-circle"
                size={20}
                color={colors.subtext}
              />
            </Pressable>
          )}
        </View>
<ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={
            styles.filterScroll
          }
        >
          <FilterButton
            label="All foods"
            icon="grid-outline"
            active={filter === "all"}
            onPress={() =>
              setFilter("all")
            }
            colors={colors}
          />

          <FilterButton
            label="Ethiopian"
            icon="location-outline"
            active={filter === "local"}
            onPress={() =>
              setFilter("local")
            }
            colors={colors}
          />

          <FilterButton
            label="International"
            icon="globe-outline"
            active={filter === "other"}
            onPress={() =>
              setFilter("other")
            }
            colors={colors}
          />
        </ScrollView>

        <View style={styles.resultsHeader}>
          <View>
            <Text
              style={[
                styles.resultsTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              Available foods
            </Text>

            <Text
              style={[
                styles.resultsSubtitle,
                {
                  color: colors.subtext,
                },
              ]}
            >
              {foods.length}{" "}
              {foods.length === 1
                ? "food"
                : "foods"}{" "}
              available
            </Text>
          </View>

          <View
            style={[
              styles.resultsBadge,
              {
                backgroundColor:
                  colors.primary,
              },
            ]}
          >
            <Text style={styles.resultsBadgeText}>
              {foods.length}
            </Text>
          </View>
        </View>

        {foods.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={
              styles.foodCardsRow
            }
          >
            {foods.map((food) => (
              <FoodCard
                key={food.id}
                food={food}
                onAdd={() =>
                  handleAddFood(food)
                }
                adding={
                  addingFoodId === food.id
                }
                colors={colors}
                isDark={isDark}
              />
            ))}
          </ScrollView>
        ) : (
          <View
            style={[
              styles.emptySearch,
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
                styles.emptySearchIcon,
                {
                  backgroundColor:
                    isDark
                      ? "#20280E"
                      : "#F1F8D2",
                },
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
                styles.emptySearchTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              No foods found
            </Text>

            <Text
              style={[
                styles.emptySearchText,
                {
                  color: colors.subtext,
                },
              ]}
            >
              Try another search or switch the food
              category.
            </Text>
<Pressable
              onPress={() => {
                setQuery("");
                setFilter("all");
              }}
              style={[
                styles.clearButton,
                {
                  backgroundColor:
                    colors.primary,
                },
              ]}
            >
              <Text
                style={styles.clearButtonText}
              >
                Clear filters
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </DashboardPage>
  );
}

function NutritionStat({
  icon,
  label,
  value,
  target,
  color,
  colors,
}: {
  icon: IconName;
  label: string;
  value: string;
  target: string;
  color: string;
  colors: any;
}) {
  return (
    <View style={styles.nutritionStat}>
      <View
        style={[
          styles.nutritionIcon,
          {
            backgroundColor:
              colors.background,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={15}
          color={color}
        />
      </View>

      <View style={styles.nutritionStatInfo}>
        <Text
          style={[
            styles.nutritionStatValue,
            {
              color: colors.text,
            },
          ]}
        >
          {value}
        </Text>

        <Text
          style={[
            styles.nutritionStatLabel,
            {
              color: colors.subtext,
            },
          ]}
        >
          {label}
        </Text>
      </View>

      <Text
        style={[
          styles.nutritionStatTarget,
          {
            color: colors.subtext,
          },
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
  icon: IconName;
  active: boolean;
  onPress: () => void;
  colors: any;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.filterButton,
        {
          backgroundColor: active
            ? colors.primary
            : colors.card,
          borderColor: active
            ? colors.primary
            : colors.border,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <Ionicons
        name={icon}
        size={15}
        color={
          active
            ? "#111111"
            : colors.subtext
        }
      />

      <Text
        style={[
          styles.filterText,
          {
            color: active
              ? "#111111"
              : colors.text,
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function FoodCard({
  food,
  onAdd,
  adding,
  colors,
  isDark,
}: {
  food: Food;
  onAdd: () => void;
  adding: boolean;
  colors: any;
  isDark: boolean;
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
      <View style={styles.foodCardTop}>
        <View
          style={[
            styles.foodMainIcon,
            {
              backgroundColor: isDark
                ? "#20280E"
                : "#F1F8D2",
            },
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
            styles.cuisineBadge,
            {
              backgroundColor:
                food.cuisine === "local"
                  ? isDark
                    ? "#20280E"
                    : "#F1F8D2"
                  : colors.background,
            },
          ]}
        >
          <Ionicons
            name={
              food.cuisine === "local"
                ? "location-outline"
                : "globe-outline"
            }
            size={11}
            color={colors.primary}
          />
<Text
            style={[
              styles.cuisineBadgeText,
              {
                color: colors.primary,
              },
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
          styles.foodCardName,
          {
            color: colors.text,
          },
        ]}
        numberOfLines={2}
      >
        {food.nameEnglish}
      </Text>

      {food.nameAmharic && (
        <Text
          style={[
            styles.foodAmharic,
            {
              color: colors.subtext,
            },
          ]}
          numberOfLines={1}
        >
          {food.nameAmharic}
        </Text>
      )}

      <View style={styles.foodCaloriesRow}>
        <Text
          style={[
            styles.foodCalories,
            {
              color: colors.primary,
            },
          ]}
        >
          {food.calories}
        </Text>

        <Text
          style={[
            styles.foodCaloriesUnit,
            {
              color: colors.primary,
            },
          ]}
        >
          kcal
        </Text>
      </View>

      <Text
        style={[
          styles.servingText,
          {
            color: colors.subtext,
          },
        ]}
      >
        Per {food.servingSize}
        {food.servingUnit}
      </Text>

      <View
        style={[
          styles.foodMacros,
          {
            borderTopColor: colors.border,
          },
        ]}
      >
        <FoodMacro
          label="Protein"
          value={`${Math.round(food.protein)}g`}
          colors={colors}
        />

        <FoodMacro
          label="Carbs"
          value={`${Math.round(
            food.carbohydrates
          )}g`}
          colors={colors}
        />

        <FoodMacro
          label="Fat"
          value={`${Math.round(food.fat)}g`}
          colors={colors}
        />
      </View>

      <Pressable
        onPress={onAdd}
        disabled={adding}
        style={({ pressed }) => [
          styles.addButton,
          {
            backgroundColor:
              colors.primary,
            opacity:
              adding || pressed ? 0.65 : 1,
          },
        ]}
      >
        {adding ? (
          <ActivityIndicator
            size="small"
            color="#111111"
          />
        ) : (
          <>
            <Ionicons
              name="add"
              size={18}
              color="#111111"
            />

            <Text style={styles.addButtonText}>
              Add to {food.suitableMeals.includes(
                "breakfast"
              )
                ? "meal"
                : "meal"}
            </Text>
          </>
        )}
      </Pressable>
    </View>
  );
}

function FoodMacro({
  label,
  value,
  colors,
}: {
  label: string;
  value: string;
  colors: any;
}) {
  return (
    <View style={styles.foodMacro}>
      <Text
        style={[
          styles.foodMacroValue,
          {
            color: colors.text,
          },
        ]}
      >
        {value}
      </Text>

      <Text
        style={[
          styles.foodMacroLabel,
          {
            color: colors.subtext,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pageContent: {
    width: "100%",
    alignSelf: "center",
  },

  heroCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 18,
    marginBottom: 25,
  },

  heroTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  heroHeading: {
    flex: 1,
  },

  eyebrowRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  eyebrowDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 7,
  },

  eyebrow: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.3,
  },

  heroCalories: {
    fontWeight: "900",
    letterSpacing: -1,
  },
heroCaloriesUnit: {
    fontSize: 13,
    fontWeight: "700",
  },

  heroSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },

  heroIcon: {
    width: 55,
    height: 55,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 15,
  },

  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 21,
  },

  progressTrack: {
    flex: 1,
    height: 9,
    borderRadius: 6,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 6,
  },

  progressPercent: {
    width: 43,
    textAlign: "right",
    fontSize: 10,
    fontWeight: "900",
  },

  remainingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
  },

  remainingLabel: {
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 0.8,
  },

  remainingValue: {
    fontSize: 16,
    fontWeight: "900",
    marginTop: 2,
  },

  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 7,
  },

  statusText: {
    fontSize: 9,
    fontWeight: "900",
    marginLeft: 5,
  },

  macroSummary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    marginTop: 17,
    paddingTop: 15,
  },

  nutritionStat: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  nutritionIcon: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  nutritionStatInfo: {
    marginLeft: 7,
  },

  nutritionStatValue: {
    fontSize: 12,
    fontWeight: "900",
  },

  nutritionStatLabel: {
    fontSize: 8,
    marginTop: 2,
  },

  nutritionStatTarget: {
    fontSize: 8,
    marginLeft: 3,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    marginTop: 2,
  },

  sectionText: {
    flex: 1,
    paddingRight: 10,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "900",
    letterSpacing: -0.3,
  },

  sectionSubtitle: {
    fontSize: 10,
    lineHeight: 16,
    marginTop: 3,
  },

  countBadge: {
    minWidth: 39,
    height: 35,
    borderRadius: 11,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 9,
  },

  countBadgeText: {
    fontSize: 11,
    fontWeight: "900",
    marginLeft: 5,
  },

  mealTypeScroll: {
    paddingBottom: 4,
    paddingRight: 12,
  },

  mealTypeButton: {
    minWidth: 132,
    height: 62,
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 9,
  },

  mealTypeIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 9,
  },

  mealTypeLabel: {
    fontSize: 11,
    fontWeight: "900",
  },

  mealTypeCount: {
    fontSize: 8,
    marginTop: 3,
  },

  mealSections: {
    marginTop: 13,
    marginBottom: 23,
  },

  mealSection: {
    borderWidth: 1,
    borderColor: "transparent",
    borderRadius: 18,
    padding: 12,
    marginBottom: 11,
  },

  mealSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  mealSectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  mealSectionIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  mealSectionInfo: {
    marginLeft: 10,
    flex: 1,
  },

  mealSectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  mealSectionTitle: {
    fontSize: 14,
    fontWeight: "900",
  },

  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: 7,
  },

  mealSectionSubtitle: {
    fontSize: 9,
    marginTop: 3,
  },

  mealCaloriesBlock: {
    alignItems: "flex-end",
  },

  mealCalories: {
    fontSize: 16,
    fontWeight: "900",
  },
mealCaloriesUnit: {
    fontSize: 8,
    marginTop: 1,
  },

  loggedFoods: {
    borderWidth: 1,
    borderRadius: 13,
    marginTop: 11,
    overflow: "hidden",
  },

  loggedFood: {
    minHeight: 61,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 9,
    paddingVertical: 8,
  },

  foodIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loggedFoodInfo: {
    flex: 1,
    minWidth: 0,
    marginLeft: 9,
  },

  loggedFoodName: {
    fontSize: 11,
    fontWeight: "800",
  },

  loggedFoodMeta: {
    fontSize: 8,
    marginTop: 3,
  },

  deleteButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },

  emptyMeal: {
    minHeight: 69,
    borderWidth: 1,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginTop: 11,
  },

  emptyMealIcon: {
    width: 39,
    height: 39,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyMealInfo: {
    flex: 1,
    marginLeft: 10,
  },

  emptyMealTitle: {
    fontSize: 11,
    fontWeight: "900",
  },

  emptyMealSubtitle: {
    fontSize: 8,
    lineHeight: 13,
    marginTop: 3,
  },

  databaseBadge: {
    minWidth: 48,
    height: 35,
    borderRadius: 11,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 9,
  },

  databaseBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    marginLeft: 5,
  },

  searchBox: {
    minHeight: 50,
    borderWidth: 1,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
    marginBottom: 10,
  },

  searchInput: {
    flex: 1,
    minWidth: 0,
    fontSize: 12,
    marginLeft: 9,
    paddingVertical: 9,
  },

  filterScroll: {
    paddingBottom: 3,
    paddingRight: 12,
  },

  filterButton: {
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },

  filterText: {
    fontSize: 10,
    fontWeight: "800",
    marginLeft: 6,
  },

  resultsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 21,
    marginBottom: 11,
  },

  resultsTitle: {
    fontSize: 16,
    fontWeight: "900",
  },

  resultsSubtitle: {
    fontSize: 9,
    marginTop: 3,
  },

  resultsBadge: {
    width: 31,
    height: 31,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  resultsBadgeText: {
    color: "#111111",
    fontSize: 10,
    fontWeight: "900",
  },

  foodCardsRow: {
    paddingBottom: 8,
    paddingRight: 12,
  },

  foodCard: {
    width: 245,
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    marginRight: 11,
  },

  foodCardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  foodMainIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  cuisineBadge: {
    minHeight: 24,
    borderRadius: 8,
    paddingHorizontal: 7,
    flexDirection: "row",
    alignItems: "center",
  },

  cuisineBadgeText: {
    fontSize: 7,
    fontWeight: "900",
    letterSpacing: 0.5,
    marginLeft: 3,
  },

  foodCardName: {
    fontSize: 15,
    lineHeight: 19,
    fontWeight: "900",
    marginTop: 13,
  },

  foodAmharic: {
    fontSize: 9,
    marginTop: 3,
  },

  foodCaloriesRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 13,
  },

  foodCalories: {
    fontSize: 24,
    fontWeight: "900",
  },

  foodCaloriesUnit: {
    fontSize: 9,
    fontWeight: "800",
    marginLeft: 4,
  },

  servingText: {
    fontSize: 8,
    marginTop: 1,
  },

  foodMacros: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    marginTop: 13,
    paddingTop: 11,
  },
foodMacro: {
    alignItems: "center",
    minWidth: 55,
  },

  foodMacroValue: {
    fontSize: 10,
    fontWeight: "900",
  },

  foodMacroLabel: {
    fontSize: 7,
    marginTop: 3,
  },

  addButton: {
    minHeight: 41,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
  },

  addButtonText: {
    color: "#111111",
    fontSize: 10,
    fontWeight: "900",
    marginLeft: 5,
  },

  emptySearch: {
    minHeight: 220,
    borderWidth: 1,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 25,
  },

  emptySearchIcon: {
    width: 58,
    height: 58,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  emptySearchTitle: {
    fontSize: 16,
    fontWeight: "900",
    marginTop: 13,
  },

  emptySearchText: {
    fontSize: 10,
    lineHeight: 16,
    textAlign: "center",
    marginTop: 5,
  },

  clearButton: {
    minHeight: 39,
    borderRadius: 11,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },

  clearButtonText: {
    color: "#111111",
    fontSize: 10,
    fontWeight: "900",
  },
});