import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { foodDatabase, searchFoods } from "../../data/foods/foodDatabase";
import { Food, MealType } from "../../types/nutrition";
import { useAppData } from "../../context/AppDataContext";
import { useTheme } from "../../context/ThemeContext";

type FoodFilter = "all" | "local" | "other";

type MealTypeConfig = {
  key: MealType;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const mealTypes: MealTypeConfig[] = [
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

const filters: {
  key: FoodFilter;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  {
    key: "all",
    label: "All foods",
    icon: "grid-outline",
  },
  {
    key: "local",
    label: "Ethiopian",
    icon: "earth-outline",
  },
  {
    key: "other",
    label: "International",
    icon: "globe-outline",
  },
];

export default function MealsScreen() {
  const { width } = useWindowDimensions();
  const { colors, isDark } = useTheme();

  const {
    meals,
    addMeal,
    removeMeal,
    data,
    goals,
  } = useAppData();

  const [query, setQuery] = useState("");
  const [filter, setFilter] =
    useState<FoodFilter>("all");

  const [selectedMealType, setSelectedMealType] =
    useState<MealType>("breakfast");

  const [addingFoodId, setAddingFoodId] =
    useState<string | null>(null);

  const [removingMealId, setRemovingMealId] =
    useState<string | null>(null);

  const isMobile = width < 700;

  const caloriesProgress = Math.max(
    0,
    Math.min(
      data.calories /
        Math.max(goals.calories, 1),
      1
    )
  );

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

  const getMealItems = (
    mealType: MealType
  ) =>
    meals.filter(
      (meal) => meal.mealType === mealType
    );

  const getMealCalories = (
    mealType: MealType
  ) =>
    getMealItems(mealType).reduce(
      (total, meal) =>
        total + meal.calories,
      0
    );

  const selectedMealItems =
    getMealItems(selectedMealType);

  const selectedMealConfig =
    mealTypes.find(
      (item) => item.key === selectedMealType
    ) || mealTypes[0];

  const handleAddFood = async (
    food: Food
  ) => {
    if (addingFoodId) {
      return;
    }

    setAddingFoodId(food.id);

    try {
      await addMeal(
        food,
        selectedMealType
      );
    } finally {
      setAddingFoodId(null);
    }
  };

  const handleRemoveMeal = async (
    mealId: string
  ) => {
    if (removingMealId) {
      return;
    }

    setRemovingMealId(mealId);

    try {
      await removeMeal(mealId);
    } finally {
      setRemovingMealId(null);
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            maxWidth: 1120,
            paddingHorizontal: isMobile
              ? 18
              : 28,
          },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.headerText}>
            <View style={styles.eyebrowRow}>
              <View
style={[
                  styles.eyebrowIcon,
                  {
                    backgroundColor:
                      colors.primary + "18",
                  },
                ]}
              >
                <Ionicons
                  name="restaurant"
                  size={15}
                  color={colors.primary}
                />
              </View>

              <Text
                style={[
                  styles.eyebrow,
                  {
                    color: colors.primary,
                  },
                ]}
              >
                DAILY NUTRITION
              </Text>
            </View>

            <Text
              style={[
                styles.title,
                { color: colors.text },
              ]}
            >
              Eat with purpose.
            </Text>

            <Text
              style={[
                styles.subtitle,
                { color: colors.subtext },
              ]}
            >
              Log your meals and build your day
              around your nutrition target.
            </Text>
          </View>

          <View
            style={[
              styles.headerIcon,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons
              name="restaurant-outline"
              size={27}
              color={colors.primary}
            />
          </View>
        </View>

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
            <View style={styles.summaryText}>
              <Text
                style={[
                  styles.summaryEyebrow,
                  {
                    color: colors.primary,
                  },
                ]}
              >
                TODAY'S CALORIES
              </Text>

              <View
                style={styles.summaryValueRow}
              >
                <Text
                  style={[
                    styles.summaryValue,
                    { color: colors.text },
                  ]}
                >
                  {Math.round(
                    data.calories
                  ).toLocaleString()}
                </Text>

                <Text
                  style={[
                    styles.summaryUnit,
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
                  styles.summarySubtitle,
                  { color: colors.subtext },
                ]}
              >
                of{" "}
                {Math.round(
                  goals.calories
                ).toLocaleString()}{" "}
                kcal daily target
              </Text>
            </View>

            <View
              style={[
                styles.summaryIcon,
                {
                  backgroundColor:
                    colors.primary + "18",
                },
              ]}
            >
              <Ionicons
                name="flame"
                size={27}
                color={colors.primary}
              />
            </View>
          </View>

          <View
            style={[
              styles.progressTrack,
              {
                backgroundColor:
                  colors.border,
              },
            ]}
          >
            {caloriesProgress > 0 && (
              <View
                style={[
styles.progressFill,
                  {
                    width: `${
                      caloriesProgress * 100
                    }%`,
                    backgroundColor:
                      colors.primary,
                  },
                ]}
              />
            )}
          </View>

          <View
            style={[
              styles.summaryStats,
              isMobile &&
                styles.summaryStatsMobile,
            ]}
          >
            <NutritionStat
              label="Protein"
              value={Math.round(
                data.protein
              )}
              target={Math.round(
                goals.protein
              )}
              unit="g"
              colors={colors}
            />

            <NutritionStat
              label="Carbs"
              value={Math.round(
                data.carbs
              )}
              target={Math.round(
                goals.carbs
              )}
              unit="g"
              colors={colors}
            />

            <NutritionStat
              label="Fat"
              value={Math.round(
                data.fat
              )}
              target={Math.round(
                goals.fat
              )}
              unit="g"
              colors={colors}
            />
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <View>
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
              Select a meal to see what you've
              logged.
            </Text>
          </View>

          <View
            style={[
              styles.countBadge,
              {
                backgroundColor:
                  colors.card,
                borderColor:
                  colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.countBadgeText,
                {
                  color: colors.primary,
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
              selectedMealType ===
              mealType.key;

            const count =
              getMealItems(
                mealType.key
              ).length;

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
                    backgroundColor:
                      active
                        ? colors.primary
                        : colors.card,
                    borderColor:
                      active
                        ? colors.primary
                        : colors.border,
                    opacity: pressed
                      ? 0.82
                      : 1,
                  },
                ]}
              >
                <View
                  style={[
                    styles.mealTypeIcon,
                    {
                      backgroundColor:
                        active
                          ? "rgba(0,0,0,0.10)"
: colors.background,
                    },
                  ]}
                >
                  <Ionicons
                    name={
                      mealType.icon
                    }
                    size={17}
                    color={
                      active
                        ? "#111111"
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

        <View
          style={[
            styles.selectedMealCard,
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
              styles.selectedMealIcon,
              {
                backgroundColor:
                  colors.primary + "18",
              },
            ]}
          >
            <Ionicons
              name={
                selectedMealConfig.icon
              }
              size={21}
              color={colors.primary}
            />
          </View>

          <View
            style={styles.selectedMealText}
          >
            <Text
              style={[
                styles.selectedMealTitle,
                { color: colors.text },
              ]}
            >
              {selectedMealConfig.label}
            </Text>

            <Text
              style={[
                styles.selectedMealSubtitle,
                { color: colors.subtext },
              ]}
            >
              {selectedMealItems.length > 0
                ? `${selectedMealItems.length} ${
                    selectedMealItems.length === 1
                      ? "food"
                      : "foods"
                  } logged · ${Math.round(
                    getMealCalories(selectedMealType)
                  )} kcal`
                : "Nothing logged yet"}
            </Text>
          </View>

          <View
            style={[
              styles.selectedMealBadge,
              {
                backgroundColor:
                  colors.background,
              },
            ]}
          >
            <Text
              style={[
                styles.selectedMealBadgeText,
                { color: colors.primary },
              ]}
            >
              {selectedMealItems.length}
            </Text>
          </View>
        </View>

        {selectedMealItems.length > 0 && (
          <View
            style={[
              styles.loggedMeals,
              {
                backgroundColor:
                  colors.card,
                borderColor:
                  colors.border,
              },
            ]}
          >
            {selectedMealItems.map(
              (meal, index) => {
                const removing =
                  removingMealId ===
                  meal.id;
return (
                  <View
                    key={meal.id}
                    style={[
                      styles.loggedMeal,
                      index <
                        selectedMealItems.length -
                          1 && {
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
                        name="restaurant-outline"
                        size={17}
                        color={
                          colors.primary
                        }
                      />
                    </View>

                    <View
                      style={
                        styles.loggedMealInfo
                      }
                    >
                      <Text
                        style={[
                          styles.loggedMealName,
                          {
                            color:
                              colors.text,
                          },
                        ]}
                        numberOfLines={1}
                      >
                        {meal.food.nameEnglish ||
                          meal.food.name}
                      </Text>

                      <Text
                        style={[
                          styles.loggedMealMacros,
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
                        handleRemoveMeal(
                          meal.id
                        )
                      }
                      disabled={removing}
                      style={[
                        styles.removeButton,
                        {
                          backgroundColor:
                            colors.danger +
                            "14",
                        },
                      ]}
                    >
                      {removing ? (
                        <ActivityIndicator
                          size="small"
                          color={
                            colors.danger
                          }
                        />
                      ) : (
                        <Ionicons
                          name="trash-outline"
                          size={16}
                          color={
                            colors.danger
                          }
                        />
                      )}
                    </Pressable>
                  </View>
                );
              }
            )}
          </View>
        )}

        {selectedMealItems.length === 0 && (
          <View
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
                name="restaurant-outline"
                size={22}
                color={colors.subtext}
              />
            </View>

            <View
              style={styles.emptyMealText}
            >
              <Text
                style={[
                  styles.emptyMealTitle,
                  { color: colors.text },
                ]}
              >
                No food logged yet
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
                Choose a food below to add it
                to {selectedMealConfig.label}.
              </Text>
            </View>
          </View>
        )}

        <View
          style={[
            styles.sectionHeader,
            styles.foodHeaderSection,
          ]}
        >
          <View>
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
              Choose from your available
              foods.
            </Text>
          </View>

          <View
            style={[
              styles.databaseBadge,
              {
                backgroundColor:
                  colors.card,
                borderColor:
                  colors.border,
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
                { color: colors.text },
              ]}
            >
              {foods.length}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.searchContainer,
            {
              backgroundColor:
                colors.card,
              borderColor:
                colors.border,
            },
          ]}
        >
          <Ionicons
            name="search-outline"
            size={19}
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
              { color: colors.text },
            ]}
            returnKeyType="search"
          />

          {query.length > 0 && (
            <Pressable
              onPress={() => setQuery("")}
              style={styles.clearButton}
            >
              <Ionicons
                name="close-circle"
                size={18}
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
          {filters.map((item) => {
            const active =
              filter === item.key;

            return (
              <Pressable
                key={item.key}
                onPress={() =>
                  setFilter(item.key)
}
                style={[
                  styles.filterButton,
                  {
                    backgroundColor:
                      active
                        ? colors.primary
                        : colors.card,
                    borderColor:
                      active
                        ? colors.primary
                        : colors.border,
                  },
                ]}
              >
                <Ionicons
                  name={item.icon}
                  size={14}
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
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View
          style={[
            styles.resultHeader,
            {
              borderBottomColor:
                colors.border,
            },
          ]}
        >
          <View>
            <Text
              style={[
                styles.resultTitle,
                { color: colors.text },
              ]}
            >
              Add to{" "}
              {selectedMealConfig.label}
            </Text>

            <Text
              style={[
                styles.resultSubtitle,
                { color: colors.subtext },
              ]}
            >
              Tap a food to log it instantly.
            </Text>
          </View>

          <View
            style={[
              styles.resultBadge,
              {
                backgroundColor:
                  colors.primary,
              },
            ]}
          >
            <Text
              style={styles.resultBadgeText}
            >
              {foods.length}
            </Text>
          </View>
        </View>

        {foods.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={
              styles.foodRow
            }
          >
            {foods.map((food) => {
              const adding =
                addingFoodId === food.id;

              return (
                <FoodCard
                  key={food.id}
                  food={food}
                  mealType={
                    selectedMealConfig.label
                  }
                  colors={colors}
                  isDark={isDark}
                  adding={adding}
                  onAdd={() =>
                    handleAddFood(food)
                  }
                />
              );
            })}
          </ScrollView>
        ) : (
          <View
            style={[
              styles.emptyDatabase,
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
                styles.emptyDatabaseIcon,
                {
                  backgroundColor:
                    colors.background,
                },
              ]}
            >
              <Ionicons
                name="search-outline"
                size={25}
                color={colors.subtext}
              />
            </View>

            <Text
              style={[
                styles.emptyDatabaseTitle,
                { color: colors.text },
              ]}
            >
              No foods found
            </Text>
<Text
              style={[
                styles.emptyDatabaseText,
                { color: colors.subtext },
              ]}
            >
              Try another food name or change
              the food category.
            </Text>
          </View>
        )}

        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
}

function NutritionStat({
  label,
  value,
  target,
  unit,
  colors,
}: {
  label: string;
  value: number;
  target: number;
  unit: string;
  colors: ReturnType<
    typeof useTheme
  >["colors"];
}) {
  return (
    <View style={styles.nutritionStat}>
      <Text
        style={[
          styles.nutritionStatValue,
          { color: colors.text },
        ]}
      >
        {value}
        <Text
          style={[
            styles.nutritionStatUnit,
            { color: colors.subtext },
          ]}
        >
          {unit}
        </Text>
      </Text>

      <Text
        style={[
          styles.nutritionStatLabel,
          { color: colors.subtext },
        ]}
      >
        {label}
      </Text>

      <Text
        style={[
          styles.nutritionStatTarget,
          { color: colors.subtext },
        ]}
      >
        / {target}
        {unit}
      </Text>
    </View>
  );
}

function FoodCard({
  food,
  mealType,
  colors,
  isDark,
  adding,
  onAdd,
}: {
  food: Food;
  mealType: string;
  colors: ReturnType<
    typeof useTheme
  >["colors"];
  isDark: boolean;
  adding: boolean;
  onAdd: () => void;
}) {
  const isLocal = food.cuisine === "local";

  return (
    <View
      style={[
        styles.foodCard,
        {
          backgroundColor:
            colors.card,
          borderColor:
            colors.border,
        },
      ]}
    >
      <View style={styles.foodHeader}>
        <View
          style={[
            styles.foodIcon,
            {
              backgroundColor:
                colors.primary + "18",
            },
          ]}
        >
          <Ionicons
            name={
              isLocal
                ? "earth-outline"
                : "restaurant-outline"
            }
            size={22}
            color={colors.primary}
          />
        </View>

        <View
          style={[
            styles.cuisineBadge,
            {
              backgroundColor:
                isDark
                  ? "rgba(255,255,255,0.06)"
                  : colors.background,
            },
          ]}
        >
          <Text
            style={[
              styles.cuisineBadgeText,
              { color: colors.primary },
            ]}
          >
            {isLocal
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
        {food.nameEnglish ||
          food.name}
      </Text>

      {food.nameAmharic && (
        <Text
          style={[
            styles.foodSecondaryName,
            { color: colors.subtext },
          ]}
          numberOfLines={1}
        >
          {food.nameAmharic}
        </Text>
      )}

      <View
        style={styles.foodCaloriesRow}
      >
        <Text
          style={[
            styles.foodCalories,
            { color: colors.primary },
          ]}
        >
          {Math.round(food.calories)}
        </Text>

        <Text
          style={[
            styles.foodCaloriesUnit,
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
          {
            borderTopColor:
              colors.border,
          },
        ]}
      >
        <FoodMacro
          label="Protein"
          value={food.protein}
          colors={colors}
        />
<FoodMacro
          label="Carbs"
          value={food.carbohydrates}
          colors={colors}
        />

        <FoodMacro
          label="Fat"
          value={food.fat}
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
            opacity: pressed
              ? 0.8
              : adding
              ? 0.65
              : 1,
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
              size={17}
              color="#111111"
            />

            <Text
              style={
                styles.addButtonText
              }
            >
              Add to {mealType}
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
  value: number;
  colors: ReturnType<
    typeof useTheme
  >["colors"];
}) {
  return (
    <View style={styles.foodMacro}>
      <Text
        style={[
          styles.foodMacroValue,
          { color: colors.text },
        ]}
      >
        {Math.round(value)}g
      </Text>

      <Text
        style={[
          styles.foodMacroLabel,
          { color: colors.subtext },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "transparent",
  },

  scrollContent: {
    width: "100%",
    alignSelf: "center",
    paddingTop: 20,
    paddingBottom: 50,
  },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  headerText: {
    flex: 1,
    paddingRight: 18,
  },

  eyebrowRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 9,
  },

  eyebrowIcon: {
    width: 28,
    height: 28,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  eyebrow: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.2,
  },

  title: {
    fontSize: 31,
    fontWeight: "900",
    letterSpacing: -0.8,
  },

  subtitle: {
    fontSize: 13,
    lineHeight: 20,
    marginTop: 6,
    maxWidth: 620,
  },

  headerIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  summaryCard: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 22,
    marginBottom: 29,
  },

  summaryTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  summaryText: {
    flex: 1,
  },

  summaryEyebrow: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.5,
  },

  summaryValueRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 3,
  },

  summaryValue: {
    fontSize: 38,
    lineHeight: 44,
    fontWeight: "900",
    letterSpacing: -1.2,
  },

  summaryUnit: {
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 7,
    marginLeft: 5,
  },

  summarySubtitle: {
    fontSize: 12,
    marginTop: 2,
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
    marginTop: 20,
  },

  progressFill: {
    height: "100%",
    borderRadius: 10,
  },

  summaryStats: {
    flexDirection: "row",
    marginTop: 21,
  },

  summaryStatsMobile: {
    marginTop: 18,
  },

  nutritionStat: {
    flex: 1,
    marginRight: 10,
  },

  nutritionStatValue: {
    fontSize: 15,
    fontWeight: "900",
  },

  nutritionStatUnit: {
    fontSize: 9,
    fontWeight: "700",
  },

  nutritionStatLabel: {
    fontSize: 9,
    marginTop: 3,
  },
nutritionStatTarget: {
    fontSize: 8,
    marginTop: 2,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 13,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: -0.3,
  },

  sectionSubtitle: {
    fontSize: 11,
    marginTop: 3,
  },

  countBadge: {
    minWidth: 38,
    height: 38,
    paddingHorizontal: 9,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  countBadgeText: {
    fontSize: 14,
    fontWeight: "900",
  },

  mealTypeScroll: {
    paddingBottom: 14,
    paddingRight: 5,
  },

  mealTypeButton: {
    minWidth: 145,
    borderWidth: 1,
    borderRadius: 17,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 9,
  },

  mealTypeIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  mealTypeLabel: {
    fontSize: 12,
    fontWeight: "900",
  },

  mealTypeCount: {
    fontSize: 9,
    marginTop: 3,
  },

  selectedMealCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 9,
  },

  selectedMealIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  selectedMealText: {
    flex: 1,
    marginLeft: 12,
  },

  selectedMealTitle: {
    fontSize: 14,
    fontWeight: "900",
  },

  selectedMealSubtitle: {
    fontSize: 10,
    marginTop: 4,
  },

  selectedMealBadge: {
    minWidth: 34,
    height: 34,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },

  selectedMealBadgeText: {
    fontSize: 12,
    fontWeight: "900",
  },

  loggedMeals: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 15,
    marginBottom: 10,
    overflow: "hidden",
  },

  loggedMeal: {
    minHeight: 67,
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

  loggedMealInfo: {
    flex: 1,
    marginLeft: 11,
    marginRight: 9,
  },

  loggedMealName: {
    fontSize: 12,
    fontWeight: "800",
  },

  loggedMealMacros: {
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
    minHeight: 70,
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 29,
  },

  emptyMealIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
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
    lineHeight: 14,
    marginTop: 3,
  },

  foodHeaderSection: {
    marginTop: 10,
  },

  databaseBadge: {
    height: 35,
    paddingHorizontal: 11,
    borderRadius: 11,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  databaseBadgeText: {
    fontSize: 11,
    fontWeight: "900",
    marginLeft: 6,
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
    paddingVertical: 0,
  },

  clearButton: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  filterScroll: {
    paddingVertical: 13,
    paddingRight: 5,
  },

  filterButton: {
    height: 38,
    paddingHorizontal: 13,
    borderRadius: 11,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
filterText: {
    fontSize: 10,
    fontWeight: "900",
    marginLeft: 6,
  },

  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 5,
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
    color: "#111111",
    fontSize: 11,
    fontWeight: "900",
  },

  foodRow: {
    paddingBottom: 8,
    paddingRight: 5,
  },

  foodCard: {
    width: 255,
    minHeight: 300,
    padding: 17,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 12,
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

  cuisineBadge: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },

  cuisineBadgeText: {
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

  foodSecondaryName: {
    fontSize: 10,
    marginTop: 4,
  },

  foodCaloriesRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 16,
  },

  foodCalories: {
    fontSize: 25,
    fontWeight: "900",
  },

  foodCaloriesUnit: {
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
    marginTop: 17,
    paddingTop: 13,
    borderTopWidth: 1,
  },

  foodMacro: {
    flex: 1,
  },

  foodMacroValue: {
    fontSize: 11,
    fontWeight: "900",
  },

  foodMacroLabel: {
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
  },

  addButtonText: {
    color: "#111111",
    fontSize: 10,
    fontWeight: "900",
    marginLeft: 5,
  },

  emptyDatabase: {
    minHeight: 190,
    borderWidth: 1,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    padding: 25,
  },

  emptyDatabaseIcon: {
    width: 58,
    height: 58,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyDatabaseTitle: {
    fontSize: 15,
    fontWeight: "900",
    marginTop: 12,
  },

  emptyDatabaseText: {
    fontSize: 10,
    lineHeight: 16,
    marginTop: 5,
    textAlign: "center",
    maxWidth: 300,
  },

  bottomSpace: {
    height: 30,
  },
});