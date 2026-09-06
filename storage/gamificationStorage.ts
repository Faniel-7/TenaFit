import AsyncStorage from "@react-native-async-storage/async-storage";

const XP_KEY = "@tenafit_xp";

const DEFAULT_XP = 0;

/*
=========================================================
XP / LEVEL RULES
=========================================================

Level 1:
0 - 499 XP

Level 2:
500 - 999 XP

Level 3:
1000 - 1499 XP

Every new level requires another 500 XP.

This keeps the system simple for now.
Later we can make higher levels require
progressively more XP.
*/

const XP_PER_LEVEL = 500;

export interface GamificationData {
  xp: number;
  level: number;
  currentLevelXp: number;
  xpForNextLevel: number;
  progress: number;
}

function calculateLevel(xp: number): number {
  return (
    Math.floor(
      Math.max(0, xp) /
        XP_PER_LEVEL
    ) + 1
  );
}

function calculateData(
  xp: number
): GamificationData {
  const safeXp = Math.max(
    0,
    Math.floor(xp)
  );

  const level =
    calculateLevel(safeXp);

  const levelStartXp =
    (level - 1) *
    XP_PER_LEVEL;

  const currentLevelXp =
    safeXp - levelStartXp;

  const progress =
    Math.min(
      currentLevelXp /
        XP_PER_LEVEL,
      1
    );

  return {
    xp: safeXp,
    level,
    currentLevelXp,
    xpForNextLevel:
      XP_PER_LEVEL,
    progress,
  };
}

/*
=========================================================
GET GAMIFICATION DATA
=========================================================
*/

export async function getGamificationData(): Promise<GamificationData> {
  try {
    const storedXp =
      await AsyncStorage.getItem(
        XP_KEY
      );

    if (!storedXp) {
      return calculateData(
        DEFAULT_XP
      );
    }

    const parsedXp =
      Number(storedXp);

    if (
      !Number.isFinite(
        parsedXp
      )
    ) {
      return calculateData(
        DEFAULT_XP
      );
    }

    return calculateData(
      parsedXp
    );
  } catch (error) {
    console.error(
      "Failed to load gamification data:",
      error
    );

    return calculateData(
      DEFAULT_XP
    );
  }
}

/*
=========================================================
GET XP
=========================================================
*/

export async function getXp(): Promise<number> {
  const data =
    await getGamificationData();

  return data.xp;
}

/*
=========================================================
ADD XP
=========================================================
*/

export async function addXp(
  amount: number
): Promise<GamificationData> {
  if (
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    return getGamificationData();
  }

  try {
    const current =
      await getXp();

    const newXp =
      current +
      Math.floor(amount);

    await AsyncStorage.setItem(
      XP_KEY,
      String(newXp)
    );

    return calculateData(
      newXp
    );
  } catch (error) {
    console.error(
      "Failed to add XP:",
      error
    );

    return getGamificationData();
  }
}

/*
=========================================================
SET XP
=========================================================
*/

export async function setXp(
  xp: number
): Promise<GamificationData> {
  const safeXp =
    Number.isFinite(xp)
      ? Math.max(
          0,
          Math.floor(xp)
        )
      : DEFAULT_XP;

  await AsyncStorage.setItem(
    XP_KEY,
    String(safeXp)
  );

  return calculateData(
    safeXp
  );
}

/*
=========================================================
RESET XP
=========================================================
*/

export async function resetGamification(): Promise<void> {
  await AsyncStorage.removeItem(
    XP_KEY
  );
}