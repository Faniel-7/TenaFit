import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const { width, height } = Dimensions.get("window");

const SCANNER_SIZE = Math.min(width - 56, 310);

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();

  const [scanned, setScanned] = useState(false);
  const [torch, setTorch] = useState(false);

  const scanLine = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!permission?.granted) return;

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLine, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(scanLine, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.035,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );

    pulseAnimation.start();

    return () => {
      animation.stop();
      pulseAnimation.stop();
    };
  }, [permission?.granted]);

  const handleBarcodeScanned = ({
    data,
    type,
  }: {
    data: string;
    type: string;
  }) => {
    if (scanned) return;

    setScanned(true);

    /*
     * For now we only capture the barcode.
     *
     * The next layer will:
     * 1. Search the food database
     * 2. Retrieve nutrition information
     * 3. Compare it with the user's TenaFit target
     * 4. Show the Food Result screen
     */

    console.log("Barcode:", data);
    console.log("Type:", type);

    setTimeout(() => {
      setScanned(false);
    }, 1200);
  };

  if (!permission) {
    return (
      <View style={styles.loadingScreen}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={styles.loadingText}>Preparing scanner...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permissionScreen}>
        <StatusBar barStyle="dark-content" />

        <Pressable
          style={styles.permissionClose}
          onPress={() => router.back()}
        >
          <Ionicons name="close" size={25} color="#111827" />
        </Pressable>

        <View style={styles.permissionIcon}>
          <Ionicons name="scan-outline" size={54} color="#FFFFFF" />
        </View>

        <Text style={styles.permissionTitle}>
          Scan your food
        </Text>

        <Text style={styles.permissionDescription}>
          TenaFit needs access to your camera to scan food barcodes and
          identify their nutrition information.
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.permissionButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={requestPermission}
        >
          <Ionicons name="camera-outline" size={21} color="#FFFFFF" />

          <Text style={styles.permissionButtonText}>
            Allow Camera Access
          </Text>
        </Pressable>

        <Text style={styles.permissionNote}>
          Your camera is only used when you are scanning.
        </Text>
      </SafeAreaView>
    );
  }

  const scanTranslateY = scanLine.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SCANNER_SIZE - 12],
  });

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
<CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        enableTorch={torch}
        barcodeScannerSettings={{
          barcodeTypes: [
            "ean13",
            "ean8",
            "upc_a",
            "upc_e",
            "code128",
            "code39",
            "code93",
            "itf14",
            "codabar",
            "qr",
          ],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
      />

      <View style={styles.darkOverlay} />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            style={({ pressed }) => [
              styles.headerButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={25} color="#FFFFFF" />
          </Pressable>

          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Scan Food</Text>
            <Text style={styles.headerSubtitle}>
              Discover what's inside
            </Text>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.headerButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => setTorch((current) => !current)}
          >
            <Ionicons
              name={torch ? "flash" : "flash-outline"}
              size={22}
              color={torch ? "#FACC15" : "#FFFFFF"}
            />
          </Pressable>
        </View>

        {/* Main scanner content */}
        <View style={styles.scannerContent}>
          <View style={styles.instructionPill}>
            <View style={styles.liveDot} />

            <Text style={styles.instructionText}>
              {scanned
                ? "Food detected"
                : "Place the barcode inside the frame"}
            </Text>
          </View>

          <Animated.View
            style={[
              styles.scannerFrame,
              {
                transform: [{ scale: pulse }],
              },
            ]}
          >
            {/* Corner borders */}
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />

            {/* Animated scan line */}
            {!scanned && (
              <Animated.View
                style={[
                  styles.scanLine,
                  {
                    transform: [{ translateY: scanTranslateY }],
                  },
                ]}
              >
                <View style={styles.scanGlow} />
              </Animated.View>
            )}

            {/* Center icon when detected */}
            {scanned && (
              <View style={styles.detectedContainer}>
                <View style={styles.detectedCircle}>
                  <Ionicons
                    name="checkmark"
                    size={40}
                    color="#FFFFFF"
                  />
                </View>

                <Text style={styles.detectedText}>
                  Barcode detected
                </Text>
              </View>
            )}
          </Animated.View>

          <Text style={styles.scannerTitle}>
            Scan a food barcode
          </Text>

          <Text style={styles.scannerDescription}>
            Hold your phone steady and position the barcode clearly
            inside the frame.
          </Text>

          {/* Supported formats */}
          <View style={styles.supportedContainer}>
            <View style={styles.supportedIcon}>
              <Ionicons
                name="barcode-outline"
                size={19}
                color="#FFFFFF"
              />
            </View>

            <View>
              <Text style={styles.supportedTitle}>
                Food barcode
              </Text>
<Text style={styles.supportedSubtitle}>
                EAN • UPC • Code 128 • QR
              </Text>
            </View>
          </View>
        </View>

        {/* Bottom panel */}
        <View style={styles.bottomPanel}>
          <View style={styles.bottomHandle} />

          <View style={styles.bottomRow}>
            <View style={styles.bottomInfo}>
              <View style={styles.bottomIcon}>
                <Ionicons
                  name="nutrition-outline"
                  size={22}
                  color="#FFFFFF"
                />
              </View>

              <View style={styles.bottomTextContainer}>
                <Text style={styles.bottomTitle}>
                  Smart nutrition lookup
                </Text>

                <Text style={styles.bottomSubtitle}>
                  Get calories and macros instantly
                </Text>
              </View>
            </View>

            <View style={styles.secureBadge}>
              <Ionicons
                name="sparkles"
                size={14}
                color="#FFFFFF"
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05070A",
  },

  loadingScreen: {
    flex: 1,
    backgroundColor: "#05070A",
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 16,
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },

  safeArea: {
    flex: 1,
  },

  darkOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0, 0, 0, 0.42)",
  },

  header: {
    paddingHorizontal: 18,
    paddingTop: Platform.OS === "android" ? 34 : 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitleContainer: {
    alignItems: "center",
    flex: 1,
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "800",
    letterSpacing: -0.3,
  },

  headerSubtitle: {
    color: "rgba(255,255,255,0.62)",
    fontSize: 11,
    fontWeight: "500",
    marginTop: 2,
  },

  scannerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 50,
  },

  instructionPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    marginBottom: 20,
  },

  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#4ADE80",
    marginRight: 8,
  },

  instructionText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },

  scannerFrame: {
    width: SCANNER_SIZE,
    height: SCANNER_SIZE,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },

  corner: {
    position: "absolute",
    width: 40,
    height: 40,
    borderColor: "#FFFFFF",
  },

  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 18,
  },

  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 18,
  },

  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 18,
  },

  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 18,
  },

  scanLine: {
    position: "absolute",
    left: 12,
    right: 12,
    height: 2,
    backgroundColor: "#FFFFFF",
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
scanGlow: {
    position: "absolute",
    left: -8,
    right: -8,
    top: -8,
    height: 18,
    backgroundColor: "rgba(255,255,255,0.16)",
  },

  detectedContainer: {
    alignItems: "center",
  },

  detectedCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "rgba(34,197,94,0.92)",
    alignItems: "center",
    justifyContent: "center",
  },

  detectedText: {
    marginTop: 12,
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  scannerTitle: {
    marginTop: 28,
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.5,
  },

  scannerDescription: {
    marginTop: 9,
    maxWidth: 310,
    textAlign: "center",
    color: "rgba(255,255,255,0.68)",
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "500",
  },

  supportedContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 22,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  supportedIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  supportedTitle: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },

  supportedSubtitle: {
    color: "rgba(255,255,255,0.52)",
    fontSize: 10,
    marginTop: 3,
    fontWeight: "500",
  },

  bottomPanel: {
    marginHorizontal: 10,
    marginBottom: 10,
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 17,
    borderRadius: 28,
    backgroundColor: "rgba(14,17,22,0.90)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  bottomHandle: {
    alignSelf: "center",
    width: 36,
    height: 4,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.22)",
    marginBottom: 15,
  },

  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  bottomInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  bottomIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.10)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  bottomTextContainer: {
    flex: 1,
  },

  bottomTitle: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },

  bottomSubtitle: {
    color: "rgba(255,255,255,0.50)",
    fontSize: 11,
    marginTop: 3,
  },

  secureBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.10)",
    alignItems: "center",
    justifyContent: "center",
  },

  permissionScreen: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },

  permissionClose: {
    position: "absolute",
    top: 55,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  permissionIcon: {
    width: 108,
    height: 108,
    borderRadius: 32,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },

  permissionTitle: {
    color: "#111827",
    fontSize: 29,
    fontWeight: "900",
    letterSpacing: -0.8,
    textAlign: "center",
  },

  permissionDescription: {
    color: "#64748B",
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    marginTop: 12,
    maxWidth: 330,
  },

  permissionButton: {
    marginTop: 28,
    height: 56,
    width: "100%",
    borderRadius: 18,
    backgroundColor: "#111827",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },

  permissionButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
permissionNote: {
    color: "#94A3B8",
    fontSize: 11,
    marginTop: 15,
    textAlign: "center",
  },

  buttonPressed: {
    opacity: 0.72,
    transform: [{ scale: 0.97 }],
  },
});