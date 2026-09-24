import { RedirectIfAuthed } from "@/components/auth/RedirectIfAuthed";
import { AuthShell } from "@/components/auth/AuthShell";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <RedirectIfAuthed>
      <AuthShell>{children}</AuthShell>
    </RedirectIfAuthed>
  );
}