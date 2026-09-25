export type MockUser = {
  name: string;
  email: string;
};

export type MockSession = {
  signedIn: boolean;
  user: MockUser;
};

export const AUTH_STORAGE_KEY = "architect-demo-auth";
const SERVER_SCOPE_KEY = "architect-demo-server-scope";

export const DEMO_USER: MockUser = {
  name: "Abhay S Kulkarni",
  email: "abhay@architect.app",
};

const EMPTY_SESSION: MockSession = {
  signedIn: false,
  user: DEMO_USER,
};

type StoredSession = {
  signedIn: boolean;
  user: MockUser;
  scope?: string;
};

function removeLegacyStorage(): void {
  try {
    if (window.localStorage.getItem(AUTH_STORAGE_KEY)) {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch {
    // Ignore storage failures in private browsing modes.
  }
}

function readServerScope(): string {
  try {
    return window.sessionStorage.getItem(SERVER_SCOPE_KEY) ?? "";
  } catch {
    return "";
  }
}

function readSession(): MockSession {
  if (typeof window === "undefined") return EMPTY_SESSION;
  removeLegacyStorage();
  try {
    const raw = window.sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return EMPTY_SESSION;
    const parsed = JSON.parse(raw) as Partial<StoredSession> | null;
    if (!parsed) return EMPTY_SESSION;
    return {
      signedIn: Boolean(parsed.signedIn),
      user: parsed.signedIn && parsed.user ? parsed.user : EMPTY_SESSION.user,
    };
  } catch {
    return EMPTY_SESSION;
  }
}

export function getMockSession(): MockSession {
  return readSession();
}

export function signInMock(user: MockUser): MockSession {
  if (typeof window === "undefined") return { signedIn: true, user };
  removeLegacyStorage();
  const session: StoredSession = {
    signedIn: true,
    user,
    scope: readServerScope() || undefined,
  };
  try {
    window.sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Ignore storage failures in private browsing modes.
  }
  return { signedIn: true, user };
}

export function clearMockSession(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {
    // Ignore storage failures in private browsing modes.
  }
}

export function reconcileServerScope(scopeId: string): void {
  if (typeof window === "undefined") return;
  removeLegacyStorage();
  try {
    const raw = window.sessionStorage.getItem(AUTH_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as Partial<StoredSession> | null) : null;
    window.sessionStorage.setItem(SERVER_SCOPE_KEY, scopeId);
    if (parsed && parsed.signedIn && (parsed.scope ?? "") !== scopeId) {
      window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch {
    // Ignore storage failures; keep the current browser session.
  }
}

export function nameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "";
  if (!local) return DEMO_USER.name.split(" ")[0];
  const formatted = local
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
  return formatted || "Creator";
}