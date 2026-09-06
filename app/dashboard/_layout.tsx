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
      {/* =====================================================
          DESKTOP SIDEBAR

          Sidebar has a fixed 245px width.
          ===================================================== */}

      {!isMobileWeb && (
        <Sidebar />
      )}

      {/* =====================================================
          PAGE CONTENT

          minHeight: 0 is important here.

          It allows the sidebar's own ScrollView to actually
          receive the available height instead of expanding
          beyond the viewport.
          ===================================================== */}

      <View
        style={[
          styles.content,
          isMobileWeb &&
            styles.mobileContent,
        ]}
      >
        <Slot />
      </View>

      {/* =====================================================
          MOBILE BOTTOM NAV
          ===================================================== */}

      {isMobileWeb && (
        <BottomNav />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    width: "100%",
    height: "100%",

    minHeight: 0,

    flexDirection: "row",

    backgroundColor: "#05070B",

    overflow: "hidden",
  },

  content: {
    flex: 1,

    width: 0,
    minWidth: 0,
    minHeight: 0,

    height: "100%",

    backgroundColor: "#05070B",

    overflow: "hidden",
  },

  mobileContent: {
    width: "100%",
    height: "100%",

    paddingBottom: 85,
  },
});