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
  const { width, height } =
    useWindowDimensions();

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
      {!isMobileWeb && (
        <View
          style={[
            styles.sidebarWrapper,
            {
              height,
            },
          ]}
        >
          <Sidebar />
        </View>
      )}

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
    width: "100%",
    minWidth: 0,
    minHeight: 0,
    flexDirection: "row",
    backgroundColor: "#05070B",
    overflow: "hidden",
  },

  sidebarWrapper: {
    width: 244,
    height: "100%",
    flexShrink: 0,
    overflow: "hidden",
  },

  content: {
    flex: 1,
    width: 0,
    height: "100%",
    minWidth: 0,
    minHeight: 0,
    backgroundColor: "#05070B",
    overflow: "hidden",
  },

  mobileContent: {
    width: "100%",
    minWidth: 0,
    minHeight: 0,
    paddingBottom: 84,
  },
});