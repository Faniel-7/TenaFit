import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserAccount } from "../types/auth";

const AUTH_KEY = "@tenafit_user_account";

export async function saveUserAccount(
  account: UserAccount
): Promise<void> {
  await AsyncStorage.setItem(
    AUTH_KEY,
    JSON.stringify(account)
  );
}

export async function getUserAccount(): Promise<UserAccount | null> {
  const data =
    await AsyncStorage.getItem(AUTH_KEY);

  if (!data) {
    return null;
  }

  try {
    return JSON.parse(data) as UserAccount;
  } catch {
    return null;
  }
}

export async function clearUserAccount(): Promise<void> {
  await AsyncStorage.removeItem(AUTH_KEY);
}