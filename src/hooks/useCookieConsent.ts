"use client";

import { useCallback, useEffect, useState } from "react";

export type ConsentPreferences = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
};

const CONSENT_COOKIE = "pixel-consent";
const CONSENT_MAX_AGE_DAYS = 180;
const DEFAULT_PREFS: ConsentPreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
};

function readConsentCookie(): ConsentPreferences | null {
  if (typeof document === "undefined") return null;
  const raw = document.cookie.split("; ").find((row) => row.startsWith(`${CONSENT_COOKIE}=`));
  if (!raw) return null;
  try {
    return JSON.parse(decodeURIComponent(raw.split("=")[1])) as ConsentPreferences;
  } catch (error) {
    console.warn("Unable to parse consent cookie", error);
    return null;
  }
}

function writeConsentCookie(preferences: ConsentPreferences) {
  if (typeof document === "undefined") return;
  const maxAge = CONSENT_MAX_AGE_DAYS * 24 * 60 * 60;
  document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(
    JSON.stringify(preferences)
  )}; path=/; max-age=${maxAge}`;
}

export function useCookieConsent() {
  const [preferences, setPreferences] = useState<ConsentPreferences>(DEFAULT_PREFS);
  const [shouldShowBanner, setShouldShowBanner] = useState(false);

  useEffect(() => {
    const stored = readConsentCookie();
    if (stored) {
      setPreferences(stored);
      setShouldShowBanner(false);
    } else {
      setShouldShowBanner(true);
    }
  }, []);

  const persist = useCallback((next: ConsentPreferences) => {
    writeConsentCookie(next);
    setPreferences(next);
    setShouldShowBanner(false);
  }, []);

  const allowAll = useCallback(() => {
    persist({ necessary: true, analytics: true, marketing: true });
  }, [persist]);

  const rejectNonEssential = useCallback(() => {
    persist({ necessary: true, analytics: false, marketing: false });
  }, [persist]);

  const save = useCallback(() => {
    persist(preferences);
  }, [persist, preferences]);

  const updatePreference = useCallback((key: keyof ConsentPreferences, value: boolean) => {
    if (key === "necessary") return; // always true
    setPreferences((prev) => ({ ...prev, [key]: value }));
  }, []);

  return {
    preferences,
    shouldShowBanner,
    setShouldShowBanner,
    allowAll,
    rejectNonEssential,
    save,
    updatePreference,
  };
}
