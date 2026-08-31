import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";
import {
  router,
  useLocalSearchParams,
} from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function DashboardSectionScreen() {
  const { section } =
    useLocalSearchParams<{
      section?: string;
    }>();

  const title =
    formatSectionTitle(
      section ?? "section"
    );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() =>
            router.back()
          }
        >
          <Ionicons
            name="arrow-back"
            size={20}
            color="#FFC107"
          />
        </Pressable>

        <Text
          style={styles.headerTitle}
        >
          TenaFit
        </Text>
      </View>

      <View
        style={styles.content}
      >
        <View
          style={styles.iconCircle}
        >
          <Ionicons
            name={getIcon(section)}
            size={34}
            color="#FFC107"
          />
        </View>

        <Text
          style={styles.title}
        >
          {title}
        </Text>

        <Text
          style={styles.subtitle}
        >
          This section is connected
          to navigation and will be
          built in its roadmap step.
        </Text>

        <Pressable
          style={styles.homeButton}
          onPress={() =>
            router.replace(
              "/home"
            )
          }
        >
          <Text
            style={styles.homeButtonText}
          >
            Back to Home
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function formatSectionTitle(
  value: string
) {
  return value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function getIcon(
  section?: string
): keyof typeof Ionicons.glyphMap {
  switch (section) {
    case "plan":
      return "calendar-outline";

    case "progress":
      return "bar-chart-outline";

    case "meals":
      return "restaurant-outline";

    case "workouts":
      return "barbell-outline";

    case "water":
      return "water-outline";

    case "reports":
      return "document-text-outline";

    case "settings":
      return "settings-outline";

    case "profile":
      return "person-circle-outline";

    default:
      return "apps-outline";
  }
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        "#05070B",
    },

    header: {
      height: 75,
      flexDirection:
        "row",
      alignItems:
        "center",
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor:
        "#252A34",
    },

    backButton: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor:
        "#17171E",
      borderWidth: 1,
      borderColor:
        "#2A2A2A",
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    headerTitle: {
      color: "#FFFFFF",
      fontSize: 22,
      fontWeight: "900",
      marginLeft: 15,
    },

    content: {
      flex: 1,
      alignItems:
        "center",
      justifyContent:
        "center",
      paddingHorizontal: 30,
    },

    iconCircle: {
      width: 76,
      height: 76,
      borderRadius: 38,
      backgroundColor:
        "#17171E",
      borderWidth: 1,
      borderColor:
        "#3A3422",
      alignItems:
        "center",
      justifyContent:
        "center",
      marginBottom: 20,
    },

    title: {
      color: "#FFFFFF",
      fontSize: 30,
      fontWeight: "900",
      textAlign: "center",
    },

    subtitle: {
      color: "#9CA3AF",
      fontSize: 15,
      lineHeight: 22,
      textAlign: "center",
      marginTop: 10,
      maxWidth: 420,
    },

    homeButton: {
      marginTop: 25,
      backgroundColor:
        "#FFC107",
      paddingHorizontal: 25,
      paddingVertical: 13,
      borderRadius: 12,
    },
homeButtonText: {
      color: "#111111",
      fontSize: 14,
      fontWeight: "900",
    },
  });