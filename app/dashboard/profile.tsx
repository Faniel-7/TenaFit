import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

export default function ProfileScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { user } = useAuth();

  const profile = (user as { profile?: any } | null | undefined)?.profile;

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
          : "High activity";

  const foodLabel =
    profile?.foodPreference === "local"
      ? "Local foods"
      : profile?.foodPreference === "other"
        ? "International foods"
        : "Local + international";

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <View style={styles.topBar}>
        <View>
          <Text style={[styles.eyebrow, { color: colors.primary }]}>
            MY PROFILE
          </Text>
          <Text style={[styles.pageTitle, { color: colors.text }]}>
            Your profile
          </Text>
        </View>

        <Pressable
          onPress={() => router.push("/dashboard/settings")}
          style={({ pressed }) => [
            styles.settingsButton,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <Text style={[styles.settingsIcon, { color: colors.text }]}>⚙</Text>
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
                ? "rgba(255,255,255,0.04)"
                : "rgba(0,0,0,0.025)",
            },
          ]}
        />

        <View
          style={[
            styles.avatar,
            {
              backgroundColor: colors.primary,
            },
          ]}
        >
          <Text style={styles.avatarText}>FN</Text>
        </View>

        <View style={styles.profileIdentity}>
          <Text style={[styles.name, { color: colors.text }]}>
            {(user as { name?: string } | null | undefined)?.name || "TenaFit User"}
          </Text>

          <Text style={[styles.email, { color: colors.subtext }]}>
            {user?.email || "Your personal fitness profile"}
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
            <Text style={[styles.goalBadgeText, { color: colors.text }]}>
              {goalLabel}
            </Text>
          </View>
        </View>
      </View>

      <SectionHeader title="Personal information" colors={colors} />

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
          value={profile?.age ? `${profile.age} years` : "Not set"}
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
          value={profile?.heightCm ? `${profile.heightCm} cm` : "Not set"}
          colors={colors}
        />

        <InfoRow
          label="Weight"
          value={profile?.weightKg ? `${profile.weightKg} kg` : "Not set"}
          colors={colors}
          last
        />
      </View>

      <SectionHeader title="Lifestyle" colors={colors} />

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

      <SectionHeader title="Food preference" colors={colors} />

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
                ? "rgba(255,255,255,0.06)"
                : "rgba(0,0,0,0.045)",
            },
          ]}
        >
          <Text style={styles.foodIcon}>⌁</Text>
        </View>

        <View style={styles.preferenceContent}>
          <Text style={[styles.preferenceTitle, { color: colors.text }]}>
            Your food style
          </Text>

          <Text style={[styles.preferenceValue, { color: colors.primary }]}>
            {foodLabel}
          </Text>

          <Text style={[styles.preferenceDescription, { color: colors.subtext }]}>
            Your meal recommendations are personalized around this preference.
          </Text>
        </View>
      </View>

      <SectionHeader title="Quick overview" colors={colors} />

      <View style={styles.overviewGrid}>
        <OverviewCard
          label="Height"
          value={profile?.heightCm ? `${profile.heightCm}` : "—"}
          unit="cm"
          colors={colors}
        />

        <OverviewCard
          label="Weight"
          value={profile?.weightKg ? `${profile.weightKg}` : "—"}
          unit="kg"
          colors={colors}
        />

        <OverviewCard
          label="Training"
          value={profile?.daysPerWeek ? `${profile.daysPerWeek}` : "—"}
          unit="days"
          colors={colors}
        />

        <OverviewCard
          label="Sessions"
          value={profile?.minutesPerDay ? `${profile.minutesPerDay}` : "—"}
          unit="min"
          colors={colors}
        />
      </View>

      <Pressable
        onPress={() => router.push("/dashboard/settings")}
        style={({ pressed }) => [
          styles.editButton,
          {
            backgroundColor: colors.primary,
            opacity: pressed ? 0.8 : 1,
          },
        ]}
      >
        <Text style={styles.editButtonText}>Manage profile</Text>
        <Text style={styles.arrow}>→</Text>
      </Pressable>

      <Text style={[styles.footer, { color: colors.subtext }]}> 
        TenaFit uses your profile to personalize nutrition recommendations,
        meal plans and progress tracking.
      </Text>
    </ScrollView>
  );
}
function SectionHeader({
  title,
  colors,
}: {
  title: string;
  colors: any;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
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
  colors: any;
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
      <Text style={[styles.infoLabel, { color: colors.muted }]}>
        {label}
      </Text>

      <Text style={[styles.infoValue, { color: colors.text }]}>
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
  colors: any;
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
      <Text style={[styles.overviewLabel, { color: colors.muted }]}>
        {label}
      </Text>

      <View style={styles.overviewValueRow}>
        <Text style={[styles.overviewValue, { color: colors.text }]}>
          {value}
        </Text>

        <Text style={[styles.overviewUnit, { color: colors.muted }]}>
          {unit}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 48,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.7,
    marginBottom: 5,
  },
  pageTitle: {
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.8,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  settingsIcon: {
    fontSize: 21,
  },
  profileHero: {
    minHeight: 178,
    borderRadius: 26,
    borderWidth: 1,
    padding: 22,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    marginBottom: 28,
  },
  heroGlow: {
    position: "absolute",
    width: 190,
    height: 190,
    borderRadius: 95,
    right: -80,
    top: -75,
  },
  avatar: {
    width: 82,
    height: 82,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 18,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "800",
    letterSpacing: 1,
  },
  profileIdentity: {
    flex: 1,
  },
  name: {
    fontSize: 23,
    fontWeight: "800",
    marginBottom: 5,
  },
  email: {
    fontSize: 13,
    marginBottom: 13,
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
    fontSize: 12,
    fontWeight: "700",
  },
  sectionHeader: {
    marginBottom: 11,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
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
    gap: 16,
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    flex: 1,
    textAlign: "right",
    fontSize: 14,
    fontWeight: "700",
  },
  preferenceCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    flexDirection: "row",
marginBottom: 25,
  },
  preferenceIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  foodIcon: {
    color: "#FFFFFF",
    fontSize: 27,
    fontWeight: "700",
  },
  preferenceContent: {
    flex: 1,
  },
  preferenceTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  preferenceValue: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 5,
  },
  preferenceDescription: {
    fontSize: 12,
    lineHeight: 18,
  },
  overviewGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 25,
  },
  overviewCard: {
    width: "47%",
    flexGrow: 1,
    minWidth: 145,
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
  },
  overviewLabel: {
    fontSize: 12,
    marginBottom: 8,
  },
  overviewValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  overviewValue: {
    fontSize: 24,
    fontWeight: "800",
  },
  overviewUnit: {
    fontSize: 12,
    marginLeft: 5,
  },
  editButton: {
    minHeight: 54,
    borderRadius: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  editButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  arrow: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "600",
  },
  footer: {
    textAlign: "center",
    fontSize: 12,
    lineHeight: 18,
    paddingHorizontal: 12,
  },
});