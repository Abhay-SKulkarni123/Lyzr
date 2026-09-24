# Architect 2.0 — Interview Notes

This document is for the developer preparing to defend the project during interviews. It captures the reasoning behind every major decision, so you can articulate them clearly.

---

## Current Phase Summary

**Phase 0 — Foundation**

We are establishing a clean, production-ready project foundation before writing any product code.

### What Are We Building?
Architect 2.0 is a next-generation vibe-coding platform that enables non-technical users to build apps through natural language and gives developers progressive access to code, files, agents, GitHub, and deployment.

### Why Are We Building It?
The market has a gap: "no-code" platforms limit control; traditional IDEs are overwhelming for non-developers. Architect 2.0 bridges this with progressive complexity.

### Who Is It For?
1. **Non-technical creators** — wants fast prototypes
2. **Technical developers** — wants full control without boilerplate

### What Makes Architect 2.0 Different?
- **Single workspace** for all complexity levels
- **Progressive disclosure** — no split apps
- **Transparent AI agents** — users see what's happening
- **Continuous preview** — live visual feedback

### Why Next.js?
- Full-stack capability without changing frameworks
- App Router provides file-based routing and server components
- Industry standard for React-based apps
- Vercel deployment is optimized

### Why TypeScript?
- Type safety prevents runtime errors
- IDE tooling improves developer experience
- Interview expectation for production code

### Why Component-Based Architecture?
- Reusability: shared components reduce duplication
- Modularity: features are isolated and independently upgradable
- Testability: each component can be tested in isolation

### Why Frontend-First?
- Prototype speed: validate UX before backend investment
- User value first: UI is the primary differentiator in this phase
- Mock data: backend can be built later without touching UI

### Why Are Some Flows Mocked?
- Time constraint: cannot build real AI orchestration, code execution, GitHub API, or deployment pipeline in limited window
- User experience: mocks deliver identical UX for end-to-end flows
- Future clarity: mock APIs are adapters that can be swapped for real implementations

### What Would the Production Architecture Look Like?
- Next.js API routes + BullMQ job queue for agent orchestration
- Docker sandbox for code execution
- WebSocket for real-time terminal and agent logs
- PostgreSQL + Redis for data and caching
- GitHub API + Vercel/Netlify APIs for deployment

### What Are the Major Trade-offs?
- **Mock vs. real**: Mocks are less impressive but deliver consistent UX
- **Monolith vs. microservices**: Monolith is faster to develop
- **Frontend-first**: Backend can be built later without breaking UI
- **Progressive complexity**: UI complexity is higher but context is preserved

---

## Phase 0 — Foundation

### What Was Implemented
- Next.js 14 project initialization with TypeScript and Tailwind CSS
- Project structure: `app/`, `components/`, `lib/`, `data/`, `types/`, `public/`, `docs/`
- Tailwind configuration with custom color palette
- Basic layouts and pages
- Documentation: `PRODUCT.md`, `ARCHITECTURE.md`, `UX_DECISIONS.md`, `FEATURE_MAP.md`, `TECHNICAL_NOTES.md`, `INTERVIEW_NOTES.md`, `PHASE_LOG.md`
- Environment files: `.gitignore`, `.env.example`
- Professional README with setup instructions

### Why It Was Implemented
- Provides clean, maintainable codebase for future phases
- Documentation ensures decisions are defensible in interviews
- Environment files prevent secrets from being committed

### Important Technical Concepts
- **Next.js App Router**: Server/client component split
- **Tailwind**: Utility-first CSS with custom theme
- **TypeScript**: Strict mode, path aliases
- **Component architecture**: Separation of layout, feature, and UI components

### Important Product Concepts
- **Progressive complexity**: Single interface serving all user types
- **Prompt-first**: Reducing friction to first value
- **Visible agent activity**: Building trust in AI-generated code

### Likely Interviewer Questions
1. "Why did you choose Next.js over React + Vite?"
2. "How does the mock data layer work?"
3. "What would the production architecture look like?"
4. "Why is some functionality mocked?"
5. "How do you handle different user types in one interface?"

### Suggested Answers
1. **Next.js**: Full-stack, server components, App Router, Vercel optimization
2. **Mock layer**: Data in `data/` folder, `lib/mock-api.ts` adapter pattern
3. **Production**: BullMQ, Docker, WebSocket, PostgreSQL, Redis, GitHub/Vercel APIs
4. **Mocking**: Time constraint, consistent UX, swap adapters later
5. **User types**: Progressive disclosure, mode toggle, contextual controls

### Likely Follow-up Questions
1. "How would you add real authentication?"
2. "What database would you choose and why?"
3. "How do you handle state management at scale?"
4. "What's your deployment strategy?"
5. "How do you test the mock layer?"

---

## Phase 1 — Architect Workspace

### What Was Implemented
- Replaced the `/workspace` placeholder with the prompt-to-preview product workspace.
- Added a top bar for Architect, the sample project, branch context, and clearly labeled GitHub/deployment/settings placeholders.
- Added Preview, Code, Terminal, and Files views, a sample file explorer, a read-only code surface, and static terminal output.
- Created a browser-framed sample analytics dashboard as the central preview.
- Added a multiline prompt composer and a client-side build activity simulation with four visible stages.
- Added responsive layouts that keep the preview and prompt visible on smaller screens while reducing secondary navigation.
- Repaired the global Tailwind/PostCSS wiring so the workspace uses the existing design tokens.

### Why the Workspace Is Structured This Way
- **Prompt at the bottom, result in the center**: This keeps the next action obvious and makes the output of a prompt immediately visible.
- **Separate generated app from Architect controls**: Browser chrome and a distinct light dashboard canvas help users understand what belongs to the generated product versus the builder.
- **Progressive developer controls**: Files are visible as project context, while Code and Terminal are available as separate views without overwhelming the default Preview experience.
- **Responsive activity summary**: The full build panel is useful on wide screens; a compact row preserves status when horizontal space is limited.

### Important Technical Decisions and Trade-offs
- Workspace state is local React state in a client component. This is enough for a single-page prototype and avoids adding a state library or backend.
- Build stages are driven by a short timer and explicit `ready` / `building` / `complete` state. This demonstrates feedback states but is not an orchestration state machine backed by work queues.
- Shared, focused components live in `components/workspace/`; the root page only composes the workspace.
- Code and terminal are read-only static samples. Monaco, editable files, real commands, and generated code are intentionally deferred.
- The analytics preview is illustrative static content, so submitted prompts do not change the displayed application.
- The existing `slate` design token conflicted with numbered Tailwind shade utilities. Giving it a `DEFAULT` color keeps the design token and shade scale available together.

### Functional vs. Mocked
- **Functional**: view navigation, file selection and Code view navigation, prompt submission, mock context toggle, build-stage animation, completion feedback, and adaptive panel layout.
- **Mocked/static**: project/repository state, analytics data, preview content, code, terminal log, build activity, GitHub, deployment, and settings.
- **Not implemented in Phase 1**: real AI calls, code generation, sandboxing, a real terminal, GitHub APIs, deployment, user accounts, and a backend/database.

### Likely Interviewer Questions and Concise Answers

1. **Why is Prompt → Build → Preview the primary workspace flow?**
   It gives creators an immediate action and visible payoff. The prompt remains available while the preview occupies the largest part of the workspace.

2. **How does the prompt currently generate the dashboard?**
   It does not generate code. Submission starts a timed mock run and updates the activity stages; the static sample preview remains unchanged, and the UI states that clearly.

3. **Why show build activity if there is no AI orchestration?**
   The prototype demonstrates where progress and transparency belong in the product. The activity is labeled simulated so it is not mistaken for real agent work.

4. **How does the file explorer connect to Code view?**
   Selecting a sample file updates the selected path and switches to Code view, which displays a read-only illustrative snippet for that path.

5. **Why is the preview separate from the builder UI?**
   Browser chrome and a light analytics app canvas establish a clear boundary between Architect and the application being previewed.

6. **How did you handle responsive layouts?**
   The file explorer hides at narrower widths, the activity sidebar collapses to a status row, dashboard navigation adapts, and the prompt composer remains in the layout.

7. **Why use local component state rather than Context or Redux?**
   The interaction is confined to one workspace route. Local state keeps the prototype simple; shared state management can be introduced when multiple routes or persisted projects require it.

8. **What would be required to make the preview genuinely live?**
   A real generation pipeline would need to persist project files, run builds in an isolated sandbox, stream status/logs, and serve the resulting app safely. That infrastructure is outside this phase.

9. **What is the next sensible phase after this?**
   Add genuinely useful developer tools and connect the mock adapter boundaries to real project state incrementally, while keeping orchestration, GitHub, deployment, and auth as separately scoped work.

---

## Phase 2 — Authentication & Dashboard Hub

### What Was Implemented
- Mocked `/login` and `/signup` with email/password forms, client-side validation, show/hide password, mock "Continue with GitHub", loading states, and post-success redirects (default `/dashboard`, or `?next=` when provided).
- Route groups `app/(auth)/` and `app/(app)/`: auth pages live in a bare AuthShell; app pages share a DashboardShell with header and sidebar. Both are gated by client-side session guards (`RedirectIfAuthed`, `RequireAuth`) that use a mounted-state check to avoid redirect flashes.
- A `lib/auth.ts` mock session: signed-in flag + minimal name/email stored as `architect-demo-auth` in localStorage; passwords are never persisted.
- `/dashboard`: time-aware greeting, stat cards (projects/templates/deployed), a build-from-prompt composer, recent projects, and a templates call-out.
- `/projects`: full project grid (ProjectCard with action menu, status badges, Open link) plus a New Project modal that routes into the workspace.
- `/templates`: four template cards that pre-fill the New Project modal with a template prompt.
- `/settings`: Profile / Preferences / Notifications sections driven by `?section=`, plus a Sign-out danger zone.
- Workspace seeding: `/workspace?prompt=&project=` is parsed by the page and resolved (matching project IDs to names) before being passed into `WorkspaceShell` and `WorkspaceHeader`, whose header logo now links back to `/dashboard`.
- A reusable `Menu` primitive (click-outside + Escape, `role="menu"`) shared by the header user menu, sidebar account card, and project-card actions.
- Landing page CTAs now route through `/login?next=/workspace`.

### Why the Flow Is Structured This Way
- **Landing → Sign in → Dashboard**: This is the journey a real product would enforce, and it makes the prototype navigable end-to-end rather than a single deep link.
- **Mock auth over real auth**: The requirement is to demonstrate product thinking. A deterministic localStorage flag delivers the full UX pattern (validation, loading, gating, redirects) with zero credential risk.
- **Route groups as layout boundaries**: `(auth)` vs `(app)` keeps the two chrome treatments isolated at the router level instead of branching conditionally inside one layout.
- **Stateless workspace seeding**: Query parameters let the workspace accept context from anywhere (project cards, new-project modal, composer) without adding a state library or global store.

### Important Technical Decisions and Trade-offs
- **No middleware**: Real apps use `middleware.ts` for auth redirects. Here the session lives in the browser, so guards are client components; the mounted gate prevents prerender flashes. Middleware is the documented production upgrade path.
- **`window.location.search` for `?next=`**: Reading the target directly avoids `useSearchParams`/Suspense and keeps login/signup statically prerendered.
- **Context only where shared**: An `AuthProvider` supplies the session to the header/sidebar/pages; workspace stays intentionally separate because it receives context via its query parameters.
- **localStorage flag only**: Store `{ signedIn, user }`, nothing sensitive; passwords never touch storage or network.
- **No new dependencies**: React Context, useEffect, and Tailwind cover everything; no Auth.js, state library, or UI kit.
- **Route-group limits**: Route groups cannot panic around the same URL — `(auth)` and `(app)` resolve to distinct paths, which Next.js validates at build time.

### Functional vs. Mocked
- **Functional**: route gating, session persist/restore, form validation and loading states, dashboard navigation, project/template browsing, new-project modal, card open links, settings section switching, workspace prompt/project seeding, menu dismissal (click-outside/Escape).
- **Mocked/static**: accounts and OAuth, project creation/persistence, template application, settings saves, sign-out telemetry.
- **Not implemented**: real passwords, server-side sessions/cookies, middleware auth, password reset, account recovery, real project storage.

### Likely Interviewer Questions

1. **Why mock authentication instead of using a real provider?**
   Real auth would demand secrets, a database, and environment setup that add risk without improving the product case the assignment asks for. The mock reproduces the entire UX pattern — validation, loading, state, redirects — with a localStorage flag, so the demo is safe and shareable.

2. **How does the session survive a page refresh?**
   `getMockSession()` reads `architect-demo-auth` from localStorage on every load. Because `AuthProvider` initializes its state from that helper and the guards re-check it after mount, refreshing `/dashboard` stays signed in and refreshing `/login` redirects away.

3. **Where do passwords go?**
   Nowhere. They live in form state, are validated in memory, and are discarded. The design decision was to never store or transmit a credential in a frontend-only prototype.

4. **Why not guard routes with `middleware.ts`?**
   Middleware runs on the server, where the localStorage session does not exist. The client-side guards are the correct tool for a browser-held flag; the mounted-state check exists so prerendered HTML never flashes a protected page, and middleware becomes the upgrade path when sessions move to cookies.

5. **Why use `window.location.search` instead of `useSearchParams` for `?next=`?**
   `useSearchParams` in a static page forces Suspense/dynamic rendering. Reading the query string directly in the submit handler is synchronous, is fully client-side, and keeps the build static.

6. **What do the route groups add?**
   `app/(auth)/` applies the bare AuthShell and the auth layout; `app/(app)/` applies the DashboardShell. Both are ordinary nested layouts scoped by the router — the same public vs. authenticated chrome a real app would have, without conditional branching inside one layout.

7. **How does the workspace receive context from the dashboard?**
   Project cards and the new-project modal build `/workspace?project=&prompt=`. The workspace page resolves `project` to a display name (matching mock project IDs where possible) and passes an `initialPrompt` prop; `WorkspaceShell` seeds its composer state from it.

8. **Why pass props into the workspace rather than sharing the auth context there?**
   The workspace displays a project the user opened; that context is a seed, not a live session dependency. Query parameters keep the workspace stateless and deep-linkable, and avoid coupling it to dashboard state.

9. **How do the auth guards avoid a redirect flash?**
   Both guards render a centered "Loading…" until `mounted` is true (first `useEffect`), then check the session. Server-rendered HTML never contains protected content for a logged-out visitor, and the effect runs after hydration so no navigation race occurs.

10. **What happens if a signed-in user visits `/login`?**
    `RedirectIfAuthed` checks the session after mount and replaces the route to `/dashboard`. This mirrors common "already signed in" behavior and keeps the auth pages unreachable while authenticated.

11. **Why is the New Project modal separate from "Build something new"?**
    The composer is a one-field, prompt-first interaction for starting immediately; the modal is an explicit create flow (name + prompt + optional template) for the project library. Both converge on the same destination: a seeded workspace.

12. **How do templates work end-to-end?**
    Each template card opens the New Project modal pre-filled with the template name and prompt. The user can adjust and submit, which routes to `/workspace` with those values as the initial prompt and project name. No files are actually generated.

13. **What is inside `Menu` and why share it?**
    A trigger button, a positioned list, outside-click and Escape handlers, and `aria` wiring. One implementation keeps keyboard semantics and dismissal behavior identical across the user menu, sidebar account card, and project-card action menus.

14. **Which parts of the dashboard are purely visual vs. interactive?**
    Interactive: navigation, section switching, modal create, menu open links, composer build handoff, logout. Visual: stat counts, project "updated" times, status badges, theme/notification controls — all read from static fixtures or localStorage; none persist to a server.

15. **How would you turn this into real authentication?**
    Replace `lib/auth.ts` with an auth provider (e.g., Auth.js v5 with credentials/email or GitHub OAuth), move guards to `middleware.ts` with HTTP-only cookies, back sessions with a database, and swap the `signInMock` calls for `fetch` to Next.js API routes or server actions. The component boundaries (`LoginForm`, `RequireAuth`, `AuthProvider`) already mirror that shape.

16. **What did the build output tell you about the design?**
    Every page except `/workspace` is statically prerendered. `(auth)` and `(app)` route groups resolve to distinct paths with no URL collisions, and the workspace stays dynamic only because it reads query parameters — a deliberate trade-off that keeps deep links working.

17. **What is the one thing you would most like to improve next?**
    Persisting newly created projects so the New Project modal actually stores a card in the library (eventually backed by a real API), then shipping the developer tooling — editable files, terminal, environment variables — and swapping the mock session for server-side auth.

---
