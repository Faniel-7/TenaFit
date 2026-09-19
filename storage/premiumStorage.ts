import AsyncStorage from "@react-native-async-storage/async-storage";
import { PremiumStatus } from "../types/premium";
import { getPremiumCodeError, normalizePremiumCode } from "../logic/premiumCodeValidator";

const PREMIUM_KEY = "@tenafit_premium";

const defaultPremiumStatus: PremiumStatus = {
  isPremium: false,
  activatedAt: null,
  code: null,
};

export async function getPremiumStatus(): Promise<PremiumStatus> {
  try {
    const stored = await AsyncStorage.getItem(PREMIUM_KEY);

    if (!stored) {
      return defaultPremiumStatus;
    }

    const parsed = JSON.parse(stored);

    return {
      isPremium: Boolean(parsed?.isPremium),
      activatedAt:
        typeof parsed?.activatedAt === "string"
          ? parsed.activatedAt
          : null,
      code:
        typeof parsed?.code === "string"
          ? parsed.code
          : null,
    };
  } catch {
    return defaultPremiumStatus;
  }
}

export async function activatePremium(
  code: string
): Promise<PremiumStatus> {
  const error = getPremiumCodeError(code);

  if (error) {
    throw new Error(error);
  }

  const normalizedCode = normalizePremiumCode(code);

  const status: PremiumStatus = {
    isPremium: true,
    activatedAt: new Date().toISOString(),
    code: normalizedCode,
  };

  await AsyncStorage.setItem(
    PREMIUM_KEY,
    JSON.stringify(status)
  );

  return status;
}

export async function deactivatePremium(): Promise<void> {
  await AsyncStorage.setItem(
    PREMIUM_KEY,
    JSON.stringify(defaultPremiumStatus)
  );
}

export async function isPremiumActive(): Promise<boolean> {
  const status = await getPremiumStatus();
  return status.isPremium;
}