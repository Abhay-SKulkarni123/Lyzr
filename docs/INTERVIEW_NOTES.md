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

## Phase 1 (Future) — Product Core

*To be filled as Phase 1 completes.*

### Features to Implement
1. Workspace with file tree, code editor, preview pane
2. Prompt input with mock code generation
3. Build pipeline with status flow
4. Agent activity sidebar
5. Terminal panel with mock command output
6. GitHub integration panel (mock)
7. Environment variables manager
8. Deployment flow (mock)
9. Authentication (mock)

### Key Technical Concepts (Planned)
- React context for global state
- File tree with expandable directories
- Monaco Editor integration
- Pane resizing with drag handles
- Tab management for file/code navigation

### Important Product Concepts (Planned)
- "Idea → Prompt → Build → Preview → Deploy" flow
- Mode switching (Simple / Advanced)
- Build status indicators (idle → planning → generating → building → previewing → deploying → deployed)
- Agent activity log with expandable steps

### Interview Questions (Anticipated)
- "How does the file tree sync with the code editor?"
- "What happens when a user edits code in Monaco?"
- "How does the build pipeline handle errors?"
- "What's the state machine for deployment?"

### Suggested Answers (Planned)
- File tree emits click events → editor updates content
- Monaco calls `setValue()` with new code
- Build pipeline has status enum with valid transitions
- Deploy state machine: idle → queued → building → deploying → deployed/error

---

## Phase 2 (Future) — Advanced Features

*To be filled as Phase 2 completes.*