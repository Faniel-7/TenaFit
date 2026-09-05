import React from "react";
import {
  View,
  StyleSheet,
  Platform,
} from "react-native";
import { Slot } from "expo-router";

import Sidebar from "../../components/dashboard/Sidebar";
import BottomNav from "../../components/dashboard/BottomNav";

export default function DashboardLayout() {
  const isMobileWeb =
    Platform.OS === "web" &&
    typeof window !== "undefined" &&
    window.innerWidth <= 767;

  return (
    <View style={styles.container}>
      {!isMobileWeb && <Sidebar />}

      <View
        style={[
          styles.content,
          isMobileWeb &&
            styles.mobileContent,
        ]}
      >
        <Slot />
      </View>

      {isMobileWeb && <BottomNav />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#05070B",
  },

  content: {
    flex: 1,
    minWidth: 0,
    minHeight: 0,
    backgroundColor: "#05070B",
  },

  mobileContent: {
    width: "100%",
    paddingBottom: 85,
  },
});