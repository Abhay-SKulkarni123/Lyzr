export type MockUser = {
  name: string;
  email: string;
};

export type MockSession = {
  signedIn: boolean;
  user: MockUser;
};

export const AUTH_STORAGE_KEY = "architect-demo-auth";

export const DEMO_USER: MockUser = {
  name: "Abhay Sharma",
  email: "abhay@architect.app",
};

const EMPTY_SESSION: MockSession = {
  signedIn: false,
  user: DEMO_USER,
};

function readSession(): MockSession {
  if (typeof window === "undefined") return EMPTY_SESSION;
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return EMPTY_SESSION;
    const parsed = JSON.parse(raw) as Partial<MockSession> | null;
    if (!parsed) return EMPTY_SESSION;
    return {
      signedIn: Boolean(parsed.signedIn),
      user:
        parsed.signedIn && parsed.user
          ? parsed.user
          : EMPTY_SESSION.user,
    };
  } catch {
    return EMPTY_SESSION;
  }
}

export function getMockSession(): MockSession {
  return readSession();
}

export function signInMock(user: MockUser): MockSession {
  const session: MockSession = { signedIn: true, user };
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  return session;
}

export function clearMockSession(): void {
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
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