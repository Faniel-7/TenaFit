import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import ScreenContainer from "../../components/common/ScreenContainer";
import { useAuth } from "../../context/AuthContext";

export default function LoginScreen() {
  const { login } = useAuth();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleLogin = async () => {
    setError("");

    const cleanEmail =
      email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError(
        "Please enter your email and password."
      );
      return;
    }

    try {
      setLoading(true);

      const result = await login(
        cleanEmail,
        password
      );

      if (!result.success) {
        setError(
          result.error ??
            "Incorrect email or password."
        );
        return;
      }

      router.replace("/home");
    } catch (err) {
      console.error(
        "Login error:",
        err
      );

      setError(
        "Something went wrong while logging in."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        <ScrollView
          contentContainerStyle={
            styles.scrollContent
          }
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={
            false
          }
        >
          {/* Back */}
          <Pressable
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons
              name="arrow-back"
              size={21}
              color="#FFC107"
            />
          </Pressable>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              Welcome{" "}
              <Text style={styles.highlight}>
                back
              </Text>
            </Text>

            <Text style={styles.subtitle}>
              Log in to continue your TenaFit journey
            </Text>
          </View>

          {/* Email */}
          <View style={styles.field}>
            <Text style={styles.label}>
              Email
            </Text>

            <View style={styles.inputWrapper}>
              <Ionicons
                name="mail-outline"
                size={19}
                color="#8B8F98"
              />

              <TextInput
                value={email}
                onChangeText={(value) => {
                  setEmail(value);
                  setError("");
                }}
                placeholder="Enter your email"
                placeholderTextColor="#686C75"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.field}>
            <View
              style={
                styles.passwordLabelRow
              }
            >
              <Text style={styles.label}>
                Password
              </Text>

              <Pressable
                onPress={() =>
                  router.push(
                    "/auth/forget-password"
                  )
                }
              >
                <Text
                  style={
                    styles.forgotPassword
                  }
                >
                  Forgot password?
                </Text>
              </Pressable>
            </View>
<View style={styles.inputWrapper}>
              <Ionicons
                name="lock-closed-outline"
                size={19}
                color="#8B8F98"
              />

              <TextInput
                value={password}
                onChangeText={(value) => {
                  setPassword(value);
                  setError("");
                }}
                placeholder="Enter your password"
                placeholderTextColor="#686C75"
                style={styles.input}
                secureTextEntry={
                  !showPassword
                }
                autoCapitalize="none"
                autoCorrect={false}
              />

              <Pressable
                onPress={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >
                <Ionicons
                  name={
                    showPassword
                      ? "eye-off-outline"
                      : "eye-outline"
                  }
                  size={20}
                  color="#8B8F98"
                />
              </Pressable>
            </View>
          </View>

          {/* Error */}
          {error ? (
            <View style={styles.errorBox}>
              <Ionicons
                name="alert-circle-outline"
                size={18}
                color="#FF6B6B"
              />

              <Text style={styles.errorText}>
                {error}
              </Text>
            </View>
          ) : null}

          {/* Login */}
          <Pressable
            onPress={handleLogin}
            disabled={loading}
            style={[
              styles.primaryButton,
              loading &&
                styles.disabledButton,
            ]}
          >
            <Text
              style={
                styles.primaryButtonText
              }
            >
              {loading
                ? "Logging In..."
                : "Log In"}
            </Text>

            {!loading && (
              <Ionicons
                name="arrow-forward"
                size={20}
                color="#05070B"
              />
            )}
          </Pressable>

          {/* Signup */}
          <View style={styles.signupRow}>
            <Text style={styles.signupText}>
              Don't have an account?
            </Text>

            <Pressable
              onPress={() =>
                router.replace(
                  "/auth/signup"
                )
              }
            >
              <Text
                style={
                  styles.signupLink
                }
              >
                Create Account
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingTop: 45,
    paddingBottom: 40,
    justifyContent: "center",
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,

    backgroundColor: "#11151D",

    borderWidth: 1,
    borderColor: "#272B33",

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 28,
  },

  header: {
    marginBottom: 35,
  },

  title: {
    color: "#FFFFFF",

    fontSize: 32,

    fontWeight: "800",

    lineHeight: 39,
  },

  highlight: {
    color: "#FFC107",
  },

  subtitle: {
    color: "#8B8F98",

    fontSize: 15,

    marginTop: 8,

    lineHeight: 22,
  },

  field: {
    marginBottom: 20,
  },

  passwordLabelRow: {
    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    marginBottom: 8,
  },

  label: {
    color: "#E8E8EA",

    fontSize: 14,

    fontWeight: "700",
  },

  forgotPassword: {
    color: "#FFC107",

    fontSize: 13,

    fontWeight: "700",
  },

  inputWrapper: {
    minHeight: 56,

    flexDirection: "row",

    alignItems: "center",

    paddingHorizontal: 16,

    backgroundColor: "#11151D",
borderWidth: 1,

    borderColor: "#272B33",

    borderRadius: 15,
  },

  input: {
    flex: 1,

    color: "#FFFFFF",

    fontSize: 15,

    marginLeft: 11,

    paddingVertical: 0,
  },

  errorBox: {
    flexDirection: "row",

    alignItems: "center",

    backgroundColor:
      "rgba(255,107,107,0.08)",

    borderWidth: 1,

    borderColor:
      "rgba(255,107,107,0.25)",

    borderRadius: 12,

    padding: 12,

    marginBottom: 16,
  },

  errorText: {
    flex: 1,

    color: "#FF8A8A",

    fontSize: 13,

    marginLeft: 8,

    lineHeight: 18,
  },

  primaryButton: {
    minHeight: 56,

    backgroundColor: "#FFC107",

    borderRadius: 15,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    gap: 10,
  },

  disabledButton: {
    opacity: 0.6,
  },

  primaryButtonText: {
    color: "#05070B",

    fontSize: 16,

    fontWeight: "800",
  },

  signupRow: {
    flexDirection: "row",

    justifyContent: "center",

    alignItems: "center",

    marginTop: 26,
  },

  signupText: {
    color: "#858992",

    fontSize: 14,
  },

  signupLink: {
    color: "#FFC107",

    fontSize: 14,

    fontWeight: "800",

    marginLeft: 5,
  },
});