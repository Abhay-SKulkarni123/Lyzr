import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Architect 2.0 — Build Apps With Natural Language",
  description:
    "Architect 2.0 is a next-generation vibe-coding platform that lets non-technical users build applications through natural language, while giving developers deep control over code, files, agents, GitHub, environment variables, terminal, and deployment.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}