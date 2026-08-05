import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SocialButtons() {
  return (
    <View style={styles.container}>
      <Pressable style={styles.button}>
        <Ionicons name="logo-google" size={24} color="#fff" />
      </Pressable>

      <Pressable style={styles.button}>
        <Ionicons name="logo-facebook" size={24} color="#fff" />
      </Pressable>

      <Pressable style={styles.button}>
        <Ionicons name="logo-apple" size={24} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 18,
    marginTop: 20,
  },

  button: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#17171E",
    justifyContent: "center",
    alignItems: "center",
  },
});