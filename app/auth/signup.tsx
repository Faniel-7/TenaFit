import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import ScreenContainer from "../../components/common/ScreenContainer";
import { saveUserAccount } from "../../storage/authStorage";

export default function SignupScreen() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSignup = async () => {
    setError("");

    const cleanFullName =
      fullName.trim();

    const cleanUsername =
      username.trim();

    const cleanEmail =
      email.trim().toLowerCase();

    if (
      !cleanFullName ||
      !cleanUsername ||
      !cleanEmail ||
      !password ||
      !confirmPassword
    ) {
      setError(
        "Please fill in all fields."
      );
      return;
    }

    if (!cleanEmail.includes("@")) {
      setError(
        "Please enter a valid email address."
      );
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    try {
      setLoading(true);

      await saveUserAccount({
        fullName: cleanFullName,
        username: cleanUsername,
        email: cleanEmail,
        password,
      });

      /*
       * Do not pass the password to onboarding.
       * The account is already stored locally.
       */
      router.push({
        pathname:
          "/onboarding/personal-info",

        params: {
          fullName:
            cleanFullName,

          username:
            cleanUsername,

          email:
            cleanEmail,
        },
      });
    } catch (err) {
      console.error(
        "Signup error:",
        err
      );

      setError(
        "Something went wrong while creating your account."
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
              Create your{" "}
              <Text style={styles.highlight}>
                account
              </Text>
            </Text>

            <Text style={styles.subtitle}>
              Let's get started with TenaFit
            </Text>
          </View>

          {/* Full Name */}
          <View style={styles.field}>
            <Text style={styles.label}>
              Full Name
            </Text>

            <View style={styles.inputWrapper}>
              <Ionicons
                name="person-outline"
                size={19}
                color="#8B8F98"
              />
<TextInput
                value={fullName}
                onChangeText={(value) => {
                  setFullName(value);
                  setError("");
                }}
                placeholder="Enter your full name"
                placeholderTextColor="#686C75"
                style={styles.input}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Username */}
          <View style={styles.field}>
            <Text style={styles.label}>
              Username
            </Text>

            <View style={styles.inputWrapper}>
              <Ionicons
                name="at-outline"
                size={19}
                color="#8B8F98"
              />

              <TextInput
                value={username}
                onChangeText={(value) => {
                  setUsername(value);
                  setError("");
                }}
                placeholder="Choose a username"
                placeholderTextColor="#686C75"
                style={styles.input}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
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
            <Text style={styles.label}>
              Password
            </Text>

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
                placeholder="Create a password"
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

          {/* Confirm Password */}
          <View style={styles.field}>
            <Text style={styles.label}>
              Confirm Password
            </Text>

            <View style={styles.inputWrapper}>
              <Ionicons
                name="lock-closed-outline"
                size={19}
                color="#8B8F98"
              />

              <TextInput
                value={
confirmPassword
                }
                onChangeText={(value) => {
                  setConfirmPassword(
                    value
                  );
                  setError("");
                }}
                placeholder="Confirm your password"
                placeholderTextColor="#686C75"
                style={styles.input}
                secureTextEntry={
                  !showConfirmPassword
                }
                autoCapitalize="none"
                autoCorrect={false}
              />

              <Pressable
                onPress={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
              >
                <Ionicons
                  name={
                    showConfirmPassword
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

          {/* Create Account */}
          <Pressable
            onPress={handleSignup}
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
                ? "Creating Account..."
                : "Create Account"}
            </Text>

            {!loading && (
              <Ionicons
                name="arrow-forward"
                size={20}
                color="#05070B"
              />
            )}
          </Pressable>

          {/* Login */}
          <View style={styles.loginRow}>
            <Text style={styles.loginText}>
              Already have an account?
            </Text>

            <Pressable
              onPress={() =>
                router.replace(
                  "/auth/login"
                )
              }
            >
              <Text
                style={
                  styles.loginLink
                }
              >
                Log in
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
    marginBottom: 30,
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
  },

  field: {
    marginBottom: 18,
  },

  label: {
    color: "#E8E8EA",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
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
  },

  primaryButton: {
    minHeight: 56,

    backgroundColor: "#FFC107",

    borderRadius: 15,

    flexDirection: "row",

    alignItems: "center",
    justifyContent: "center",

    gap: 10,

    marginTop: 5,
  },

  disabledButton: {
    opacity: 0.6,
  },

  primaryButtonText: {
    color: "#05070B",

    fontSize: 16,

    fontWeight: "800",
  },

  loginRow: {
    flexDirection: "row",

    justifyContent: "center",
    alignItems: "center",

    marginTop: 24,
  },

  loginText: {
    color: "#858992",
    fontSize: 14,
  },

  loginLink: {
    color: "#FFC107",

    fontSize: 14,

    fontWeight: "800",

    marginLeft: 5,
  },
});