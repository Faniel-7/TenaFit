import React from "react";
import {
  View,
  StyleSheet,
  Platform,
  useWindowDimensions,
} from "react-native";
import { Slot } from "expo-router";

import Sidebar from "../../components/dashboard/Sidebar";
import BottomNav from "../../components/dashboard/BottomNav";

export default function DashboardLayout() {
  const { width, height } = useWindowDimensions();

  const isMobileWeb =
    Platform.OS === "web" &&
    width <= 767;

  return (
    <View
      style={[
        styles.container,
        Platform.OS === "web" && {
          height,
        },
      ]}
    >
      {/* =====================================================
          DESKTOP SIDEBAR

          The Sidebar owns its own internal layout.
          It is NOT part of the page ScrollView.
      ====================================================== */}

      {!isMobileWeb && (
        <View style={styles.sidebarWrapper}>
          <Sidebar />
        </View>
      )}

      {/* =====================================================
          DASHBOARD CONTENT

          The individual dashboard screen controls its own
          scrolling.
      ====================================================== */}

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
          MOBILE NAVIGATION
      ====================================================== */}

      {isMobileWeb && <BottomNav />}
    </View>
  );
}

const styles = StyleSheet.create({
  /* =========================================================
     DASHBOARD ROOT

     This is the full viewport.

     overflow: hidden prevents dashboard content from
     physically escaping over the sidebar.
  ========================================================== */

  container: {
    flex: 1,
    width: "100%",
    minWidth: 0,
    minHeight: 0,
    flexDirection: "row",
    backgroundColor: "#05070B",
    overflow: "hidden",
  },

  /* =========================================================
     SIDEBAR WRAPPER

     Gives the sidebar a definite height equal to the
     dashboard viewport.

     This is important because Sidebar uses:
       height: "100%"
  ========================================================== */

  sidebarWrapper: {
    height: "100%",
    flexShrink: 0,
    overflow: "hidden",
  },

  /* =========================================================
     MAIN CONTENT
  ========================================================== */

  content: {
    flex: 1,
    width: 0,
    height: "100%",
    minWidth: 0,
    minHeight: 0,
    backgroundColor: "#05070B",
    overflow: "hidden",
  },

  /* =========================================================
     MOBILE CONTENT
  ========================================================== */

  mobileContent: {
    width: "100%",
    minWidth: 0,
    minHeight: 0,
    paddingBottom: 85,
  },
});