import React from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "../../context/ThemeContext";
import { useAppData } from "../../context/AppDataContext";

export default function SettingsScreen() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { resetDay } = useAppData();

  const isDark = theme === "dark";

  const colors = {
    background: isDark ? "#0B0F14" : "#F6F8FA",
    card: isDark ? "#151B23" : "#FFFFFF",
    text: isDark ? "#FFFFFF" : "#111827",
    secondary: isDark ? "#9CA3AF" : "#6B7280",
    border: isDark ? "#252D38" : "#E5E7EB",
    accent: "#4F8EF7",
    danger: "#EF4444",
  };

  const handleReset = () => {
    Alert.alert(
      "Reset today's data",
      "This will remove today's tracked meals, water, steps, and progress. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: resetDay,
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
            <Text style={[styles.subtitle, { color: colors.secondary }]}>
              Manage your TenaFit preferences
            </Text>
          </View>

          <View
            style={[
              styles.headerIcon,
              {
                backgroundColor: isDark ? "#1C2633" : "#EAF2FF",
              },
            ]}
          >
            <Ionicons name="settings-outline" size={24} color={colors.accent} />
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.secondary }]}>
          APPEARANCE
        </Text>

        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.row}>
            <View
              style={[
                styles.iconBox,
                {
                  backgroundColor: isDark ? "#24202F" : "#F3EFFF",
                },
              ]}
            >
              <Ionicons
                name={isDark ? "moon-outline" : "sunny-outline"}
                size={22}
                color={isDark ? "#A78BFA" : "#F59E0B"}
              />
            </View>

            <View style={styles.rowText}>
              <Text style={[styles.itemTitle, { color: colors.text }]}>
                Dark mode
              </Text>
              <Text style={[styles.itemSubtitle, { color: colors.secondary }]}>
                {isDark ? "Dark appearance is enabled" : "Light appearance is enabled"}
              </Text>
            </View>

            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{
                false: isDark ? "#374151" : "#D1D5DB",
                true: colors.accent,
              }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.secondary }]}>
          ACCOUNT
        </Text>

        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Pressable
            style={styles.menuRow}
            onPress={() => router.push("/dashboard/profile")}
>
            <View
              style={[
                styles.iconBox,
                {
                  backgroundColor: isDark ? "#182A24" : "#ECFDF5",
                },
              ]}
            >
              <Ionicons name="person-outline" size={22} color="#10B981" />
            </View>

            <View style={styles.rowText}>
              <Text style={[styles.itemTitle, { color: colors.text }]}>
                Profile
              </Text>
              <Text style={[styles.itemSubtitle, { color: colors.secondary }]}>
                Update your personal and nutrition information
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.secondary}
            />
          </Pressable>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <Pressable style={styles.menuRow}>
            <View
              style={[
                styles.iconBox,
                {
                  backgroundColor: isDark ? "#28221A" : "#FFF7ED",
                },
              ]}
            >
              <Ionicons name="language-outline" size={22} color="#F97316" />
            </View>

            <View style={styles.rowText}>
              <Text style={[styles.itemTitle, { color: colors.text }]}>
                Language
              </Text>
              <Text style={[styles.itemSubtitle, { color: colors.secondary }]}>
                English
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.secondary}
            />
          </Pressable>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.secondary }]}>
          DAILY DATA
        </Text>

        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Pressable style={styles.menuRow} onPress={handleReset}>
            <View
              style={[
                styles.iconBox,
                {
                  backgroundColor: isDark ? "#301C20" : "#FEF2F2",
                },
              ]}
            >
              <Ionicons name="refresh-outline" size={22} color={colors.danger} />
            </View>

            <View style={styles.rowText}>
              <Text style={[styles.itemTitle, { color: colors.danger }]}>
                Reset today's data
              </Text>
              <Text style={[styles.itemSubtitle, { color: colors.secondary }]}>
                Clear today's meals, water, steps, and progress
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.secondary}
            />
          </Pressable>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.secondary }]}>
          ABOUT
        </Text>

        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.menuRow}>
            <View
              style={[
                styles.iconBox,
                {
                  backgroundColor: isDark ? "#182536" : "#EFF6FF",
                },
              ]}
            >
              <Ionicons
                name="information-circle-outline"
                size={22}
                color={colors.accent}
              />
            </View>

            <View style={styles.rowText}>
              <Text style={[styles.itemTitle, { color: colors.text }]}>
                TenaFit
              </Text>
              <Text style={[styles.itemSubtitle, { color: colors.secondary }]}>
                Your personalized nutrition companion
              </Text>
            </View>
<Text style={[styles.version, { color: colors.secondary }]}>
              v1.0
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.footer,
            {
              backgroundColor: isDark ? "#111820" : "#EEF5FF",
            },
          ]}
        >
          <Ionicons name="heart-outline" size={18} color={colors.accent} />
          <Text style={[styles.footerText, { color: colors.secondary }]}>
            Stay consistent. Your progress starts today.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.6,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 5,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginBottom: 10,
    marginTop: 6,
  },
  card: {
    borderWidth: 1,
    borderRadius: 18,
    marginBottom: 24,
    overflow: "hidden",
  },
  row: {
    minHeight: 76,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuRow: {
    minHeight: 78,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },
  rowText: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  itemSubtitle: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 3,
    paddingRight: 8,
  },
  divider: {
    height: 1,
    marginLeft: 73,
  },
  version: {
    fontSize: 12,
    fontWeight: "600",
  },
  footer: {
    minHeight: 54,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    gap: 8,
  },
  footerText: {
    fontSize: 12,
    fontWeight: "500",
  },
});