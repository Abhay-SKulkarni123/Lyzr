# Architect 2.0 — Feature Map

## Assignment Requirements → Feature Mapping

### Requirement: "Design a next-generation vibe-coding platform"

| Feature | Implementation | Planned Screen | Status |
|---------|---------------|----------------|---------|
| Natural language prompting | Prompt composer → timed mock build (no generation) | Workspace → Prompt Composer | 🔧 Functional prototype |
| Build & preview | Static Northstar dashboard with simulated build state; prompt does not alter preview | Workspace → Preview | 📋 Static preview / mocked build |
| Agent activity | Four simulated build stages with compact responsive status | Workspace → Build Activity | 📋 Mocked |
| GitHub integration | Header affordance with explanatory prototype message | Workspace → GitHub button | 📋 Not connected |
| Environment variables | Deferred beyond the Phase 1 prompt-to-preview experience | Later phase | ⏳ Deferred |
| Terminal access | Read-only sample Next.js output; commands are not executed | Workspace → Terminal view | 📋 Static mock |
| Deployment | Header affordance with later-phase message | Workspace → Deploy button | 📋 Not connected |
| File system | Sample project tree; file selection opens matching illustrative code view | Workspace → Files / Explorer | 🔧 Functional prototype |
| Code editor | Read-only sample snippets; no Monaco or editing | Workspace → Code view | 📋 Static mock |
| Authentication | Mocked sign-in/sign-up with localStorage session and gated routes | /login, /signup, (app) layout | 🔧 Functional prototype (mocked accounts) |
| Dashboard hub | Greeting, stats, build-from-prompt composer, recent projects | /dashboard | 🔧 Functional prototype |
| Project library | Full project grid, card actions, New Project modal seeding the workspace | /projects | 🔧 Functional prototype (mock data) |
| Template gallery | Four starter cards; each opens New Project pre-filled | /templates | 🔧 Functional prototype (mock data) |
| Account settings | Profile, preferences, notifications, sign-out | /settings | 🔧 Functional prototype (mock saves) |
| UI/UX (progressive complexity) | Preview default with Code, Terminal, Files, and responsive activity | Workspace | 🔧 Functional prototype |
| Documentation system | README.md, docs/*.md, INTERVIEW_NOTES.md, PHASE_LOG.md | docs/ folder | ✅ Implemented |
| IDE-style interface | Header, sidebar, content area structure | All pages | 🔧 Functional |
| Responsive design | Tailwind responsive utilities | All pages | 🔧 Functional |
| Component modularity | components/ folder structure | All pages | ✅ Implemented |

## Key Feature Details

### 1. Natural Language Prompting
- **Description**: Persistent multiline composer with Build action, helper text, keyboard submission, and a mock context toggle.
- **User flow**: Enter a request → observe simulated build activity → return to the unchanged sample preview.
- **Status**: Functional interaction prototype.
- **Mock vs Real**: No AI backend, prompt parsing, file generation, or context upload.

### 2. Code Preview & Build Pipeline
- **Description**: Browser-framed sample analytics application with KPI cards, revenue visualization, traffic sources, and transactions.
- **Features**: Preview is the default view; Build runs a timed four-step client-side simulation.
- **Status**: Static sample preview with a functional simulated status flow.
- **Mock vs Real**: Preview does not execute generated code or respond to prompt content; no compiler is run.

### 3. Build Activity
- **Description**: Sidebar communicates request understanding, planning, interface building, and checks.
- **Features**: Current stage is emphasized, completed stages receive check marks, and small screens use a compact status row.
- **Status**: Functional timed UI simulation.
- **Mock vs Real**: No agents, LLM calls, expandable logs, pause/retry controls, or real checks.

### 4. File System Browser
- **Description**: Representative sample project tree and a file overview.
- **Features**: Selecting a file opens its read-only illustrative snippet in Code view.
- **Status**: Functional navigation over static fixture data.
- **Mock vs Real**: No real project filesystem or file operations.

### 5. Code Editor
- **Description**: Read-only sample source view for the selected project file.
- **Status**: Static code presentation; Monaco and editing are deferred.
- **Mock vs Real**: Samples do not correspond to the dashboard preview runtime.

### 6. Terminal Panel
- **Description**: Read-only sample startup output shown in Terminal view.
- **Status**: Static terminal mock.
- **Mock vs Real**: No command input, shell, command history, or execution.

### 7. GitHub Integration
- **Description**: Header affordance explains that connection is not enabled.
- **Status**: Placeholder only.
- **Mock vs Real**: No OAuth, repository picker, or API calls.

### 8. Environment Variables Manager
- **Status**: Deferred; not part of the Phase 1 workspace implementation.

### 9. Deployment System
- **Description**: Deploy button explains that deployment belongs to a later phase.
- **Status**: Placeholder only.
- **Mock vs Real**: No deploy targets, pipeline, or deployment API.

### 10. Authentication
- **Status**: Phase 1 deferred; Phase 2 implements mocked sign-in/sign-up.
- **Description**: `/login` and `/signup` render email/password forms (with a mock "Continue with GitHub" flow). The session is stored only as a lightweight flag (`architect-demo-auth` in localStorage) alongside minimal name/email — passwords are never persisted.
- **Behavior**: Signing in routes to `/dashboard` by default, or to `?next=` if provided. `(app)` routes redirect to `/login` when signed out; `(auth)` routes redirect to `/dashboard` when signed in. Client-side guards use a mounted-state gate so prerendered HTML never flashes a redirect.
- **Mock vs Real**: No server, cookies, OAuth, credential storage, or middleware. Password reset and account recovery are not implemented.

### 11. Component Library (shadcn/ui where useful)
- **Description**: Consistent, accessible UI primitives.
- **Features**:
  - Button, Dialog, Dropdown, Tabs, Card, Input, Label
  - Copied into codebase, fully customizable
- **Status**: Building; next phases will import shadcn/ui

## Implementation Priorities

1. **Phase 1 core experience**: Prompt composer, simulated build activity, sample preview, file navigation, responsive workspace.
2. **Later developer tools**: Editable code, real terminal, environment variables, agent orchestration, GitHub integration.
3. **Later production capabilities**: Real generation/build execution, deployment, authentication, API/backend.
4. **Ongoing polish**: Accessibility, testing, and component primitives as the product expands.

## Notes on Mock Data

All mocked features use typed fixtures in `data/` plus mock helpers in `lib/`:
- `data/projects.ts`
- `data/agents.ts`
- `data/files.ts`
- `data/templates.ts` (Phase 2)
- `data/deployments.ts`
- `data/environments.ts`
- `lib/auth.ts` (Phase 2 mock session helpers)
- `lib/mock-api.ts` (API-like functions returning fixture types)

Each file exports TypeScript types and sample data. API responses are derived from these fixtures.

## Future Real Implementation Notes

When moving from prototype to production, replace mocks with:

- **Agent Orchestration**: BullMQ job queue + Docker sandbox
- **Code Execution**: Docker container with language-specific runtimes
- **API layer**: API routes in Next.js (Next.js Edge functions or Node server)
- **Database**: PostgreSQL (project data), Redis (session/caching)
- **Authentication**: NextAuth.js with OAuth (GitHub)
- **Deployment**: Vercel/Netlify APIs or custom CI/CD runner
- **Storage**: S3/MinIO for artifacts, git repos via GitHub API
- **Real-time**: WebSocket (turbo, soketi, or custom)
- **Monitoring**: Sentry + custom logs

Each mock flow will have a clear API-to-mock adapter for future replacement.
