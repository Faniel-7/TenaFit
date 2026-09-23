import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
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
      <View style={styles.content}>
        <View style={styles.header}>
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
                name="settings-outline"
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
              PREFERENCES
            </Text>
          </View>

          <Text
            style={[
              styles.title,
              { color: colors.text },
            ]}
          >
            Settings
          </Text>

          <Text
            style={[
              styles.subtitle,
              { color: colors.subtext },
            ]}
          >
            Manage your TenaFit experience and preferences.
          </Text>
        </View>

        <SectionTitle
          title="Appearance"
          colors={colors}
        />

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
            icon="moon-outline"
            title="Dark mode"
            description={
              isDark
                ? "TenaFit is using dark appearance"
                : "TenaFit is using light appearance"
            }
            colors={colors}
            right={
              <Pressable
                onPress={toggleTheme}
                accessibilityRole="switch"
                accessibilityState={{ checked: isDark }}
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

        <SectionTitle
          title="Account"
          colors={colors}
        />

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
            icon="person-outline"
            title="Profile"
            description="View and manage your personal information"
            colors={colors}
            onPress={() =>
              router.push("/dashboard/profile")
            }
          />

          <Divider colors={colors} />

          <SettingRow
            icon="language-outline"
            title="Language"
            description="English"
            colors={colors}
            value="Soon"
          />
        </View>

        <SectionTitle
          title="TenaFit Premium"
          colors={colors}
        />
<Pressable
          onPress={() =>
            router.push("/dashboard/premium")
          }
          style={({ pressed }) => [
            styles.premiumCard,
            {
              backgroundColor: isPremium
                ? colors.card
                : colors.primary,
              borderColor: isPremium
                ? colors.border
                : colors.primary,
              opacity: pressed ? 0.86 : 1,
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
            <Ionicons
              name="star"
              size={22}
              color={
                isPremium
                  ? colors.primary
                  : "#111111"
              }
            />
          </View>

          <View style={styles.premiumContent}>
            <View style={styles.premiumTitleRow}>
              <Text
                style={[
                  styles.premiumTitle,
                  {
                    color: isPremium
                      ? colors.text
                      : "#111111",
                  },
                ]}
              >
                {isPremium
                  ? "TenaFit Premium"
                  : "Upgrade to Premium"}
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
                {
                  color: isPremium
                    ? colors.subtext
                    : "rgba(17,17,17,0.72)",
                },
              ]}
            >
              {isPremium
                ? "Your premium features are unlocked."
                : "Unlock AI nutrition coaching and future premium features."}
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={21}
            color={
              isPremium
                ? colors.text
                : "#111111"
            }
          />
        </Pressable>

        <SectionTitle
          title="Daily data"
          colors={colors}
        />

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
            icon="refresh-outline"
            title="Reset today's data"
            description="Clear today's meals, water, steps and progress"
            colors={colors}
            onPress={resetDay}
            danger
          />
        </View>

        <SectionTitle
          title="About"
          colors={colors}
        />

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
              {
                backgroundColor: colors.primary,
              },
            ]}
          >
            <Text style={styles.logoText}>T</Text>
          </View>
<View style={styles.aboutContent}>
            <View style={styles.aboutTitleRow}>
              <Text
                style={[
                  styles.aboutTitle,
                  { color: colors.text },
                ]}
              >
                TenaFit
              </Text>

              <View
                style={[
                  styles.versionBadge,
                  {
                    backgroundColor: isDark
                      ? "#22271A"
                      : "#F1F7D9",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.versionBadgeText,
                    { color: colors.primary },
                  ]}
                >
                  1.0.0
                </Text>
              </View>
            </View>

            <Text
              style={[
                styles.aboutText,
                { color: colors.subtext },
              ]}
            >
              Your personalized nutrition and fitness
              companion.
            </Text>
          </View>
        </View>

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
            name="heart-outline"
            size={16}
            color={colors.primary}
          />

          <Text
            style={[
              styles.footer,
              { color: colors.subtext },
            ]}
          >
            Built to help you understand your nutrition,
            stay consistent and reach your goals.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

function SectionTitle({
  title,
  colors,
}: {
  title: string;
  colors: {
    text: string;
    subtext: string;
    primary: string;
  };
}) {
  return (
    <Text
      style={[
        styles.sectionTitle,
        { color: colors.text },
      ]}
    >
      {title}
    </Text>
  );
}

function Divider({
  colors,
}: {
  colors: {
    border: string;
  };
}) {
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
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  colors: {
    text: string;
    subtext: string;
    primary: string;
    border: string;
    background: string;
  };
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
              ? "rgba(239,68,68,0.10)"
              : colors.background,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={20}
          color={
            danger
              ? "#EF4444"
              : colors.primary
          }
        />
      </View>

      <View style={styles.settingContent}>
        <Text
          style={[
            styles.settingTitle,
            {
              color: danger
                ? "#EF4444"
                : colors.text,
            },
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.settingDescription,
            { color: colors.subtext },
          ]}
        >
          {description}
        </Text>
      </View>

      {right}

      {!right && value ? (
        <View
          style={[
            styles.valueBadge,
            {
              backgroundColor: colors.background,
            },
          ]}
        >
          <Text
            style={[
              styles.settingValue,
              { color: colors.subtext },
            ]}
          >
            {value}
          </Text>
        </View>
      ) : null}
{!right && !value && onPress ? (
        <Ionicons
          name="chevron-forward"
          size={19}
          color={colors.subtext}
        />
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
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingTop: 28,
    paddingBottom: 48,
  },

  content: {
    width: "100%",
    maxWidth: 760,
    alignSelf: "center",
  },

  header: {
    marginBottom: 28,
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
    maxWidth: 580,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 10,
  },

  card: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    marginBottom: 25,
    overflow: "hidden",
  },

  settingRow: {
    minHeight: 74,
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

  settingContent: {
    flex: 1,
    paddingRight: 10,
  },

  settingTitle: {
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 3,
  },

  settingDescription: {
    fontSize: 11,
    lineHeight: 17,
  },

  settingValue: {
    fontSize: 10,
    fontWeight: "800",
  },

  valueBadge: {
    minHeight: 28,
    borderRadius: 9,
    paddingHorizontal: 9,
    alignItems: "center",
    justifyContent: "center",
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
  },

  switchThumbActive: {
    transform: [{ translateX: 20 }],
  },

  premiumCard: {
    minHeight: 96,
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

  premiumContent: {
    flex: 1,
    paddingRight: 10,
  },

  premiumTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 4,
  },

  premiumTitle: {
    fontSize: 15,
    fontWeight: "900",
  },

  activeBadge: {
    borderRadius: 999,
    paddingHorizontal: 7,
    paddingVertical: 3,
    marginLeft: 7,
  },

  activeBadgeText: {
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 0.7,
  },

  premiumDescription: {
    fontSize: 11,
    lineHeight: 17,
  },

  aboutCard: {
    minHeight: 88,
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  logo: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  logoText: {
    color: "#111111",
    fontSize: 23,
    fontWeight: "900",
  },

  aboutContent: {
    flex: 1,
  },

  aboutTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },

  aboutTitle: {
    fontSize: 15,
    fontWeight: "900",
  },

  versionBadge: {
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
    marginLeft: 8,
  },

  versionBadgeText: {
    fontSize: 8,
    fontWeight: "900",
  },
aboutText: {
    fontSize: 11,
    lineHeight: 17,
  },

  footerCard: {
    minHeight: 54,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 11,
    flexDirection: "row",
    alignItems: "center",
  },

  footer: {
    flex: 1,
    fontSize: 10,
    lineHeight: 15,
    marginLeft: 9,
  },
});