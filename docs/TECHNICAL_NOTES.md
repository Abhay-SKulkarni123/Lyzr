# Architect 2.0 — Technical Notes

This document details the technologies and patterns used in the Architect 2.0 prototype.

---

## 1. Next.js 14 (App Router)

### What it is
Next.js is a React framework with file-system routing, server-side rendering, and API routes.

### Why we use it here
- **Hybrid rendering**: We need server components for layout and client components for interactivity
- **File-based routing**: Natural mapping from routes to files, easy to understand
- **Zero config**: Works out-of-the-box with Tailwind, ESLint, TypeScript
- **Deploy anywhere**: Optimized for Vercel but runs on Node.js servers

### Role in Architect 2.0
- Serves the entire frontend (SPA + SSR)
- Provides API routes for future backend expansion
- Enables static generation where possible

### Key Concepts for Interviews
- **App Router (`app/`)**: Nested layouts, streaming, server actions
- **Server Components**: Runs on server, smaller client bundles, secure by default
- **Client Components (`"use client"`)**: Interactive components with hooks
- **Server Actions**: Functions that run on server (Next.js 14+)

---

## 2. TypeScript

### What it is
Typed superset of JavaScript with static type checking.

### Why we use it here
- **Documentation**: Types are living documentation
- **Refactoring safety**: Rename, extract, move with confidence
- **IDE productivity**: Autocomplete, go-to-definition, inline docs
- **Interview readiness**: Expected in production codebases

### Role in Architect 2.0
- All source `.tsx` and `.ts` files are typed
- `data/` exports typed mock data
- Component props are strictly typed

### Key Concepts for Interviews
- **Type inference**: TS can infer types without explicit annotation
- **Union/Optional types**: API responses may have missing properties
- **Generics**: Components like `Tabs<T>` that are flexible
- **Zod vs TypeScript**: Runtime validation complementing compile-time types

---

## 3. Tailwind CSS

### What it is
A utility-first CSS framework. You apply utility classes directly in HTML: `className="flex items-center p-4 bg-white"`.

### Why we use it here
- **Design system in classes**: Enforces consistent spacing, colors, typography
- **No CSS files**: No context switching, no specificity battles
- **Responsive patterns**: Built-in responsive prefixes (`md:`, `lg:`)
- **Customizable**: Build your own theme

### Role in Architect 2.0
- Global styles in `app/globals.css`
- Component classes use Tailwind for layout, colors, typography
- Custom theme in `tailwind.config.js`

### Key Concepts for Interviews
- **Utility classes**: Understanding `@tailwind base`, `@tailwind components`, `@tailwind utilities`
- **Theme customization**: `extend.colors` for custom design system
- **Purge/CSS extraction**: Only used classes are shipped to production
- **Dark mode**: Supports `media` and `class` strategies

---

## 4. Lucide React

### What it is
A collection of beautiful open-source icons, forked from Feather Icons.

### Why we use it here
- **Tree-shakeable**: Import only icons you use
- **Consistent style**: All icons share same stroke width, rounded corners
- **TypeScript**: `lucide-react` includes types for all icons
- **Accessible**: `title` prop for screen readers

### Role in Architect 2.0
- All UI icons use Lucide (Plus, Terminal, Settings, GitFork, Users, Code2)
- Icons imported directly: `import { Plus } from "lucide-react"`

### Key Concepts for Interviews
- **Icon licensing**: MIT licensed, commercial-friendly
- **SVG vs font icons**: Smaller bundle, no FOUT, better for SEO

---

## 5. Monarch Editor (via `@monaco-editor/react`)

### What it is
Monaco Editor is the code editor component that powers VS Code in the browser.

### Why we use it here
- **Familiar syntax highlighting**: Developers recognize it
- **Multiple language support**: TS, JS, HTML, CSS out of the box
- **Customization**: Themes, key bindings, extensions
- **Performance**: Lightweight enough for single-page apps

### Role in Architect 2.0
- Code edit area in workspace
- Read-only for generated code (editable in future phases)
- Monaco workers for parsing/linting (optional)

### Key Concepts for Interviews
- **Web Workers**: Monaco uses workers for language features
- **Theme customization**: Match app design system
- **Editor refs**: Access Monaco instance programmatically

---

## 6. Mock Data Layer (`data/`)

### What it is
Static TypeScript files exporting typed mock data and functions.

### Why we use it here
- **No mock server needed**: Data lives in the bundle
- **Type safety**: Compile-time validation of mock data shape
- **Fast iteration**: No network latency, no server setup

### Role in Architect 2.0
- `data/projects.ts` — Project definitions
- `data/agents.ts` — AI agent mock definitions
- `data/files.ts` — Simulated file system
- `data/deployments.ts` — Deployment history mock
- `lib/mock-api.ts` — API-like functions returning these types

### Key Concepts for Interviews
- **Separation of concerns**: Data separated from UI
- **Adapter pattern**: API routes can later swap mock-API

---

## 7. Component Architecture

### Pattern: Compound Components
We use compound components for complex UI:

```tsx
<Workspace>
  <Workspace.FileTree />
  <Workspace.CodeEditor />
  <Workspace.Preview />
</Workspace>
```

### Pattern: Controlled vs Uncontrolled
- Controlled: Form inputs, tabs, search boxes (value + onChange)
- Uncontrolled: Read-only displays, static containers

### Pattern: Composition over Inheritance
- Components compose smaller components
- No class inheritance; each component owns its state

---

## 8. State Management Strategy

### Local State (`useState`)
Component-local: prompt input, sidebar open state, active tab.

### Context (`React.Context`)
App-level: current project, session, user preferences.

### Lifting State Up
Data flows up: prompt submission → workspace state update.

---

## 9. Styling & Animation

### CSS-in-JS (Tailwind)
All styling is via Tailwind classes. No CSS modules, no styled-components.

### Animations
Simple transitions using Tailwind:
- `transition-all duration-200` for hover effects
- `animate-pulse` for loading states (planned)

---

## 10. File System Structure Rationale

### `/app/` — Next.js Pages
- Route segments correspond to UI pages
- `layout.tsx` files define shared UI (headers, sidebars)

### `/components/` — Reusable UI
- `ui/` — Primitives (button, dialog)
- `layout/` — Page structure (Header, Sidebar)
- `workspace/` — Specific to workspace
- `dashboard/`, `agents/`, `github/`, `deployment/` — Feature-specific

### `/lib/` — Utilities
- `utils.ts` — `cn()`, formatters
- `mock-api.ts` — Mock data fetching
- `constants.ts` — App-wide constants

### `/types/` — Type Definitions
- Global `types.ts` exported from lib
- Feature-specific types in relevant folders

### `/data/` — Mock Data
- TypeScript arrays/objects exported as fixtures
- Functions that return processed data

---

## 11. Build & Development

### Development Commands (from package.json)
```json
{
  "dev": "next dev",        // Runs dev server with fast refresh
  "build": "next build",    // Compiles TS, optimizes, bundles
  "start": "next start",    // Starts production server
  "lint": "next lint",      // ESLint static analysis
  "type-check": "tsc --noEmit" // Type checking only
}
```

### Important Next.js Concepts for Interviews
- **`_app.tsx`**: Not used in App Router (layout.tsx serves this role)
- **`_document.tsx`**: Custom HTML wrapper (optional, for fonts/meta)
- **Static Generation**: `export const revalidate = 0` for dynamic routes
- **Middleware**: For auth redirects, A/B tests (future)

---

## 12. Potential Future Optimizations

| Area | Optimization | Rationale |
|------|-------------|-----------|
| Code splitting | Dynamic imports for heavy components | Reduce initial bundle |
| Image optimization | `next/image` | Auto-optimize images |
| Caching | SWR revalidation | Reduce duplicate requests |
| Prefetching | Link prefetching | Improve navigation speed |
| Server actions | Write to server directly | No explicit API routes needed |