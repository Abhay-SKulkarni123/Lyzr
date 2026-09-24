# Architect 2.0 — Feature Map

## Assignment Requirements → Feature Mapping

### Requirement: "Design a next-generation vibe-coding platform"

| Feature | Implementation | Planned Screen | Status |
|---------|---------------|----------------|---------|
| Natural language prompting | PromptInput component (state) → Mock code generation | Workspace → Prompt Panel | 🔧 Functional |
| Build & preview (generated code) | CodePreview iframe (static) → Simulated build pipeline | Workspace → Preview Pane | 🔧 Functional |
| Agent orchestration | AgentActivitySidebar (mock) → Simulated agent workflow | Workspace → Agent Sidebar | 📋 Mocked |
| GitHub integration | GitHubConnect panel (mock) → Mock repo browser | Workspace → Git Panel | 📋 Mocked |
| Environment variables | EnvironmentPanel (mock) → Manage .env | Workspace → Environment Panel | 🔧 Functional |
| Terminal access | TerminalPanel (mock) → Simulated command output | Workspace → Terminal Pane | 📋 Mocked |
| Deployment | DeployButton with status flow (mock) → Mock deployment pipeline | Workspace → Deployment Dialog | 📋 Mocked |
| File system | FileTree component (mock) → Mock file structure | Workspace → File Tree | 🔧 Functional |
| Code editor | Monaco editor via next/dynamic (functional) → Show/hide | Workspace → Code Pane | 🔧 Functional |
| Authentication | Mock session (useState) → Login modal | Landing page / Workspace | 📋 Mocked |
| UI/UX (progressive complexity) | Mode toggle, pane layout, resizable panels | All pages | 🔧 Functional |
| Documentation system | README.md, docs/*.md, INTERVIEW_NOTES.md, PHASE_LOG.md | docs/ folder | ✅ Implemented |
| IDE-style interface | Header, sidebar, content area structure | All pages | 🔧 Functional |
| Responsive design | Tailwind responsive utilities | All pages | 🔧 Functional |
| Component modularity | components/ folder structure | All pages | ✅ Implemented |

## Key Feature Details

### 1. Natural Language Prompting
- **Description**: Large prompt input with voice recording, markdown support, examples, context memory
- **User flows**: 
  - Non-technical: Submit prompt → System shows plan → Approve or iterate
  - Technical: Submit prompt → Inspect generated plan → Modify agents → Configure parameters
- **Status**: Functional prototype (mock response parsing)
- **Mock vs Real**: Responses are static fixtures parsed for syntax. No AI backend.

### 2. Code Preview & Build Pipeline
- **Description**: Live preview of generated application in an iframe; a “Build” button triggers status flow.
- **Features**: 
  - Auto-refresh on code change (simulated)
  - Real-time compilation progress (mock)
  - Build logs in terminal panel
- **Status**: Functional preview area; build status mock
- **Mock vs Real**: No actual compilation; static HTML + state.

### 3. Agent Activity Dashboard
- **Description**: Sidebar showing AI agent status, progress, and logs.
- **Features**:
  - Agent lifecycle: queued → planning → generating → building → testing → deploying
  - Expandable logs per step
  - Manual control: Pause, Resume, Retry
  - Simulated latency for realistic feel
- **Status**: UI built, mock data populated
- **Mock vs Real**: No real LLM calls; fixture responses.

### 4. File System Browser
- **Description**: Tree view of generated application files with expand/collapse.
- **Features**:
  - Click file → open in Code pane
  - Right-click context menu (New File, Rename, Delete)
  - Simulated file operations (no real FS)
- **Status**: FileTree component functional, mock data
- **Mock vs Real**: File operations are mocked.

### 5. Code Editor
- **Description**: Monaco Editor for editing source files (read-only for prototypes, editable for user changes).
- **Features**:
  - Syntax highlighting for supported languages (TS/JS, HTML, CSS)
  - Linting (basic)
  - Undo/redo (mock for editable sections)
- **Status**: Imported component, functional
- **Mock vs Real**: Real Monaco instance but mock data.

### 6. Terminal Panel
- **Description**: Simulates a command-line interface with a mock shell.
- **Features**:
  - Type commands → see mock output
  - Command history
  - Simulate `npm install`, `git status`, `npm run build`
- **Status**: UI component built, mock command runner
- **Mock vs Real**: No real shell.

### 7. GitHub Integration
- **Description**: Connect to GitHub via OAuth (mocked).
- **Features**:
  - Repo picker (mock)
  - Branch selector
  - Pull request status (mock)
- **Status**: UI for connection, mock repository list
- **Mock vs Real**: No API calls.

### 8. Environment Variables Manager
- **Description**: UI to view, edit, and simulate `.env` file.
- **Features**:
  - List key-value pairs
  - Add/remove/edit entries
  - Validate format (basic)
  - Simulate reload (mock)
- **Status**: Form component functional
- **Mock vs Real**: No actual env loading.

### 9. Deployment System
- **Description**: One-click deploy with visual status pipeline.
- **Features**:
  - Target: Local (mock), Production (mock), Staging (mock)
  - Deploy logs (mock)
  - Rollback (mock)
- **Status**: UI with mock pipeline flow
- **Mock vs Real**: No actual deployment.

### 10. Authentication
- **Description**: Login / Signup / Logout (mocked session).
- **Features**:
  - Email/password mock
  - "Remember me" (mock)
  - Session persistence (localStorage)
  - Protected routes
- **Status**: Auth UI created, session mock
- **Mock vs Real**: No backend validation.

### 11. Component Library (shadcn/ui where useful)
- **Description**: Consistent, accessible UI primitives.
- **Features**:
  - Button, Dialog, Dropdown, Tabs, Card, Input, Label
  - Copied into codebase, fully customizable
- **Status**: Building; next phases will import shadcn/ui

## Implementation Priorities

1. **Core Experience (MVP)**: Landing, navigation, workspace, prompt input, preview, file tree, code editor.
2. **Developer Tools**: Terminal, environment variables, GitHub mock, agents sidebar.
3. **Collaboration/Production**: Deployment, authentication, API layer.
4. **Polish**: Responsive design, accessibility, component library.

## Notes on Mock Data

All mocked features use a single `data/` folder with:
- `data/projects.ts`
- `data/agents.ts`
- `data/files.ts`
- `data/deployments.ts`
- `data/environments.ts`
- `data/sessions.ts`

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