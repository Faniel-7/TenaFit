import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  KeyboardTypeOptions,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";

type Props = {
  placeholder: string;
  icon: keyof typeof Ionicons.glyphMap;
  secureTextEntry?: boolean;
  value?: string;
  onChangeText?: (text: string) => void;
  keyboardType?: KeyboardTypeOptions;
};

export default function AuthInput({
  placeholder,
  icon,
  secureTextEntry,
  value,
  onChangeText,
  keyboardType,
}: Props) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: "#17171E",
          borderColor: colors.border,
        },
      ]}
    >
      <Ionicons
        name={icon}
        size={22}
        color="#9CA3AF"
      />

      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#777"
        secureTextEntry={secureTextEntry}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        style={[
          styles.input,
          {
            color: colors.text,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 62,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    marginBottom: 15,
  },

  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 20,
  },
});