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

**Decision**: Preview is the default and primary canvas. The workspace provides Preview, Code, Terminal, and Files views; the Phase 1 preview is a static sample application rather than a live iframe.

**Why**: Immediate feedback loop is essential for both user types.

**Alternative**: Separate "Preview" tab.

**Trade-off**: Screen real estate pressure on small displays. The file explorer is hidden on narrower screens and build activity collapses to a compact status row; the preview and prompt composer remain available.

---

### 6. Clear Build/Deployment States

**Problem**: Build and deploy processes are opaque.

**Decision**: Show explicit build states with distinct icons, colors, and status messages. The intended product lifecycle can grow through planning, generation, build, preview, and deployment; the Phase 1 prototype only simulates request understanding, planning, interface building, and checks.

**Why**: Users always know system status and next action.

**Alternative**: Generic progress bar.

**Trade-off**: More states to design, but better UX. In Phase 1 the timer only demonstrates the interaction; it is not connected to an AI service, build runner, or deployment process.

---

## Detailed Decisions

### Layout: Three-Pane Workspace

**Problem**: How to arrange Prompt, Code, Preview, Terminal, Agents?

**Decision**: A compact three-area layout on wide screens:
- **Left**: Sample project file tree
- **Center**: Preview, Code, Terminal, or Files view, selected from a workspace toolbar
- **Right**: Build activity and the latest instruction

**Why**: Matches familiar IDE patterns. Panes can be collapsed.

**Alternative**: Single pane with mode switching.

**Trade-off**: More complex layout logic. Phase 1 uses fixed panel widths rather than resizable splitters. Secondary panels collapse on smaller screens to preserve the main preview and prompt.

### Phase 1 Prompt-to-Preview Implementation

- The prompt composer is persistent at the bottom of `/workspace`; submitting starts a visible timed mock build.
- The preview is a realistic but static analytics dashboard. It does not change based on prompt content.
- Code is a read-only sample and the terminal shows static output. Selecting a file switches to its illustrative code view.
- GitHub, deployment, project switching, and settings are presented as affordances with explanatory prototype messages, not connected integrations.
- The optional context control only changes its prototype UI state; it does not upload or attach files.

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
