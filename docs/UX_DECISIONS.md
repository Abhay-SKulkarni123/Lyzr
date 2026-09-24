# Architect 2.0 — UX Decisions

## Major UX Principles

### 1. Progressive Complexity

**Problem**: Non-technical users are overwhelmed by developer tools; developers are frustrated by no-code limitations.

**Decision**: Implement a single workspace that reveals complexity progressively. The default view shows only Prompt, Build, Preview, Deploy. Technical controls (Agents, Files, Code, Terminal, Git, Environment) are accessed via a mode toggle or progressive disclosure.

**Why**: Both user types share the same canvas. The interface morphs rather than splits.

**Alternative**: Separate "Builder" and "Developer" modes as distinct apps.

**Trade-off**: Single canvas increases component complexity but maintains context continuity.

---

### 2. Prompt-First Interaction

**Problem**: Users expect to start with an idea expressed in natural language.

**Decision**: The primary entry point is a large, centered prompt input. No project creation wizard — typing a prompt *is* project creation.

**Why**: Reduces friction to first value. Aligns with "Idea → Prompt → Build" flow.

**Alternative**: "Create Project" button leading to a form.

**Trade-off**: Loses explicit project metadata upfront (name, description). Mitigated by extracting metadata from the prompt.

---

### 3. Technical Controls Without Overwhelming Beginners

**Problem**: Developers need deep control; beginners need simplicity.

**Decision**: Technical features are accessible through:
- A **mode selector** (Simple / Advanced) in the header
- **Contextual progressive disclosure**: Right-click a component → "View Code", "Open in Terminal"
- **Keyboard shortcuts** for power users (Cmd+K for command palette)

**Why**: Keeps the default UI clean while making advanced features discoverable.

**Alternative**: Feature flags per user role.

**Trade-off**: Requires careful visual design to avoid "hidden" features feeling missing.

---

### 4. Visible Agent Activity

**Problem**: AI generation is a black box. Users don't know what's happening during "Build".

**Decision**: Show a live **Agent Activity Log** in the sidebar during builds:
- Agent name, status, task, output
- Expandable details for each step
- Timestamp and duration

**Why**: Builds trust, enables debugging, teaches users how the system works.

**Alternative**: Simple spinner with "Building..." text.

**Trade-off**: More UI to maintain, but critical for product differentiation.

---

### 5. Continuous Preview

**Problem**: Users need instant visual feedback on changes.

**Decision**: The preview pane is always visible and updates in real-time as code changes. Three view modes:
- **Preview**: Interactive iframe of the running app
- **Code**: Side-by-side file tree + editor
- **Split**: 50/50 preview + code

**Why**: Immediate feedback loop is essential for both user types.

**Alternative**: Separate "Preview" tab.

**Trade-off**: Screen real estate pressure on small displays. Mitigated by responsive layouts.

---

### 6. Clear Build/Deployment States

**Problem**: Build and deploy processes are opaque.

**Decision**: Explicit state machine with visual indicators:
- `idle` → `planning` → `generating` → `building` → `previewing` → `deploying` → `deployed`
- Each state has a distinct icon, color, and message
- Errors show in-context with retry actions

**Why**: Users always know system status and next action.

**Alternative**: Generic progress bar.

**Trade-off**: More states to design, but better UX.

---

## Detailed Decisions

### Layout: Three-Pane Workspace

**Problem**: How to arrange Prompt, Code, Preview, Terminal, Agents?

**Decision**: Resizable three-pane layout:
- **Left**: File Tree / Agent Activity / Git / Environment (tabbed)
- **Center**: Code Editor / Preview (tabbed)
- **Right**: Terminal / Console / Build Log (tabbed)

**Why**: Matches familiar IDE patterns. Panes can be collapsed.

**Alternative**: Single pane with mode switching.

**Trade-off**: More complex layout logic. Required for technical user workflow.

### Color & Visual Language

**Problem**: Avoid generic "AI SaaS" purple gradients.

**Decision**: Custom color palette:
- **Ink** (`#0B0F19`) — primary dark, near-black
- **Slate** (`#1E293B`) — secondary dark
- **Zinc** (`#52525B`) — muted text
- **Sand** (`#F5F0E8`) — warm off-white background
- **Coral** (`#FF6B4A`) — primary accent (actions, links)
- **Mint** (`#2DD4BF`) — success, running states
- **Amber** (`#F59E0B`) — warnings, pending

Typography: **Inter** for UI, **JetBrains Mono** for code/terminal.

**Why**: Distinctive, professional, accessible contrast ratios.

**Alternative**: Standard Tailwind slate/indigo.

**Trade-off**: Custom palette requires design discipline.

### Empty States

**Problem**: New users see blank workspaces.

**Decision**: Every empty state has:
- Illustration/icon
- Clear headline
- Actionable CTA (e.g., "Start with a prompt")
- Secondary help link

**Why**: Converts emptiness into guidance.

### Accessibility

**Decision**: All interactive elements keyboard-navigable. Focus visible. ARIA labels on icon buttons. Color contrast ≥ 4.5:1. Semantic HTML.

---

## Interaction Patterns

### Command Palette (Cmd+K)
- Global search for: projects, commands, files, settings
- Fuzzy matching
- Keyboard-only navigation

### Context Menus (Right-Click)
- File tree: New File, Rename, Delete, Open in Terminal
- Code editor: View in Preview, Copy Path, Show Git History
- Agent log: Retry Step, View Details, Cancel

### Drag & Drop
- Reorder tabs in pane headers
- Move files in file tree (planned)

### Keyboard Shortcuts
- `Cmd+K` — Command palette
- `Cmd+Shift+P` — Switch pane focus
- `Cmd+.` — Toggle terminal
- `Cmd+/` — Toggle agent sidebar
- `Cmd+Enter` — Execute prompt / Build