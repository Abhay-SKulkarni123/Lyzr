import type { Metadata } from "next";
import { SessionScopeSync } from "@/components/auth/SessionScopeSync";
import "./globals.css";

export const metadata: Metadata = {
  title: "Architect 2.0: Build Apps With Natural Language",
  description:
    "Architect turns plain language into a working app. Non-technical users describe what they want; developers get full control over code, files, agents, GitHub, environment variables, terminal, and deployment.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SessionScopeSync>{children}</SessionScopeSync>
      </body>
    </html>
  );
}
