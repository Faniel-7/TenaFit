import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  router,
  useLocalSearchParams,
} from "expo-router";

import ScreenContainer from "../../components/common/ScreenContainer";
import AuthButton from "../../components/auth/AuthButton";
import StepIndicator from "../../components/auth/StepIndicator";
import ReviewCard from "../../components/auth/ReviewCard";

import { saveUserProfile } from "../../storage/profileStorage";

import {
  UserProfile,
  Gender,
  WeightGoal,
  ActivityLevel,
  FoodPreference,
} from "../../types/userProfile";

const isWeb = Platform.OS === "web";

type ReviewParams = {
  fullName?: string | string[];
  username?: string | string[];
  email?: string | string[];

  age?: string | string[];
  gender?: string | string[];

  height?: string | string[];
  weight?: string | string[];

  goal?: string | string[];

  activityLevel?: string | string[];

  daysPerWeek?: string | string[];

  minutesPerDay?: string | string[];



  foodPreference?: string | string[];
};

export default function ReviewScreen() {
  const params =
    useLocalSearchParams<ReviewParams>();

  const { width } =
    useWindowDimensions();

  /*
  =========================================================
  WEB MOBILE DETECTION
  =========================================================

  Mobile means the web viewport.

  Example:
  412 × 914 → mobile layout

  Desktop remains untouched.
  */

  const isMobileWeb =
    Platform.OS === "web" &&
    width <= 600;

  const [isSaving, setIsSaving] =
    useState(false);

  /*
  =========================================================
  ONBOARDING DATA
  =========================================================
  */

  const fullName =
    getParam(params.fullName);

  const username =
    getParam(params.username);

  const email =
    getParam(params.email);

  const age =
    getParam(params.age);

  const gender =
    getParam(params.gender);

  const height =
    getParam(params.height);

  const weight =
    getParam(params.weight);

  const goal =
    getParam(params.goal);

  const activityLevel =
    getParam(params.activityLevel);

  const daysPerWeek =
    getParam(params.daysPerWeek);

  const minutesPerDay =
    getParam(params.minutesPerDay);


  const foodPreference =
    getParam(
      params.foodPreference
    );

  /*
  =========================================================
  DISPLAY VALUES
  =========================================================
  */

  const displayGender =
    formatGender(gender);

  const displayAge =
    age
      ? `${age} years`
      : "Not provided";

  const displayGoal =
    formatGoal(goal);

  const displayHeight =
    height
      ? `${height} cm`
      : "Not provided";

  const displayWeight =
    weight
      ? `${weight} kg`
      : "Not provided";

  const displayActivity =
    formatActivity(activityLevel);

  const displayCommitment =
    formatCommitment(
      daysPerWeek, 
      minutesPerDay
    );

  const displayFoodPreference =
    formatFoodPreference(
      foodPreference
    );

  /*
  =========================================================
  PRESERVE ALL ONBOARDING DATA
  =========================================================
  */

  const editParams = {
    fullName,
    username,
    email,

    age,
    gender,

    height,
    weight,

    goal,

    activityLevel,

    daysPerWeek,
    minutesPerDay,

    foodPreference,
  };

  /*
  =========================================================
  EDIT HANDLERS
  =========================================================
  */

  const editPersonalInfo =
    () => {
      router.push({
        pathname:
          "/onboarding/personal-info",
        params: editParams,
      });
    };

  const editPhysicalInfo =
    () => {
      router.push({
        pathname:
          "/onboarding/physical-info",
        params: editParams,
      });
    };

  const editGoal = () => {
    router.push({
      pathname:
        "/onboarding/goal",
      params: editParams,
    });
  };
const editActivity =
    () => {
      router.push({
        pathname:
          "/onboarding/activity",
        params: editParams,
      });
    };

  const editCommitment =
    () => {
      router.push({
        pathname:
          "/onboarding/commitment",
        params: editParams,
      });
    };

  const editFoodPreference =
    () => {
      router.push({
        pathname:
          "/onboarding/food-preference",
        params: editParams,
      });
    };

  /*
  =========================================================
  FINISH SETUP
  =========================================================
  */

  const handleFinishSetup =
    async () => {
      if (isSaving) {
        return;
      }

      if (
        !age ||
        !gender ||
        !height ||
        !weight ||
        !goal ||
        !activityLevel ||
        !daysPerWeek ||
        !minutesPerDay ||
        !foodPreference
      ) {
        console.warn(
          "Incomplete onboarding data:",
          {
            age,
            gender,
            height,
            weight,
            goal,
            activityLevel,
            daysPerWeek,
            foodPreference,
          }
        );

        return;
      }

      try {
        setIsSaving(true);

        const profile: UserProfile = {
          age: Number(age),

          gender:
            normalizeGender(
              gender
            ),

          heightCm:
            Number(height),

          weightKg:
            Number(weight),

          goal:
            normalizeGoal(
              goal
            ),

          activityLevel:
            normalizeActivityLevel(
              activityLevel
            ),

          daysPerWeek:
            Number(daysPerWeek),

          minutesPerDay:
            Number(minutesPerDay),

          foodPreference:
            normalizeFoodPreference(
              foodPreference
            ),
        };

        await saveUserProfile(
          profile
        );

        router.replace(
          "/home"
        );
      } catch (error) {
        console.error(
          "Failed to finish setup:",
          error
        );
      } finally {
        setIsSaving(false);
      }
    };

  /*
  =========================================================
  REVIEW CARD HELPER
  =========================================================

  IMPORTANT:

  Desktop:
  The ReviewCard is rendered directly.
  Therefore its desktop appearance is unchanged.

  Mobile:
  The card gets a wider two-column wrapper.
  */

  const renderCard = (
    card: React.ReactNode
  ) => {
    if (!isMobileWeb) {
      return card;
    }

    return (
      <View
        style={
          styles.mobileCardWrapper
        }
      >
        {card}
      </View>
    );
  };

  return (
    <ScreenContainer
      scrollable={isWeb}
      wide={isWeb}
    >
      <View
        style={[
          styles.container,
          isMobileWeb &&
            styles.mobileContainer,
        ]}
      >
        {/* =================================================
            TOP ROW
        ================================================= */}

        <View
          style={styles.topRow}
        >
          <Pressable
            onPress={() =>
              router.back()
            }
            style={styles.backBtn}
          >
            <Ionicons
              name="arrow-back"
              size={18}
              color="#FFC107"
            />
          </Pressable>

          <View
            style={
              styles.summaryBadge
            }
          >
            <Ionicons
              name="checkmark-circle"
              size={16}
              color="#FFC107"
            />

            <Text
              style={
                styles.summaryText
              }
            >
              Setup summary
            </Text>
          </View>
        </View>

        {/* =================================================
            STEP INDICATOR
        ================================================= */}
<StepIndicator
          current={6}
          total={6}
        />

        {/* =================================================
            TITLE
        ================================================= */}

        <Text
          style={styles.title}
        >
          Review your plan
        </Text>

        <Text
          style={styles.subtitle}
        >
          Check everything before
          finishing setup.
        </Text>

        {/* =================================================
            REVIEW GRID
        ================================================= */}

        <View
          style={[
            styles.grid,
            isMobileWeb &&
              styles.mobileGrid,
          ]}
        >
          {/* GENDER */}

          {renderCard(
            <ReviewCard
              icon="person-outline"
              label="Gender"
              value={
                displayGender
              }
              onEdit={
                editPersonalInfo
              }
            />
          )}

          {/* AGE */}

          {renderCard(
            <ReviewCard
              icon="calendar-outline"
              label="Age"
              value={
                displayAge
              }
              onEdit={
                editPersonalInfo
              }
            />
          )}

          {/* GOAL */}

          {renderCard(
            <ReviewCard
              icon="flag-outline"
              label="Goal"
              value={
                displayGoal
              }
              onEdit={
                editGoal
              }
            />
          )}

          {/* HEIGHT */}

          {renderCard(
            <ReviewCard
              icon="resize-outline"
              label="Height"
              value={
                displayHeight
              }
              onEdit={
                editPhysicalInfo
              }
            />
          )}

          {/* WEIGHT */}

          {renderCard(
            <ReviewCard
              icon="barbell-outline"
              label="Weight"
              value={
                displayWeight
              }
              onEdit={
                editPhysicalInfo
              }
            />
          )}

          {/* ACTIVITY */}

          {renderCard(
            <ReviewCard
              icon="fitness-outline"
              label="Activity"
              value={
                displayActivity
              }
              onEdit={
                editActivity
              }
            />
          )}

          {/* COMMITMENT */}

          {renderCard(
            <ReviewCard
              icon="calendar-outline"
              label="Commitment"
              value={
                displayCommitment
              }
              onEdit={
                editCommitment
              }
            />
          )}

          {/* FOOD PREFERENCE */}

          {renderCard(
            <ReviewCard
              icon="restaurant-outline"
              label="Food Preference"
              value={
                displayFoodPreference
              }
              onEdit={
                editFoodPreference
              }
            />
          )}
        </View>

        {/* =================================================
            FINISH BUTTON
        ================================================= */}

        <View
          style={[
            styles.buttonWrap,
            isMobileWeb &&
              styles.mobileButtonWrap,
          ]}
        >
          <AuthButton
            title={
              isSaving
                ? "Saving..."
                : "Finish Setup"
            }
            onPress={() => {
              if (!isSaving) {
                void handleFinishSetup();
              }
            }}
          />
{isSaving && (
            <ActivityIndicator
              size="small"
              color="#FFC107"
              style={
                styles.loading
              }
            />
          )}
        </View>
      </View>
    </ScreenContainer>
  );
}

/*
===========================================================
PARAMETER HELPER
===========================================================
*/

function getParam(
  value:
    | string
    | string[]
    | undefined
): string {
  if (
    Array.isArray(value)
  ) {
    return value[0] ?? "";
  }

  return value ?? "";
}

/*
===========================================================
DISPLAY FORMATTERS
===========================================================
*/

function formatGender(
  value: string
): string {
  switch (
    value.toLowerCase()
  ) {
    case "male":
      return "Male";

    case "female":
      return "Female";

    case "other":
      return "Prefer not to say";

    default:
      return (
        value ||
        "Not provided"
      );
  }
}

function formatGoal(
  value: string
): string {
  switch (
    value.toLowerCase()
  ) {
    case "lose":
    case "lose_weight":
    case "lose-weight":
      return "Lose Weight";

    case "maintain":
    case "maintain_weight":
    case "maintain-weight":
      return "Maintain Weight";

    case "gain":
    case "gain_weight":
    case "gain-weight":
      return "Gain Weight";

    default:
      return (
        value ||
        "Not provided"
      );
  }
}

function formatActivity(
  value: string
): string {
  switch (
    value.toLowerCase()
  ) {
    case "sedentary":
    case "no_exercise":
    case "no-exercise":
      return "No Exercise";

    case "light":
    case "light_exercise":
    case "light-exercise":
      return "Light Exercise";

    case "moderate":
    case "moderate_exercise":
    case "moderate-exercise":
      return "Moderate Exercise";

    case "hard":
    case "heavy":
    case "heavy_exercise":
    case "heavy-exercise":
      return "Hard Exercise";

    case "very_active":
    case "very-active":
      return "Very Active";

    default:
      return (
        value ||
        "Not provided"
      );
  }
}

function formatCommitment(
  days: string,
  minutes: string
): string {
  const daysNumber =
    Number(days);

  const minutesNumber =
    Number(minutes);

  if (
    !Number.isFinite(daysNumber) ||
    !Number.isFinite(minutesNumber) ||
    daysNumber <= 0 ||
    minutesNumber <= 0
  ) {
    return "Not provided";
  }

  return `${daysNumber} ${
    daysNumber === 1
      ? "day"
      : "days"
  } / ${minutesNumber} min per day`;
}

function formatFoodPreference(
  value: string
): string {
  switch (
    value.toLowerCase()
  ) {
    case "local":
      return "Local Foods";

    case "other":
      return "Other Foods";

    case "local_plus_other":
    case "local-plus-other":
    case "mix":
    case "mixed":
      return "Local + Other";

    default:
      return (
        value ||
        "Not provided"
      );
  }
}

/*
===========================================================
NORMALIZERS
===========================================================
*/

function normalizeGender(
  value: string
): Gender {
  if (
    value.toLowerCase() ===
    "female"
  ) {
    return "female";
  }

  return "male";
}

function normalizeGoal(
  value: string
): WeightGoal {
  const normalized =
    value.toLowerCase();

  if (
    normalized === "lose" ||
    normalized ===
      "lose_weight" ||
    normalized ===
      "lose-weight"
  ) {
    return "lose";
  }

  if (
    normalized ===
      "maintain" ||
    normalized ===
      "maintain_weight" ||
    normalized ===
      "maintain-weight"
  ) {
    return "maintain";
  }

  return "gain";
}

function normalizeActivityLevel(
  value: string
): ActivityLevel {
  const normalized =
    value.toLowerCase();

  if (
    normalized ===
      "sedentary" ||
    normalized ===
      "no_exercise" ||
    normalized ===
      "no-exercise"
  ) {
    return "sedentary";
  }
if (
    normalized ===
      "light" ||
    normalized ===
      "light_exercise" ||
    normalized ===
      "light-exercise"
  ) {
    return "light";
  }

  if (
    normalized ===
      "moderate" ||
    normalized ===
      "moderate_exercise" ||
    normalized ===
      "moderate-exercise"
  ) {
    return "moderate";
  }

  if (
    normalized === "hard" ||
    normalized === "heavy" ||
    normalized ===
      "heavy_exercise" ||
    normalized ===
      "heavy-exercise"
  ) {
    return "hard";
  }

  if (
    normalized ===
      "very_active" ||
    normalized ===
      "very-active"
  ) {
    return "hard";
  }

  return "moderate";
}

function normalizeFoodPreference(
  value: string
): FoodPreference {
  const normalized =
    value.toLowerCase();

  if (
    normalized === "local"
  ) {
    return "local";
  }

  if (
    normalized === "other"
  ) {
    return "other";
  }

  return "mixed";
}


/*
===========================================================
STYLES
===========================================================
*/

const styles =
  StyleSheet.create({
    /*
    -------------------------------------------------------
    MAIN CONTAINER
    -------------------------------------------------------
    */

    container: {
      flex: 1,
      paddingTop:
        isWeb ? 12 : 24,
    },

    /*
    ONLY MOBILE WEB
    */

    mobileContainer: {
      paddingTop: 10,
    },

    /*
    -------------------------------------------------------
    TOP ROW
    -------------------------------------------------------
    */

    topRow: {
      flexDirection:
        "row",
      justifyContent:
        "space-between",
      alignItems:
        "center",
      marginBottom: 10,
    },

    backBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor:
        "#17171E",
      borderWidth: 1,
      borderColor:
        "#2A2A2A",
      justifyContent:
        "center",
      alignItems:
        "center",
    },

    summaryBadge: {
      flexDirection:
        "row",
      alignItems:
        "center",
      backgroundColor:
        "#17171E",
      borderWidth: 1,
      borderColor:
        "#2A2A2A",
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 999,
      gap: 6,
    },

    summaryText: {
      color: "#FFC107",
      fontWeight:
        "800",
      fontSize: 12,
    },

    /*
    -------------------------------------------------------
    TITLE
    -------------------------------------------------------
    */

    title: {
      color: "#FFFFFF",
      fontSize:
        isWeb ? 28 : 24,
      fontWeight:
        "900",
      letterSpacing:
        -0.5,
      marginTop: 2,
    },

    subtitle: {
      color: "#9CA3AF",
      fontSize: 14,
      lineHeight: 20,
      marginTop: 4,
      marginBottom: 14,
    },

    /*
    -------------------------------------------------------
    DESKTOP GRID
    -------------------------------------------------------

    THIS IS THE ORIGINAL DESKTOP STRUCTURE.

    We do not change its card widths.
    */

    grid: {
      width: "100%",
      flexDirection:
        "row",
      flexWrap:
        "wrap",
      justifyContent:
        "space-between",
      rowGap: 18,
      columnGap: 12,
      marginBottom: 16,
    },

    /*
    -------------------------------------------------------
    MOBILE GRID
    -------------------------------------------------------

    Only applied to the web-mobile viewport.

    The cards remain two columns.
    */

    mobileGrid: {
      width: "100%",
      justifyContent:
        "space-between",
      columnGap: 0,
      rowGap: 14,
    },
/*
    -------------------------------------------------------
    MOBILE CARD WIDTH
    -------------------------------------------------------

    This wrapper exists ONLY on mobile.

    At 412px this gives each card almost half
    of the available width.
    */

    mobileCardWrapper: {
      width: "48.5%",
      minWidth: 0,
    },

    /*
    -------------------------------------------------------
    DESKTOP BUTTON
    -------------------------------------------------------
    */

    buttonWrap: {
      width: 320,
      alignSelf:
        "center",
      marginTop: 10,
    },

    /*
    -------------------------------------------------------
    MOBILE BUTTON
    -------------------------------------------------------
    */

    mobileButtonWrap: {
      width: "100%",
      marginTop: 6,
    },

    loading: {
      marginTop: 10,
    },
  });