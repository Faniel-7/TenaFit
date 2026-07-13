import React from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Platform,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";

type Props = {
  children: React.ReactNode;
  scrollable?: boolean;
  wide?: boolean;
};

export default function ScreenContainer({
  children,
  scrollable = true,
  wide = false,
}: Props) {
  const { colors } = useTheme();
  const isWeb = Platform.OS === "web";

  const innerStyle: ViewStyle[] = [
    styles.inner,
    ...(isWeb && !wide ? [styles.webInnerNarrow] : []),
    ...(isWeb && wide ? [styles.webInnerWide] : []),
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      {scrollable ? (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={innerStyle}>{children}</View>
        </ScrollView>
      ) : (
        <View style={styles.flex}>
          <View style={innerStyle}>{children}</View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
  },
  inner: {
    width: "100%",
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  webInnerNarrow: {
    maxWidth: 390,
    alignSelf: "center",
  },
  webInnerWide: {
    maxWidth: 1200,
    alignSelf: "center",
    paddingHorizontal: 70,
  },
});