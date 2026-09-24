"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { getMockSession, type MockSession } from "@/lib/auth";

type AuthContextValue = {
  session: MockSession;
  setSession: (session: MockSession) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<MockSession>(() => getMockSession());
  return (
    <AuthContext.Provider value={{ session, setSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}