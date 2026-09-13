import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../../context/ThemeContext";
import { usePremium } from "../../context/PremiumContext";
import { useAppData } from "../../context/AppDataContext";

export default function SettingsScreen() {
  const router = useRouter();
  const { colors, isDark, toggleTheme } = useTheme();
  const { isPremium } = usePremium();
  const { resetDay } = useAppData();

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.eyebrow, { color: colors.primary }]}>
          PREFERENCES
        </Text>
        <Text style={[styles.title, { color: colors.text }]}>
          Settings
        </Text>
        <Text style={[styles.subtitle, { color: colors.subtext }]}>
          Manage your TenaFit experience and preferences.
        </Text>
      </View>

      <SectionTitle title="Appearance" colors={colors} />

      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <SettingRow
          icon="◐"
          title="Dark mode"
          description={isDark ? "TenaFit is using dark appearance" : "TenaFit is using light appearance"}
          colors={colors}
          right={
            <Pressable
              onPress={toggleTheme}
              style={[
                styles.switch,
                {
                  backgroundColor: isDark
                    ? colors.primary
                    : colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.switchThumb,
                  isDark && styles.switchThumbActive,
                ]}
              />
            </Pressable>
          }
        />
      </View>

      <SectionTitle title="Account" colors={colors} />

      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <SettingRow
          icon="◉"
          title="Profile"
          description="View and manage your personal information"
          colors={colors}
          onPress={() => router.push("/dashboard/profile")}
        />

        <Divider colors={colors} />

        <SettingRow
          icon="⌁"
          title="Language"
          description="English"
          colors={colors}
          onPress={() => {}}
          value="Soon"
        />
      </View>

      <SectionTitle title="TenaFit Premium" colors={colors} />

      <Pressable
        onPress={() => router.push("/dashboard/premium")}
        style={({ pressed }) => [
          styles.premiumCard,
          {
            backgroundColor: isPremium
              ? colors.card
              : colors.primary,
            borderColor: isPremium
              ? colors.border
              : colors.primary,
            opacity: pressed ? 0.85 : 1,
          },
        ]}
      >
        <View
          style={[
            styles.premiumIcon,
            {
              backgroundColor: isPremium
                ? isDark
                  ? "rgba(255,255,255,0.07)"
                  : "rgba(0,0,0,0.05)"
                : "rgba(255,255,255,0.16)",
            },
          ]}
        >
          <Text
            style={[
              styles.premiumIconText,
              { color: isPremium ? colors.primary : "#FFFFFF" },
            ]}
          >
            ★
          </Text>
        </View>
<View style={styles.premiumContent}>
          <View style={styles.premiumTitleRow}>
            <Text
              style={[
                styles.premiumTitle,
                { color: isPremium ? colors.text : "#FFFFFF" },
              ]}
            >
              {isPremium ? "TenaFit Premium" : "Upgrade to Premium"}
            </Text>

            {isPremium ? (
              <View
                style={[
                  styles.activeBadge,
                  {
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.07)"
                      : "rgba(0,0,0,0.05)",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.activeBadgeText,
                    { color: colors.primary },
                  ]}
                >
                  ACTIVE
                </Text>
              </View>
            ) : null}
          </View>

          <Text
            style={[
              styles.premiumDescription,
              { color: isPremium ? colors.subtext : "rgba(255,255,255,0.82)" },
            ]}
          >
            {isPremium
              ? "Your premium features are unlocked."
              : "Unlock AI nutrition coaching and future premium features."}
          </Text>
        </View>

        <Text
          style={[
            styles.chevron,
            { color: isPremium ? colors.text : "#FFFFFF" },
          ]}
        >
          ›
        </Text>
      </Pressable>

      <SectionTitle title="Daily data" colors={colors} />

      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <SettingRow
          icon="↻"
          title="Reset today's data"
          description="Clear today's meals, water, steps and progress"
          colors={colors}
          onPress={resetDay}
          danger
        />
      </View>

      <SectionTitle title="About" colors={colors} />

      <View
        style={[
          styles.aboutCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <View
          style={[
            styles.logo,
            { backgroundColor: colors.primary },
          ]}
        >
          <Text style={styles.logoText}>T</Text>
        </View>

        <View style={styles.aboutContent}>
          <Text style={[styles.aboutTitle, { color: colors.text }]}>
            TenaFit
          </Text>

          <Text style={[styles.aboutText, { color: colors.subtext }]}> 
            Your personalized nutrition and fitness companion.
          </Text>

          <Text style={[styles.version, { color: colors.secondary }]}>
            Version 1.0.0
          </Text>
        </View>
      </View>

      <Text style={[styles.footer, { color: colors.subtext }]}>
        Built to help you understand your nutrition, stay consistent and
        reach your goals.
      </Text>
    </ScrollView>
  );
}

function SectionTitle({
  title,
  colors,
}: {
  title: string;
  colors: any;
}) {
  return (
    <Text style={[styles.sectionTitle, { color: colors.text }]}>
      {title}
    </Text>
  );
}

function Divider({ colors }: { colors: any }) {
  return (
    <View
      style={[
        styles.divider,
        { backgroundColor: colors.border },
      ]}
    />
  );
}

function SettingRow({
  icon,
  title,
  description,
  colors,
  onPress,
  right,
  value,
  danger = false,
}: {
  icon: string;
  title: string;
  description: string;
  colors: any;
  onPress?: () => void;
  right?: React.ReactNode;
  value?: string;
  danger?: boolean;
}) {
  const content = (
    <View style={styles.settingRow}>
<View
        style={[
          styles.settingIcon,
          {
            backgroundColor: danger
              ? "rgba(220,70,70,0.09)"
              : colors.background,
          },
        ]}
      >
        <Text
          style={[
            styles.settingIconText,
            { color: danger ? "#D64C4C" : colors.primary },
          ]}
        >
          {icon}
        </Text>
      </View>

      <View style={styles.settingContent}>
        <Text
          style={[
            styles.settingTitle,
            { color: danger ? "#D64C4C" : colors.text },
          ]}
        >
          {title}
        </Text>

        <Text style={[styles.settingDescription, { color: colors.muted }]}>
          {description}
        </Text>
      </View>

      {right}

      {!right && value ? (
        <Text style={[styles.settingValue, { color: colors.muted }]}>
          {value}
        </Text>
      ) : null}

      {!right && !value && onPress ? (
        <Text style={[styles.chevron, { color: colors.muted }]}>›</Text>
      ) : null}
    </View>
  );

  if (!onPress) {
    return content;
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.65 : 1,
      })}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 48,
  },
  header: {
    marginBottom: 26,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.7,
    marginBottom: 5,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.8,
    marginBottom: 7,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 11,
  },
  card: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 17,
    marginBottom: 25,
    overflow: "hidden",
  },
  settingRow: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
  },
  settingIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },
  settingIconText: {
    fontSize: 19,
    fontWeight: "700",
  },
  settingContent: {
    flex: 1,
    paddingRight: 12,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 3,
  },
  settingDescription: {
    fontSize: 12,
    lineHeight: 17,
  },
  settingValue: {
    fontSize: 12,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    marginLeft: 56,
  },
  switch: {
    width: 50,
    height: 30,
    borderRadius: 20,
    padding: 3,
    justifyContent: "center",
  },
  switchThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    transform: [{ translateX: 0 }],
  },
  switchThumbActive: {
    transform: [{ translateX: 20 }],
  },
  premiumCard: {
    minHeight: 94,
    borderRadius: 22,
    borderWidth: 1,
    padding: 17,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  premiumIcon: {
    width: 49,
    height: 49,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },
  premiumIconText: {
    fontSize: 23,
    fontWeight: "800",
  },
  premiumContent: {
    flex: 1,
  },
  premiumTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  premiumTitle: {
    fontSize: 15,
    fontWeight: "800",
  },
  activeBadge: {
    borderRadius: 999,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  activeBadgeText: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.7,
  },
  premiumDescription: {
    fontSize: 12,
    lineHeight: 17,
    paddingRight: 5,
  },
  chevron: {
    fontSize: 26,
    fontWeight: "300",
marginLeft: 8,
  },
  aboutCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  logo: {
    width: 55,
    height: 55,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  logoText: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "900",
  },
  aboutContent: {
    flex: 1,
  },
  aboutTitle: {
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 4,
  },
  aboutText: {
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 5,
  },
  version: {
    fontSize: 11,
  },
  footer: {
    textAlign: "center",
    fontSize: 12,
    lineHeight: 18,
    paddingHorizontal: 15,
  },
});