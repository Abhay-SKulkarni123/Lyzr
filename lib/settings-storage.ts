export type BuildDefaultView = "preview" | "code";

export type UserPreferences = {
  defaultView: BuildDefaultView;
};

const PREFERENCES_KEY = "architect-demo-preferences";

export function loadPreferences(): UserPreferences {
  if (typeof window === "undefined") return { defaultView: "preview" };
  try {
    const raw = window.localStorage.getItem(PREFERENCES_KEY);
    if (!raw) return { defaultView: "preview" };
    const parsed = JSON.parse(raw) as Partial<UserPreferences> | null;
    return { defaultView: parsed?.defaultView === "code" ? "code" : "preview" };
  } catch {
    return { defaultView: "preview" };
  }
}

export function savePreferences(preferences: UserPreferences): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
  } catch {
    // Ignore storage failures in private browsing modes.
  }
}