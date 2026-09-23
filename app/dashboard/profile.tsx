import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { getUserProfile } from "../../storage/profileStorage";
import { UserProfile } from "../../types/userProfile";

export default function ProfileScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { user } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const savedProfile = await getUserProfile();
      setProfile(savedProfile);
    } finally {
      setLoading(false);
    }
  };

  const goalLabel =
    profile?.goal === "lose"
      ? "Lose weight"
      : profile?.goal === "gain"
      ? "Gain weight"
      : "Maintain weight";

  const activityLabel =
    profile?.activityLevel === "sedentary"
      ? "Sedentary"
      : profile?.activityLevel === "light"
      ? "Light activity"
      : profile?.activityLevel === "moderate"
      ? "Moderate activity"
      : profile?.activityLevel === "hard"
      ? "High activity"
      : "Not set";

  const foodLabel =
    profile?.foodPreference === "local"
      ? "Local foods"
      : profile?.foodPreference === "other"
      ? "International foods"
      : profile?.foodPreference === "mixed"
      ? "Local + international"
      : "Not set";

  const displayName =
    user?.fullName?.trim() ||
    user?.username?.trim() ||
    "TenaFit User";

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  if (loading) {
    return (
      <View
        style={[
          styles.loadingScreen,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />

        <Text
          style={[
            styles.loadingText,
            { color: colors.subtext },
          ]}
        >
          Loading your profile...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <View style={styles.eyebrowRow}>
              <View
                style={[
                  styles.eyebrowIcon,
                  {
                    backgroundColor: isDark
                      ? "#22271A"
                      : "#F1F7D9",
                  },
                ]}
              >
                <Ionicons
                  name="person-outline"
                  size={15}
                  color={colors.primary}
                />
              </View>

              <Text
                style={[
                  styles.eyebrow,
                  { color: colors.subtext },
                ]}
              >
                MY PROFILE
              </Text>
            </View>

            <Text
              style={[
                styles.title,
                { color: colors.text },
              ]}
            >
              Your profile
            </Text>

            <Text
              style={[
                styles.subtitle,
                { color: colors.subtext },
              ]}
            >
              Your personal information powers TenaFit's
              recommendations and targets.
            </Text>
          </View>
<Pressable
            onPress={() =>
              router.push("/dashboard/settings")
            }
            style={({ pressed }) => [
              styles.settingsButton,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Ionicons
              name="settings-outline"
              size={20}
              color={colors.text}
            />
          </Pressable>
        </View>

        <View
          style={[
            styles.profileHero,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.heroGlow,
              {
                backgroundColor: isDark
                  ? "rgba(215,245,44,0.06)"
                  : "rgba(215,245,44,0.16)",
              },
            ]}
          />

          <View
            style={[
              styles.avatar,
              { backgroundColor: colors.primary },
            ]}
          >
            <Text style={styles.avatarText}>
              {initials || "T"}
            </Text>
          </View>

          <View style={styles.profileIdentity}>
            <Text
              style={[
                styles.name,
                { color: colors.text },
              ]}
            >
              {displayName}
            </Text>

            <Text
              style={[
                styles.email,
                { color: colors.subtext },
              ]}
            >
              {user?.email || "No email available"}
            </Text>

            <View
              style={[
                styles.goalBadge,
                {
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(0,0,0,0.045)",
                },
              ]}
            >
              <View
                style={[
                  styles.goalDot,
                  { backgroundColor: colors.primary },
                ]}
              />

              <Text
                style={[
                  styles.goalBadgeText,
                  { color: colors.text },
                ]}
              >
                {goalLabel}
              </Text>
            </View>
          </View>
        </View>

        <SectionHeader
          title="Personal information"
          icon="body-outline"
          colors={colors}
        />

        <View
          style={[
            styles.infoCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <InfoRow
            label="Age"
            value={
              profile?.age
                ? `${profile.age} years`
                : "Not set"
            }
            colors={colors}
          />

          <InfoRow
            label="Gender"
            value={
              profile?.gender
                ? profile.gender === "male"
                  ? "Male"
                  : "Female"
                : "Not set"
            }
            colors={colors}
          />

          <InfoRow
            label="Height"
            value={
              profile?.heightCm
                ? `${profile.heightCm} cm`
                : "Not set"
            }
            colors={colors}
          />

          <InfoRow
            label="Weight"
            value={
              profile?.weightKg
                ? `${profile.weightKg} kg`
                : "Not set"
            }
            colors={colors}
            last
          />
        </View>

        <SectionHeader
          title="Lifestyle"
          icon="fitness-outline"
          colors={colors}
        />
<View
          style={[
            styles.infoCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <InfoRow
            label="Goal"
            value={goalLabel}
            colors={colors}
          />

          <InfoRow
            label="Activity"
            value={activityLabel}
            colors={colors}
          />

          <InfoRow
            label="Training days"
            value={
              profile?.daysPerWeek
                ? `${profile.daysPerWeek} days / week`
                : "Not set"
            }
            colors={colors}
          />

          <InfoRow
            label="Session length"
            value={
              profile?.minutesPerDay
                ? `${profile.minutesPerDay} minutes`
                : "Not set"
            }
            colors={colors}
            last
          />
        </View>

        <SectionHeader
          title="Food preference"
          icon="restaurant-outline"
          colors={colors}
        />

        <View
          style={[
            styles.preferenceCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.preferenceIcon,
              {
                backgroundColor: isDark
                  ? "#22271A"
                  : "#F1F7D9",
              },
            ]}
          >
            <Ionicons
              name="restaurant-outline"
              size={22}
              color={colors.primary}
            />
          </View>

          <View style={styles.preferenceContent}>
            <Text
              style={[
                styles.preferenceTitle,
                { color: colors.text },
              ]}
            >
              Your food style
            </Text>

            <Text
              style={[
                styles.preferenceValue,
                { color: colors.primary },
              ]}
            >
              {foodLabel}
            </Text>

            <Text
              style={[
                styles.preferenceDescription,
                { color: colors.subtext },
              ]}
            >
              TenaFit uses this preference when building
              personalized meal recommendations.
            </Text>
          </View>
        </View>

        <SectionHeader
          title="Quick overview"
          icon="stats-chart-outline"
          colors={colors}
        />

        <View style={styles.overviewGrid}>
          <OverviewCard
            label="Height"
            value={
              profile?.heightCm
                ? `${profile.heightCm} cm`
                : "—"
            }
            unit="cm"
            colors={colors}
          />

          <OverviewCard
            label="Weight"
            value={
              profile?.weightKg
                ? `${profile.weightKg} kg`
                : "—"
            }
            unit="kg"
            colors={colors}
          />

          <OverviewCard
            label="Training"
            value={
              profile?.daysPerWeek
                ? `${profile?.daysPerWeek}`
                : "—"
            }
            unit="days"
            colors={colors}
          />

          <OverviewCard
            label="Sessions"
            value={
              profile?.minutesPerDay
                ? `${profile?.minutesPerDay}`
                : "—"
            }
            unit="min"
            colors={colors}
          />
        </View>

        <Pressable
          onPress={() =>
            router.push("/dashboard/settings")
          }
          style={({ pressed }) => [
styles.manageButton,
            {
              backgroundColor: colors.primary,
              opacity: pressed ? 0.82 : 1,
            },
          ]}
        >
          <View style={styles.manageButtonContent}>
            <Ionicons
              name="settings-outline"
              size={19}
              color="#111111"
            />

            <Text style={styles.manageButtonText}>
              Manage profile
            </Text>
          </View>

          <Ionicons
            name="arrow-forward"
            size={20}
            color="#111111"
          />
        </Pressable>

        <View
          style={[
            styles.footerCard,
            {
              backgroundColor: isDark
                ? "#111216"
                : "#F0F0F0",
            },
          ]}
        >
          <Ionicons
            name="sparkles-outline"
            size={17}
            color={colors.primary}
          />

          <Text
            style={[
              styles.footerText,
              { color: colors.subtext },
            ]}
          >
            Your profile helps TenaFit personalize nutrition,
            meal plans, activity targets and progress tracking.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

function SectionHeader({
  title,
  icon,
  colors,
}: {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  colors: {
    text: string;
    subtext: string;
    primary: string;
  };
}) {
  return (
    <View style={styles.sectionHeader}>
      <View
        style={[
          styles.sectionIcon,
          {
            backgroundColor: "rgba(215,245,44,0.10)",
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={16}
          color={colors.primary}
        />
      </View>

      <Text
        style={[
          styles.sectionTitle,
          { color: colors.text },
        ]}
      >
        {title}
      </Text>
    </View>
  );
}

function InfoRow({
  label,
  value,
  colors,
  last = false,
}: {
  label: string;
  value: string;
  colors: {
    text: string;
    subtext: string;
    border: string;
  };
  last?: boolean;
}) {
  return (
    <View
      style={[
        styles.infoRow,
        !last && {
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <Text
        style={[
          styles.infoLabel,
          { color: colors.subtext },
        ]}
      >
        {label}
      </Text>

      <Text
        style={[
          styles.infoValue,
          { color: colors.text },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

function OverviewCard({
  label,
  value,
  unit,
  colors,
}: {
  label: string;
  value: string;
  unit: string;
  colors: {
    text: string;
    subtext: string;
    card: string;
    border: string;
    primary: string;
  };
}) {
  return (
    <View
      style={[
        styles.overviewCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <View
        style={[
          styles.overviewIcon,
          {
            backgroundColor: "rgba(215,245,44,0.10)",
          },
        ]}
      >
        <Ionicons
          name="analytics-outline"
          size={16}
          color={colors.primary}
        />
      </View>

      <Text
        style={[
          styles.overviewLabel,
          { color: colors.subtext },
        ]}
      >
        {label}
      </Text>

      <View style={styles.overviewValueRow}>
        <Text
          style={[
            styles.overviewValue,
            { color: colors.text },
          ]}
        >
          {value}
        </Text>

        <Text
          style={[
            styles.overviewUnit,
            { color: colors.subtext },
          ]}
        >
          {unit}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
loadingText: {
    fontSize: 12,
    marginTop: 10,
    fontWeight: "600",
  },

  container: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingTop: 28,
    paddingBottom: 48,
  },

  content: {
    width: "100%",
    maxWidth: 820,
    alignSelf: "center",
  },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 22,
  },

  headerText: {
    flex: 1,
    paddingRight: 16,
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
    letterSpacing: 1.5,
  },

  title: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "900",
    letterSpacing: -0.8,
  },

  subtitle: {
    fontSize: 13,
    lineHeight: 20,
    marginTop: 6,
    maxWidth: 590,
  },

  settingsButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  profileHero: {
    minHeight: 170,
    borderRadius: 25,
    borderWidth: 1,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    marginBottom: 27,
  },

  heroGlow: {
    position: "absolute",
    width: 190,
    height: 190,
    borderRadius: 95,
    right: -80,
    top: -80,
  },

  avatar: {
    width: 82,
    height: 82,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 17,
  },

  avatarText: {
    color: "#111111",
    fontSize: 25,
    fontWeight: "900",
    letterSpacing: 1,
  },

  profileIdentity: {
    flex: 1,
  },

  name: {
    fontSize: 23,
    fontWeight: "900",
    letterSpacing: -0.4,
    marginBottom: 4,
  },

  email: {
    fontSize: 12,
    marginBottom: 12,
  },

  goalBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    paddingVertical: 7,
    paddingHorizontal: 11,
  },

  goalDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 7,
  },

  goalBadgeText: {
    fontSize: 11,
    fontWeight: "800",
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  sectionIcon: {
    width: 29,
    height: 29,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "900",
  },

  infoCard: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 17,
    marginBottom: 25,
    overflow: "hidden",
  },

  infoRow: {
    minHeight: 57,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  infoLabel: {
    fontSize: 12,
    fontWeight: "600",
  },

  infoValue: {
    flex: 1,
    textAlign: "right",
    fontSize: 13,
    fontWeight: "800",
    marginLeft: 16,
  },

  preferenceCard: {
    minHeight: 105,
    borderRadius: 20,
    borderWidth: 1,
    padding: 17,
    flexDirection: "row",
    marginBottom: 25,
  },

  preferenceIcon: {
    width: 49,
    height: 49,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  preferenceContent: {
    flex: 1,
  },

  preferenceTitle: {
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 4,
  },

  preferenceValue: {
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 5,
  },

  preferenceDescription: {
    fontSize: 11,
    lineHeight: 17,
  },

  overviewGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 18,
  },

  overviewCard: {
    width: "48%",
    minWidth: 145,
    borderRadius: 18,
    borderWidth: 1,
    padding: 15,
    marginRight: 8,
    marginBottom: 8,
  },

  overviewIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 11,
  },
overviewLabel: {
    fontSize: 10,
    fontWeight: "700",
    marginBottom: 6,
  },

  overviewValueRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },

  overviewValue: {
    fontSize: 23,
    fontWeight: "900",
  },

  overviewUnit: {
    fontSize: 10,
    fontWeight: "700",
    marginLeft: 5,
    marginBottom: 3,
  },

  manageButton: {
    minHeight: 56,
    borderRadius: 17,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  manageButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  manageButtonText: {
    color: "#111111",
    fontSize: 14,
    fontWeight: "900",
    marginLeft: 9,
  },

  footerCard: {
    minHeight: 58,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 11,
    flexDirection: "row",
    alignItems: "center",
  },

  footerText: {
    flex: 1,
    fontSize: 10,
    lineHeight: 15,
    marginLeft: 9,
  },
});