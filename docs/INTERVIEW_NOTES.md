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

## Phase 2 (Future) — Advanced Features

*To be filled as Phase 2 completes.*
