import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserProfile } from "../types/userProfile";

const PROFILE_KEY = "@tenafit_user_profile";

export async function saveUserProfile(
  profile: UserProfile
): Promise<void> {
  try {
    await AsyncStorage.setItem(
      PROFILE_KEY,
      JSON.stringify(profile)
    );
  } catch (error) {
    console.error(
      "Failed to save user profile:",
      error
    );

    throw error;
  }
}

export async function getUserProfile(): Promise<UserProfile | null> {
  try {
    const storedProfile =
      await AsyncStorage.getItem(PROFILE_KEY);

    if (!storedProfile) {
      return null;
    }

    return JSON.parse(storedProfile) as UserProfile;
  } catch (error) {
    console.error(
      "Failed to load user profile:",
      error
    );

    return null;
  }
}

export async function clearUserProfile(): Promise<void> {
  try {
    await AsyncStorage.removeItem(PROFILE_KEY);
  } catch (error) {
    console.error(
      "Failed to clear user profile:",
      error
    );

    throw error;
  }
}