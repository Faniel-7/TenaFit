const PREMIUM_CODES = new Set([
  "TENAFIT-PREMIUM-001",
  "TENAFIT-PREMIUM-002",
  "TENAFIT-PREMIUM-003",
  "TENAFIT-PREMIUM-004",
  "TENAFIT-PREMIUM-005",
]);

export function normalizePremiumCode(code: string): string {
  return code.trim().toUpperCase();
}

export function isValidPremiumCode(code: string): boolean {
  const normalizedCode = normalizePremiumCode(code);

  if (!normalizedCode) {
    return false;
  }

  return PREMIUM_CODES.has(normalizedCode);
}

export function getPremiumCodeError(code: string): string | null {
  const normalizedCode = normalizePremiumCode(code);

  if (!normalizedCode) {
    return "Please enter a premium code.";
  }

  if (!isValidPremiumCode(normalizedCode)) {
    return "Invalid premium code.";
  }

  return null;
}