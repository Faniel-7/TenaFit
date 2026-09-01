import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type DashboardPageProps = {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  children: React.ReactNode;
};

export default function DashboardPage({
  title,
  subtitle,
  icon,
  children,
}: DashboardPageProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.title}>
              {title}
            </Text>

            <Text style={styles.subtitle}>
              {subtitle}
            </Text>
          </View>

          <View style={styles.iconBox}>
            <Ionicons
              name={icon}
              size={25}
              color="#FFC107"
            />
          </View>
        </View>

        {children}
      </ScrollView>
    </View>
  );
}

export function DashboardCard({
  icon,
  title,
  description,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  value?: string;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.cardIcon}>
        <Ionicons
          name={icon}
          size={22}
          color="#FFC107"
        />
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>
          {title}
        </Text>

        {description && (
          <Text style={styles.cardDescription}>
            {description}
          </Text>
        )}
      </View>

      {value && (
        <Text style={styles.cardValue}>
          {value}
        </Text>
      )}
    </View>
  );
}

export function DashboardSection({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {title}
      </Text>

      {subtitle && (
        <Text style={styles.sectionSubtitle}>
          {subtitle}
        </Text>
      )}

      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );
}

export function EmptyState({
  icon,
  title,
  description,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}) {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Ionicons
          name={icon}
          size={30}
          color="#FFC107"
        />
      </View>

      <Text style={styles.emptyTitle}>
        {title}
      </Text>

      <Text style={styles.emptyDescription}>
        {description}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05070B",
  },

  content: {
    padding: 28,
    paddingBottom: 60,
    width: "100%",
    maxWidth: 1100,
    alignSelf: "center",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
  },

  headerText: {
    flex: 1,
    paddingRight: 15,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
  },

  subtitle: {
    color: "#8F96A3",
    fontSize: 14,
    marginTop: 6,
    lineHeight: 20,
  },

  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 15,
    backgroundColor: "#171A21",
    borderWidth: 1,
    borderColor: "#303540",
    alignItems: "center",
    justifyContent: "center",
  },

  section: {
    marginBottom: 27,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "900",
  },

  sectionSubtitle: {
    color: "#737B89",
    fontSize: 12,
    marginTop: 4,
  },

  sectionContent: {
    marginTop: 13,
  },
card: {
    minHeight: 72,
    backgroundColor: "#10141B",
    borderWidth: 1,
    borderColor: "#242A34",
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    marginBottom: 9,
  },

  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: "#1D1B14",
    alignItems: "center",
    justifyContent: "center",
  },

  cardBody: {
    flex: 1,
    marginLeft: 13,
  },

  cardTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },

  cardDescription: {
    color: "#737B89",
    fontSize: 11,
    marginTop: 4,
    lineHeight: 16,
  },

  cardValue: {
    color: "#FFC107",
    fontSize: 12,
    fontWeight: "900",
    marginLeft: 10,
  },

  emptyState: {
    backgroundColor: "#10141B",
    borderWidth: 1,
    borderColor: "#242A34",
    borderRadius: 17,
    padding: 30,
    alignItems: "center",
  },

  emptyIcon: {
    width: 62,
    height: 62,
    borderRadius: 20,
    backgroundColor: "#1D1B14",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
    textAlign: "center",
  },

  emptyDescription: {
    color: "#737B89",
    fontSize: 12,
    lineHeight: 19,
    textAlign: "center",
    marginTop: 7,
    maxWidth: 500,
  },
});