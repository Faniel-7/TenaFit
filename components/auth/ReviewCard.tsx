import React from "react";
import { View, Text, StyleSheet, Pressable, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const isWeb = Platform.OS === "web";

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  onEdit?: () => void;
};

export default function ReviewCard({
  icon,
  label,
  value,
  onEdit,
}: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.iconBox}>
        <Ionicons name={icon} size={18} color="#FFC107" />
      </View>

      <Text style={styles.label}>{label}</Text>

      <Text style={styles.value}>{value}</Text>

      <Pressable style={styles.editButton} onPress={onEdit}>
        <Ionicons name="create-outline" size={14} color="#FFC107" />
        <Text style={styles.editText}>Edit</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: isWeb ? "31%" : 300,
    height: isWeb ? 150 : 82,

    backgroundColor: "#17171E",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#2A2A2A",

    paddingHorizontal: isWeb ? 20 : 14,
    paddingVertical: isWeb ? 20 : 8,

    justifyContent: "space-evenly",
    alignItems: "center",
  },

  iconBox: {
    width: isWeb ? 38 : 34,
    height: isWeb ? 38 : 34,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#221C08",
  },

  label: {
    marginTop: isWeb ? 10 : 4,
    fontSize: 12,
    fontWeight: "700",
    color: "#9CA3AF",
    textAlign: "center",
  },

  value: {
    marginTop: 4,
    fontSize: 17,
    fontWeight: "900",
    color: "#FFFFFF",
    textAlign: "center",
  },

  editButton: {
    marginTop: isWeb ? 12 : 4,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#23232B",
    borderRadius: 10,
    paddingHorizontal: isWeb ? 10 : 8,
    paddingVertical: isWeb ? 6 : 4,
  },

  editText: {
    color: "#FFC107",
    fontSize: 12,
    fontWeight: "800",
    marginLeft: 4,
  },
});