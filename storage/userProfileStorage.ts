import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserProfile } from "../types/userProfile";

const USER_PROFILE_KEY = "@tenafit_user_profile";

/**
 * Save the user's profile locally.
 */
export async function saveUserProfile(
  profile: UserProfile
): Promise<void> {
  try {
    const jsonValue = JSON.stringify(profile);

    await AsyncStorage.setItem(
      USER_PROFILE_KEY,
      jsonValue
    );
  } catch (error) {
    console.error(
      "Failed to save user profile:",
      error
    );

    throw error;
  }
}

/**
 * Load the user's profile from local storage.
 *
 * Returns null if no profile has been saved yet.
 */
export async function getUserProfile(): Promise<UserProfile | null> {
  try {
    const jsonValue =
      await AsyncStorage.getItem(
        USER_PROFILE_KEY
      );

    if (jsonValue === null) {
      return null;
    }

    return JSON.parse(jsonValue) as UserProfile;
  } catch (error) {
    console.error(
      "Failed to load user profile:",
      error
    );

    return null;
  }
}

/**
 * Update only selected profile fields.
 */
export async function updateUserProfile(
  updates: Partial<UserProfile>
): Promise<UserProfile> {
  const currentProfile =
    await getUserProfile();

  if (!currentProfile) {
    throw new Error(
      "Cannot update profile because no profile exists."
    );
  }

  const updatedProfile: UserProfile = {
    ...currentProfile,
    ...updates,
  };

  await saveUserProfile(updatedProfile);

  return updatedProfile;
}

/**
 * Delete the locally stored profile.
 */
export async function deleteUserProfile(): Promise<void> {
  try {
    await AsyncStorage.removeItem(
      USER_PROFILE_KEY
    );
  } catch (error) {
    console.error(
      "Failed to delete user profile:",
      error
    );

    throw error;
  }
}

/**
 * Check whether a profile already exists.
 */
export async function hasUserProfile(): Promise<boolean> {
  const profile =
    await getUserProfile();

  return profile !== null;
}