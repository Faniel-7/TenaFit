import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type QuickActionProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
};

export default function QuickAction({
  icon,
  title,
  subtitle,
  onPress,
}: QuickActionProps) {
  return (
    <Pressable
      style={styles.quickAction}
      onPress={onPress}
    >
      <View style={styles.quickIcon}>
        <Ionicons
          name={icon}
          size={28}
          color="#FFC107"
        />
      </View>

      <View style={styles.quickText}>
        <Text style={styles.quickTitle}>
          {title}
        </Text>

        <Text style={styles.quickSubtitle}>
          {subtitle}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={25}
        color="#FFC107"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  quickAction: {
    flex: 1,
    minWidth: 0,
    minHeight: 95,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#4D4430",
    backgroundColor: "#15140F",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  quickIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: "#FFC107",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },

  quickText: {
    flex: 1,
    minWidth: 0,
    marginLeft: 13,
  },

  quickTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },

  quickSubtitle: {
    color: "#9CA3AF",
    fontSize: 12,
    marginTop: 4,
  },
});