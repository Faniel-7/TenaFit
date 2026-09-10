import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { usePremium } from "../../context/PremiumContext";

export default function PremiumScreen() {
  const { isPremium, activatePremium, loading } = usePremium();
  const [code, setCode] = useState("");
  const [activating, setActivating] = useState(false);

  const handleActivate = async () => {
    if (!code.trim()) {
      Alert.alert("Premium", "Please enter your premium code.");
      return;
    }

    setActivating(true);

    const result = await activatePremium(code);

    setActivating(false);

    if (result.success) {
      setCode("");

      Alert.alert(
        "Premium Activated",
        "Your TenaFit Premium access is now active.",
        [
          {
            text: "Continue",
            onPress: () => router.replace("/dashboard/plan"),
          },
        ]
      );

      return;
    }

    Alert.alert(
      "Activation Failed",
      result.error || "Unable to activate premium."
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFC107" />
        <Text style={styles.loadingText}>Checking premium status...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color="#FFFFFF"
          />
        </Pressable>

        <View style={styles.hero}>
          <View style={styles.crown}>
            <Ionicons
              name="diamond"
              size={32}
              color="#FFC107"
            />
          </View>

          <Text style={styles.title}>
            TenaFit Premium
          </Text>

          <Text style={styles.subtitle}>
            Unlock a more personalized nutrition experience.
          </Text>
        </View>

        {isPremium ? (
          <View style={styles.activeCard}>
            <View style={styles.activeIcon}>
              <Ionicons
                name="checkmark-circle"
                size={32}
                color="#22C55E"
              />
            </View>

            <Text style={styles.activeTitle}>
              Premium is active
            </Text>

            <Text style={styles.activeText}>
              Your account has Premium access.
              Premium features will be available from
              your dashboard as they are added.
            </Text>

            <Pressable
              style={styles.primaryButton}
              onPress={() => router.replace("/dashboard/plan")}
            >
              <Text style={styles.primaryButtonText}>
                Continue
              </Text>

              <Ionicons
                name="arrow-forward"
                size={18}
                color="#111111"
              />
            </Pressable>
          </View>
        ) : (
          <>
            <View style={styles.featuresCard}>
              <Text style={styles.featuresTitle}>
                Premium includes
              </Text>

              <Feature
                icon="sparkles-outline"
                text="Personalized AI nutrition recommendations"
              />

              <Feature
                icon="restaurant-outline"
                text="Smarter meal recommendations"
              />

              <Feature
                icon="analytics-outline"
                text="Advanced nutrition insights"
              />

              <Feature
                icon="scan-outline"
                text="Premium food scanning features"
              />
<Feature
                icon="qr-code-outline"
                text="Premium QR features"
              />
            </View>

            <View style={styles.activationCard}>
              <Text style={styles.activationTitle}>
                Activate Premium
              </Text>

              <Text style={styles.activationSubtitle}>
                Enter your Premium code to unlock your
                account.
              </Text>

              <TextInput
                value={code}
                onChangeText={setCode}
                placeholder="Enter premium code"
                placeholderTextColor="#68707D"
                autoCapitalize="characters"
                autoCorrect={false}
                style={styles.input}
              />

              <Pressable
                style={[
                  styles.primaryButton,
                  activating && styles.disabledButton,
                ]}
                onPress={handleActivate}
                disabled={activating}
              >
                {activating ? (
                  <ActivityIndicator color="#111111" />
                ) : (
                  <>
                    <Text style={styles.primaryButtonText}>
                      Activate Premium
                    </Text>

                    <Ionicons
                      name="arrow-forward"
                      size={18}
                      color="#111111"
                    />
                  </>
                )}
              </Pressable>
            </View>
          </>
        )}

        <View style={styles.infoRow}>
          <Ionicons
            name="shield-checkmark-outline"
            size={18}
            color="#737B89"
          />

          <Text style={styles.infoText}>
            Your Premium status is saved on this device.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function Feature({
  icon,
  text,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
}) {
  return (
    <View style={styles.feature}>
      <View style={styles.featureIcon}>
        <Ionicons
          name={icon}
          size={19}
          color="#FFC107"
        />
      </View>

      <Text style={styles.featureText}>
        {text}
      </Text>

      <Ionicons
        name="checkmark"
        size={18}
        color="#22C55E"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05070B",
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#05070B",
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    color: "#737B89",
    fontSize: 13,
    marginTop: 12,
  },

  content: {
    width: "100%",
    maxWidth: 700,
    alignSelf: "center",
    padding: 24,
    paddingBottom: 50,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#151922",
    borderWidth: 1,
    borderColor: "#292F3A",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },

  hero: {
    alignItems: "center",
    marginBottom: 28,
  },

  crown: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: "#211D12",
    borderWidth: 1,
    borderColor: "#403716",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
    textAlign: "center",
  },

  subtitle: {
    color: "#8F96A3",
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 8,
    maxWidth: 390,
  },

  featuresCard: {
    backgroundColor: "#10141B",
    borderWidth: 1,
    borderColor: "#242A34",
    borderRadius: 20,
    padding: 18,
    marginBottom: 15,
  },

  featuresTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 8,
  },

  feature: {
    minHeight: 55,
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#242A34",
  },
featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: "#1C1A14",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  featureText: {
    flex: 1,
    color: "#D5D8DE",
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "600",
  },

  activationCard: {
    backgroundColor: "#11151D",
    borderWidth: 1,
    borderColor: "#2A2F3A",
    borderRadius: 20,
    padding: 20,
  },

  activationTitle: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "900",
  },

  activationSubtitle: {
    color: "#737B89",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
    marginBottom: 17,
  },

  input: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#303642",
    backgroundColor: "#080B10",
    color: "#FFFFFF",
    paddingHorizontal: 15,
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: 12,
  },

  primaryButton: {
    minHeight: 52,
    borderRadius: 14,
    backgroundColor: "#FFC107",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  disabledButton: {
    opacity: 0.65,
  },

  primaryButtonText: {
    color: "#111111",
    fontSize: 13,
    fontWeight: "900",
  },

  activeCard: {
    backgroundColor: "#10141B",
    borderWidth: 1,
    borderColor: "#24422F",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
  },

  activeIcon: {
    marginBottom: 12,
  },

  activeTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
  },

  activeText: {
    color: "#8F96A3",
    fontSize: 12,
    lineHeight: 19,
    textAlign: "center",
    marginTop: 7,
    marginBottom: 20,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    gap: 7,
  },

  infoText: {
    color: "#737B89",
    fontSize: 10,
  },
});