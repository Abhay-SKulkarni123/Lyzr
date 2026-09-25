"use client";

import { Bell, LoaderCircle, LogOut, Palette, Save, Shield, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/components/dashboard/auth-context";
import { clearMockSession } from "@/lib/auth";
import { loadPreferences, savePreferences, type BuildDefaultView } from "@/lib/settings-storage";

const sections = [
  { id: "profile", label: "Profile", icon: UserRound },
  { id: "preferences", label: "Preferences", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
] as const;

type SectionId = (typeof sections)[number]["id"];

export default function SettingsPage({
  searchParams,
}: {
  searchParams: { section?: string };
}) {
  const router = useRouter();
  const { session, setSession } = useAuth();
  const [activeSection, setActiveSection] = useState<SectionId>(
    sections.some((section) => section.id === searchParams.section)
      ? (searchParams.section as SectionId)
      : "profile"
  );
  const [saved, setSaved] = useState(false);
  const [defaultView, setDefaultView] = useState<BuildDefaultView>(() => loadPreferences().defaultView);

  function setSection(section: SectionId) {
    setActiveSection(section);
    setSaved(false);
    router.replace(`/settings?section=${section}`, { scroll: false });
  }

  function noticeSaved() {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }

  function signOut() {
    clearMockSession();
    setSession({ signedIn: false, user: session.user });
    router.replace("/login");
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-600">Account</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Settings</h1>
        <p className="mt-1.5 text-sm text-slate-500">Manage your profile and preferences.</p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <nav
          aria-label="Settings sections"
          className="flex shrink-0 gap-1 overflow-x-auto lg:w-44 lg:flex-col"
        >
          {sections.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setSection(id)}
              aria-current={activeSection === id ? "page" : undefined}
              className={`flex shrink-0 items-center gap-2.5 rounded-md px-3 py-2 text-xs transition ${
                activeSection === id
                  ? "bg-white/[0.07] font-medium text-white"
                  : "text-slate-500 hover:bg-white/[0.04] hover:text-slate-200"
              }`}
            >
              <Icon aria-hidden="true" className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>

        <div className="min-w-0 flex-1 space-y-5">
          <SectionPanel
            title={activeSection === "profile" ? "Profile" : activeSection === "preferences" ? "Preferences" : "Notifications"}
            subtitle={
              activeSection === "preferences"
                ? saved
                  ? "Build view preference saved in this browser."
                  : "Only the default-view preference persists locally. The rest of Settings is mocked."
                : saved
                  ? "Changes saved (mocked)."
                  : "Prototype settings. Nothing else is persisted."
            }
            saved={saved}
            savedLabel={activeSection === "preferences" ? "Saved." : "Saved (mocked)."}
          >
            {activeSection === "profile" && (
              <>
                <Field label="Full name" id="settings-name">
                  <input
                    id="settings-name"
                    defaultValue={session.user.name}
                    className={inputClass}
                    disabled
                  />
                </Field>
                <Field label="Email" id="settings-email">
                  <input id="settings-email" defaultValue={session.user.email} className={inputClass} disabled />
                </Field>
                <form
                  onSubmit={(event: FormEvent<HTMLFormElement>) => {
                    event.preventDefault();
                    noticeSaved();
                  }}
                >
                  <Field label="Display role" id="settings-role">
                    <input id="settings-role" defaultValue="Product builder" className={inputClass} />
                  </Field>
                  <SaveButton label="Save changes" />
                </form>
              </>
            )}

{activeSection === "preferences" && (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  savePreferences({ defaultView });
                  noticeSaved();
                }}
              >
                <Field label="Theme" id="settings-theme">
                  <select id="settings-theme" defaultValue="system" className={inputClass}>
                    <option value="system">System</option>
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                  </select>
                </Field>
                <Field label="Default view after build" id="settings-default-view">
                  <select
                    id="settings-default-view"
                    value={defaultView}
                    onChange={(event) => setDefaultView(event.target.value as BuildDefaultView)}
                    className={inputClass}
                  >
                    <option value="preview">Preview</option>
                    <option value="code">Code</option>
                  </select>
                </Field>
                <SaveButton label="Save preferences" />
              </form>
            )}

            {activeSection === "notifications" && (
              <form
                onSubmit={(event: FormEvent<HTMLFormElement>) => {
                  event.preventDefault();
                  noticeSaved();
                }}
              >
                <ToggleRow id="toggle-build" label="Build notifications" hint="Get notified when a build finishes." defaultChecked />
                <ToggleRow id="toggle-deploy" label="Deployment alerts" hint="Receive alerts about deployments." defaultChecked={false} />
                <ToggleRow id="toggle-email" label="Email summaries" hint="Weekly summary of your projects (mocked)." defaultChecked />
                <SaveButton label="Save notifications" />
              </form>
            )}
          </SectionPanel>

          <SectionPanel title="Danger zone" subtitle="Destructive actions are mocked for the prototype." saved={false}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400">
                  <Shield aria-hidden="true" className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-medium text-white">Sign out of Architect</p>
                  <p className="mt-0.5 text-xs text-slate-500">Clears the mocked local session.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={signOut}
                className="inline-flex h-9 shrink-0 items-center gap-2 rounded-lg border border-rose-500/40 px-4 text-xs font-medium text-rose-300 transition hover:bg-rose-500/10"
              >
                <LogOut aria-hidden="true" className="h-3.5 w-3.5" />
                Sign out
              </button>
            </div>
          </SectionPanel>

          <div className="flex items-start gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
            <LogOut aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-600" />
            <p className="text-xs leading-5 text-slate-500">
              Authentication, accounts, and profile settings are mocked in this prototype. No data leaves your
              browser. The sign-in session is stored under{" "}
              <code className="rounded bg-white/[0.06] px-1 py-0.5 font-mono text-[10px] text-slate-400">architect-demo-auth</code>{" "}
              in sessionStorage for this tab, and the build-view preference under{" "}
              <code className="rounded bg-white/[0.06] px-1 py-0.5 font-mono text-[10px] text-slate-400">architect-demo-preferences</code>{" "}
              in localStorage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-white/10 bg-[#0b0f19] px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-coral/50 focus:ring-2 focus:ring-coral/20 disabled:cursor-not-allowed disabled:opacity-60";

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-slate-400">
        {label}
      </label>
      {children}
    </div>
  );
}

function SaveButton({ label }: { label: string }) {
  const [saving, setSaving] = useState(false);
  return (
    <button
      type="submit"
      disabled={saving}
      onClick={() => {
        setSaving(true);
        window.setTimeout(() => setSaving(false), 600);
      }}
      className="inline-flex h-9 items-center gap-2 rounded-lg bg-coral px-4 text-xs font-semibold text-white transition hover:bg-[#ff795c] disabled:cursor-not-allowed disabled:opacity-70"
    >
      {saving ? <LoaderCircle aria-hidden="true" className="h-3.5 w-3.5 animate-spin" /> : <Save aria-hidden="true" className="h-3.5 w-3.5" />}
      {saving ? "Saving..." : label}
    </button>
  );
}

function ToggleRow({
  id,
  label,
  hint,
  defaultChecked,
}: {
  id: string;
  label: string;
  hint: string;
  defaultChecked: boolean;
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <div>
        <label htmlFor={id} className="text-sm font-medium text-slate-300">
          {label}
        </label>
        <p className="mt-0.5 text-xs text-slate-500">{hint}</p>
      </div>
      <input
        id={id}
        type="checkbox"
        defaultChecked={defaultChecked}
        className="h-4 w-4 shrink-0 accent-coral"
      />
    </div>
  );
}

function SectionPanel({
  title,
  subtitle,
  children,
  saved,
  savedLabel = "Saved (mocked).",
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  saved: boolean;
  savedLabel?: string;
}) {
  return (
    <section className="rounded-xl border border-white/[0.08] bg-[#10141d] p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-white">{title}</h2>
          <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
        </div>
      </div>
      {children}
      {saved && (
        <p role="status" className="mt-3 text-xs text-emerald-400">
          {savedLabel}
        </p>
      )}
    </section>
  );
}