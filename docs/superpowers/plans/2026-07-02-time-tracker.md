# Time Tracker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the personal time-tracking app described in `docs/superpowers/specs/2026-07-02-time-tracker-design.md` — Projects, Tasks, timer-based and manual time entries, and a monthly history view, persisted entirely in `localStorage`.

**Architecture:** One Zustand store (`persist` middleware, single `localStorage` key) holds the whole `Project → Task → TimeEntry` domain inside `src/features/time-tracker/`. Pure functions in `lib/` compute totals and formatting; components read the store directly. Three Next.js App Router pages (`/`, `/projects`, `/history`) share one root layout with a sidebar shell.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Zustand 5 (`persist` middleware), Tailwind CSS v4, `@base-ui/react` (Dialog, Field), Vitest + Testing Library + `jsdom`.

## Global Constraints

- All UI copy is in **Spanish**, matching the wireframe labels exactly (e.g. "Nueva Tarea", "Guardar Registro", "Detener Sesión", "Tareas Recientes").
- Tests are co-located next to the code they test, named `*.test.ts`/`*.test.tsx` (ADR-005).
- Every test file resets the store in `beforeEach`: `useTimeTrackerStore.setState(initialTimeTrackerState); localStorage.clear();`.
- No timer/clock-dependent code reads `new Date()` implicitly where a test needs determinism — functions and store actions that need "now" accept it as an optional parameter defaulting to `new Date()`.
- **Design decision — duration display formats:** the wireframes show inconsistent duration formats (`HH:MM:SS`, `Xh Ym`, and placeholder `XXh XXm` text). This plan standardizes on: `HH:MM:SS` (`formatDurationClock`) for the live timer and any single time-entry row; `Xh Ym` (`formatDurationShort`) for aggregate totals shown on cards (project cards, period totals).
- **Design decision — dropdowns:** "Proyecto" and "Proyecto / Tarea" selectors use a native `<select>` wrapped in Base UI's `Field.Root`/`Field.Label` (via `Field.Control render={<select />}`) instead of Base UI's `Select` compound component. Base UI `Select` uses floating-ui positioning that needs `ResizeObserver`/layout polyfills to interact with in `jsdom`; a native `<select>` keeps full keyboard/screen-reader accessibility and label association through `Field`, without that risk. Modals still use Base UI `Dialog` (ADR-006).
- **Model addition beyond the spec:** `TimeEntry` gets a `createdAt: string` (ISO) field, set at creation time. The approved spec's data model didn't include it, but "Tareas Recientes" needs a well-defined recency order (two manual entries can share the same `date`), and `createdAt` is the only reliable sort key for that.
- Path alias `@/*` resolves to `src/*` (already configured in `tsconfig.json`).
- No edit/delete for Projects, Tasks, or TimeEntries — out of scope per spec.
- **Fix found in Task 11:** do not add the native `required` HTML5 attribute to `Field.Control` inputs whose validation error message must come from a store action's thrown `Error`. The browser's native constraint validation blocks form `submit` (and thus `onSubmit`) before React ever runs, so the store's Spanish error message never renders and the "shows a validation error" test hangs/fails. Validation is fully delegated to the store action's thrown error instead.

---

### Task 1: Design tokens — copy DESIGN.md and wire the Precision Focus theme into Tailwind

**Files:**

- Create: `DESIGN.md` (repo root)
- Modify: `src/app/globals.css`

**Interfaces:**

- Produces: Tailwind color utilities (`bg-primary`, `text-on-surface`, `border-outline-variant`, etc.), radius utilities (`rounded`, `rounded-lg`, etc.), and custom text-style utilities (`text-display-time`, `text-headline-lg`, `text-headline-md`, `text-body-lg`, `text-body-md`, `text-label-mono`) that every later UI task relies on.

This task has no unit-testable logic (pure CSS/config), so it's verified by a successful build instead of a test cycle.

- [ ] **Step 1: Create `DESIGN.md` at the repo root**

```markdown
---
name: Precision Focus
colors:
  surface: "#f7f9fb"
  surface-dim: "#d8dadc"
  surface-bright: "#f7f9fb"
  surface-container-lowest: "#ffffff"
  surface-container-low: "#f2f4f6"
  surface-container: "#eceef0"
  surface-container-high: "#e6e8ea"
  surface-container-highest: "#e0e3e5"
  on-surface: "#191c1e"
  on-surface-variant: "#45464e"
  inverse-surface: "#2d3133"
  inverse-on-surface: "#eff1f3"
  outline: "#75777e"
  outline-variant: "#c6c6ce"
  surface-tint: "#525e7f"
  primary: "#182442"
  on-primary: "#ffffff"
  primary-container: "#2e3a59"
  on-primary-container: "#98a4c9"
  inverse-primary: "#bac6ec"
  secondary: "#006c4b"
  on-secondary: "#ffffff"
  secondary-container: "#64f9bc"
  on-secondary-container: "#00714e"
  tertiary: "#16263a"
  on-tertiary: "#ffffff"
  tertiary-container: "#2c3c51"
  on-tertiary-container: "#96a6bf"
  error: "#ba1a1a"
  on-error: "#ffffff"
  error-container: "#ffdad6"
  on-error-container: "#93000a"
  primary-fixed: "#dae2ff"
  primary-fixed-dim: "#bac6ec"
  on-primary-fixed: "#0d1a38"
  on-primary-fixed-variant: "#3a4666"
  secondary-fixed: "#68fcbf"
  secondary-fixed-dim: "#45dfa4"
  on-secondary-fixed: "#002114"
  on-secondary-fixed-variant: "#005137"
  tertiary-fixed: "#d3e4fe"
  tertiary-fixed-dim: "#b7c8e1"
  on-tertiary-fixed: "#0b1c30"
  on-tertiary-fixed-variant: "#38485d"
  background: "#f7f9fb"
  on-background: "#191c1e"
  surface-variant: "#e0e3e5"
typography:
  display-time:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: "700"
    lineHeight: "1.1"
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: "600"
    lineHeight: 40px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: "600"
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: "400"
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: "400"
    lineHeight: 20px
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: "500"
    lineHeight: 16px
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: "600"
    lineHeight: 32px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  container-max-width: 1280px
---

## Brand & Style

The design system is engineered for deep work and high-output productivity. The brand personality is disciplined, unobtrusive, and systematic. It aims to evoke a sense of "flow state" by removing visual clutter and prioritizing task-critical information.

The aesthetic follows a **Modern Minimalist** approach with a **Functional/SaaS** core. It utilizes heavy whitespace to reduce cognitive load, high-quality typography for temporal data legibility, and a card-based architecture to organize complex project hierarchies. The emotional response should be one of professional reliability and calm efficiency, ensuring that the tool never competes with the user's work for attention.

## Colors

This design system utilizes a focused palette designed to guide the eye toward action and status.

- **Primary (Deep Indigo):** Used for navigation, primary buttons, and headings. It provides a grounded, professional foundation.
- **Secondary (Mint Green):** Reserved exclusively for "Active" states, running timers, and positive progress indicators. It provides a clear, non-aggressive signal of life.
- **Tertiary (Slate):** Used for secondary text, icons, and metadata to maintain a clear hierarchy without the harshness of pure black.
- **Neutral (Soft Gray/White):** A multi-layered background system using `#F8FAFC` for the base and white for elevated cards to create subtle depth.

## Typography

The typography system prioritizes tabular precision and hierarchy. **Inter** is the workhorse for the interface, chosen for its exceptional legibility in small sizes and its neutral, professional character.

For numerical data, durations, and timestamps, a monospaced font (**JetBrains Mono**) is introduced in label roles to ensure that numbers align perfectly in lists and reports, preventing "jumping" text during active timer counts.

- **Display Time:** Large, bold Inter for the primary active timer.
- **Headlines:** Semi-bold for clear section demarcation.
- **Labels:** Monospaced for all duration-based data to maintain alignment in dense tables.

## Layout & Spacing

The layout uses a **Fixed Grid** system for desktop to ensure the productivity dashboard remains organized and predictable, transitioning to a **Fluid Grid** for mobile.

- **Desktop:** 12-column grid with a 24px gutter. Content is housed in a 1280px max-width container.
- **Sidebar:** A fixed 280px navigation rail on the left.
- **Spacing Rhythm:** Based on a 4px baseline. Components use 8px (small), 16px (medium), and 24px (large) increments for internal padding.
- **Reflow:** On tablet (768px), the sidebar collapses into a hamburger menu or bottom bar, and the 12-column grid collapses to 6 columns.

## Elevation & Depth

This design system uses **Tonal Layers** combined with **Ambient Shadows** to create a structured hierarchy without visual noise.

- **Level 0 (Base):** The `#F8FAFC` background.
- **Level 1 (Cards):** White surfaces with a subtle 1px border (`#E2E8F0`) and a soft, highly diffused shadow (Offset: 0, 4px; Blur: 12px; Opacity: 4% Black).
- **Level 2 (Active/Hover):** When a card or timer is active, the shadow deepens (Opacity: 8%) and a 2px Mint Green left-border is applied to indicate focus.
- **Modals:** High-contrast elevation with a backdrop blur (8px) to isolate the user's task.

## Shapes

A **Soft** shape language is employed to balance the professional indigo tones.

- **Standard Elements:** Buttons, input fields, and small cards use a 0.25rem (4px) radius to maintain a crisp, efficient look.
- **Containers:** Large project cards and dashboard widgets use a 0.5rem (8px) radius.
- **Status Pills:** Fully rounded (pill-shaped) to distinguish them from interactive buttons.

## Components

### Timer Buttons

Primary action buttons for "Start" use the Primary Indigo. When active, the button transforms into a "Stop" action using a subtle coral/red tint, while the surrounding card container gains a Mint Green pulse or steady border.

### Activity Charts

Bar and line charts should use the Primary Indigo for historical data and Mint Green for the current day's progress. Use thin 1px grid lines in `#F1F5F9`.

### Project Cards

Cards must include:

- A title in `body-lg` (Semi-bold).
- A duration label in `label-mono`.
- A subtle progress bar at the bottom of the card using the Secondary Mint Green.

### Input Fields

Clean, outlined inputs with a 1px `#CBD5E1` border. On focus, the border shifts to Primary Indigo with a 2px soft glow. Labels should always be visible above the field in `label-mono` at 50% opacity.

### Lists & Activity Feeds

Rows should have a subtle hover state (background change to `#F1F5F9`). Use `label-mono` for all time-entry durations to ensure vertical alignment of digits.
```

- [ ] **Step 2: Replace `src/app/globals.css` with the Precision Focus tokens**

```css
@import "tailwindcss";

/* Base UI: stacking context para portales (Dialog, Popover, etc.) */
.root {
  isolation: isolate;
}

@theme inline {
  --color-surface: #f7f9fb;
  --color-surface-dim: #d8dadc;
  --color-surface-bright: #f7f9fb;
  --color-surface-container-lowest: #ffffff;
  --color-surface-container-low: #f2f4f6;
  --color-surface-container: #eceef0;
  --color-surface-container-high: #e6e8ea;
  --color-surface-container-highest: #e0e3e5;
  --color-on-surface: #191c1e;
  --color-on-surface-variant: #45464e;
  --color-inverse-surface: #2d3133;
  --color-inverse-on-surface: #eff1f3;
  --color-outline: #75777e;
  --color-outline-variant: #c6c6ce;
  --color-primary: #182442;
  --color-on-primary: #ffffff;
  --color-primary-container: #2e3a59;
  --color-on-primary-container: #98a4c9;
  --color-secondary: #006c4b;
  --color-on-secondary: #ffffff;
  --color-secondary-container: #64f9bc;
  --color-on-secondary-container: #00714e;
  --color-tertiary: #16263a;
  --color-on-tertiary: #ffffff;
  --color-tertiary-container: #2c3c51;
  --color-on-tertiary-container: #96a6bf;
  --color-error: #ba1a1a;
  --color-on-error: #ffffff;
  --color-error-container: #ffdad6;
  --color-on-error-container: #93000a;
  --color-background: #f7f9fb;
  --color-on-background: #191c1e;
  --color-surface-variant: #e0e3e5;

  --radius: 0.25rem;
  --radius-sm: 0.125rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-full: 9999px;

  --font-sans: var(--font-inter);
  --font-mono: var(--font-jetbrains-mono);
}

@utility text-display-time {
  font-size: 48px;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

@utility text-headline-lg {
  font-size: 32px;
  font-weight: 600;
  line-height: 40px;
}

@utility text-headline-md {
  font-size: 24px;
  font-weight: 600;
  line-height: 32px;
}

@utility text-body-lg {
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

@utility text-body-md {
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
}

@utility text-label-mono {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  letter-spacing: 0.05em;
}

body {
  background: var(--color-background);
  color: var(--color-on-surface);
  font-family: var(--font-sans), sans-serif;
}
```

- [ ] **Step 3: Verify the build compiles the new theme**

Run: `npm run build`
Expected: build succeeds with no Tailwind/PostCSS errors (this will also fail later if `--font-inter`/`--font-jetbrains-mono` aren't defined yet — that's expected until Task 10 adds them via `next/font`; for this task, confirm there are no CSS syntax errors by running `npx tailwindcss -i src/app/globals.css -o /tmp/tw-check.css --content "src/**/*.{ts,tsx}"` instead if `npm run build` fails only due to the not-yet-defined font variables).

- [ ] **Step 4: Commit**

```bash
git add DESIGN.md src/app/globals.css
git commit -m "feat: add Precision Focus design tokens"
```

---

### Task 2: Domain types and id generator

**Files:**

- Create: `src/features/time-tracker/model/types.ts`
- Create: `src/features/time-tracker/lib/id.ts`
- Test: `src/features/time-tracker/lib/id.test.ts`

**Interfaces:**

- Produces: `Project`, `Task`, `TimeEntry`, `ActiveTimer` types; `generateId(): string`.

- [ ] **Step 1: Create the domain types**

```ts
// src/features/time-tracker/model/types.ts
export type Project = {
  id: string;
  name: string;
  description?: string;
  createdAt: string; // ISO
};

export type Task = {
  id: string;
  projectId: string;
  name: string;
  createdAt: string; // ISO
};

export type TimeEntry = {
  id: string;
  taskId: string;
  date: string; // YYYY-MM-DD
  startTime?: string; // ISO, only set for timer-originated entries
  endTime?: string; // ISO, only set for timer-originated entries
  durationSeconds: number; // captured at creation, never recomputed
  source: "timer" | "manual";
  createdAt: string; // ISO, used to order "recent" entries
};

export type ActiveTimer = {
  taskId: string;
  startedAt: string; // ISO
} | null;
```

- [ ] **Step 2: Write the failing test for `generateId`**

```ts
// src/features/time-tracker/lib/id.test.ts
import { describe, expect, it } from "vitest";
import { generateId } from "./id";

describe("generateId", () => {
  it("returns a UUID v4 formatted string", () => {
    const id = generateId();
    expect(id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });

  it("returns a different value on each call", () => {
    const first = generateId();
    const second = generateId();
    expect(first).not.toBe(second);
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npx vitest run src/features/time-tracker/lib/id.test.ts`
Expected: FAIL with "Cannot find module './id'" (the file doesn't exist yet)

- [ ] **Step 4: Implement `generateId`**

```ts
// src/features/time-tracker/lib/id.ts
export function generateId(): string {
  return crypto.randomUUID();
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/features/time-tracker/lib/id.test.ts`
Expected: PASS (2 tests)

- [ ] **Step 6: Commit**

```bash
git add src/features/time-tracker/model/types.ts src/features/time-tracker/lib/id.ts src/features/time-tracker/lib/id.test.ts
git commit -m "feat: add time-tracker domain types and id generator"
```

---

### Task 3: Duration formatting/parsing and relative-time formatting

**Files:**

- Create: `src/features/time-tracker/lib/duration.ts`
- Test: `src/features/time-tracker/lib/duration.test.ts`
- Create: `src/features/time-tracker/lib/relative-time.ts`
- Test: `src/features/time-tracker/lib/relative-time.test.ts`

**Interfaces:**

- Consumes: nothing (pure functions on primitives).
- Produces: `formatDurationClock(totalSeconds: number): string`, `formatDurationShort(totalSeconds: number): string`, `parseManualDuration(input: string): number | null`, `formatRelativeTime(isoDate: string, now: Date): string`.

- [ ] **Step 1: Write the failing tests for duration formatting/parsing**

```ts
// src/features/time-tracker/lib/duration.test.ts
import { describe, expect, it } from "vitest";
import {
  formatDurationClock,
  formatDurationShort,
  parseManualDuration,
} from "./duration";

describe("formatDurationClock", () => {
  it("formats seconds as zero-padded HH:MM:SS", () => {
    expect(formatDurationClock(3844)).toBe("01:04:04");
  });

  it("pads hours past 99 without truncating", () => {
    expect(formatDurationClock(591645)).toBe("164:20:45");
  });

  it("treats negative input as zero", () => {
    expect(formatDurationClock(-5)).toBe("00:00:00");
  });
});

describe("formatDurationShort", () => {
  it("formats seconds as 'Xh Ym'", () => {
    expect(formatDurationShort(46800)).toBe("13h 00m");
  });

  it("pads minutes under 10", () => {
    expect(formatDurationShort(3900)).toBe("1h 05m");
  });
});

describe("parseManualDuration", () => {
  it("parses HH:MM into seconds", () => {
    expect(parseManualDuration("02:30")).toBe(9000);
  });

  it("rejects an invalid format", () => {
    expect(parseManualDuration("abc")).toBeNull();
  });

  it("rejects a zero duration", () => {
    expect(parseManualDuration("00:00")).toBeNull();
  });

  it("rejects minutes over 59", () => {
    expect(parseManualDuration("01:75")).toBeNull();
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/features/time-tracker/lib/duration.test.ts`
Expected: FAIL with "Cannot find module './duration'"

- [ ] **Step 3: Implement duration formatting/parsing**

```ts
// src/features/time-tracker/lib/duration.ts
export function formatDurationClock(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export function formatDurationShort(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${hours}h ${pad(minutes)}m`;
}

export function parseManualDuration(input: string): number | null {
  const match = /^(\d{1,3}):([0-5]\d)$/.exec(input.trim());
  if (!match) {
    return null;
  }
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  const totalSeconds = hours * 3600 + minutes * 60;
  return totalSeconds > 0 ? totalSeconds : null;
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/features/time-tracker/lib/duration.test.ts`
Expected: PASS (9 tests)

- [ ] **Step 5: Write the failing tests for relative-time formatting**

```ts
// src/features/time-tracker/lib/relative-time.test.ts
import { describe, expect, it } from "vitest";
import { formatRelativeTime } from "./relative-time";

const NOW = new Date("2026-07-02T12:00:00.000Z");

describe("formatRelativeTime", () => {
  it("returns 'hace un momento' for less than a minute ago", () => {
    expect(formatRelativeTime("2026-07-02T11:59:30.000Z", NOW)).toBe(
      "hace un momento",
    );
  });

  it("returns minutes ago under an hour", () => {
    expect(formatRelativeTime("2026-07-02T10:30:00.000Z", NOW)).toBe(
      "hace 90m",
    );
  });

  it("returns hours ago under a day", () => {
    expect(formatRelativeTime("2026-07-02T10:00:00.000Z", NOW)).toBe("hace 2h");
  });

  it("returns 'Ayer' for exactly one day ago", () => {
    expect(formatRelativeTime("2026-07-01T12:00:00.000Z", NOW)).toBe("Ayer");
  });

  it("returns days ago for more than one day", () => {
    expect(formatRelativeTime("2026-06-29T12:00:00.000Z", NOW)).toBe(
      "hace 3 días",
    );
  });
});
```

- [ ] **Step 6: Run the test to verify it fails**

Run: `npx vitest run src/features/time-tracker/lib/relative-time.test.ts`
Expected: FAIL with "Cannot find module './relative-time'"

- [ ] **Step 7: Implement `formatRelativeTime`**

```ts
// src/features/time-tracker/lib/relative-time.ts
export function formatRelativeTime(isoDate: string, now: Date): string {
  const target = new Date(isoDate);
  const diffMinutes = Math.floor((now.getTime() - target.getTime()) / 60000);

  if (diffMinutes < 1) {
    return "hace un momento";
  }
  if (diffMinutes < 60) {
    return `hace ${diffMinutes}m`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `hace ${diffHours}h`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) {
    return "Ayer";
  }
  return `hace ${diffDays} días`;
}
```

- [ ] **Step 8: Run the test to verify it passes**

Run: `npx vitest run src/features/time-tracker/lib/relative-time.test.ts`
Expected: PASS (5 tests)

- [ ] **Step 9: Commit**

```bash
git add src/features/time-tracker/lib/duration.ts src/features/time-tracker/lib/duration.test.ts src/features/time-tracker/lib/relative-time.ts src/features/time-tracker/lib/relative-time.test.ts
git commit -m "feat: add duration and relative-time formatting utilities"
```

---

### Task 4: Period helpers

**Files:**

- Create: `src/features/time-tracker/lib/period.ts`
- Test: `src/features/time-tracker/lib/period.test.ts`

**Interfaces:**

- Produces: `type Period = { year: number; month: number }` (month is 1-12), `getCurrentPeriod(now: Date): Period`, `formatPeriodLabel(period: Period): string`, `shiftPeriod(period: Period, delta: number): Period`, `isDateInPeriod(dateStr: string, period: Period): boolean`.

- [ ] **Step 1: Write the failing tests**

```ts
// src/features/time-tracker/lib/period.test.ts
import { describe, expect, it } from "vitest";
import {
  formatPeriodLabel,
  getCurrentPeriod,
  isDateInPeriod,
  shiftPeriod,
} from "./period";

describe("getCurrentPeriod", () => {
  it("returns the year and 1-based month of the given date", () => {
    expect(getCurrentPeriod(new Date("2026-10-15T00:00:00.000Z"))).toEqual({
      year: 2026,
      month: 10,
    });
  });
});

describe("formatPeriodLabel", () => {
  it("formats the period as 'Mes Año' in Spanish, capitalized", () => {
    expect(formatPeriodLabel({ year: 2026, month: 10 })).toBe("Octubre 2026");
  });

  it("formats January correctly", () => {
    expect(formatPeriodLabel({ year: 2027, month: 1 })).toBe("Enero 2027");
  });
});

describe("shiftPeriod", () => {
  it("moves forward within the same year", () => {
    expect(shiftPeriod({ year: 2026, month: 10 }, 1)).toEqual({
      year: 2026,
      month: 11,
    });
  });

  it("moves backward within the same year", () => {
    expect(shiftPeriod({ year: 2026, month: 10 }, -1)).toEqual({
      year: 2026,
      month: 9,
    });
  });

  it("rolls over into the next year", () => {
    expect(shiftPeriod({ year: 2026, month: 12 }, 1)).toEqual({
      year: 2027,
      month: 1,
    });
  });

  it("rolls back into the previous year", () => {
    expect(shiftPeriod({ year: 2026, month: 1 }, -1)).toEqual({
      year: 2025,
      month: 12,
    });
  });
});

describe("isDateInPeriod", () => {
  it("returns true when the date falls within the period", () => {
    expect(isDateInPeriod("2026-10-15", { year: 2026, month: 10 })).toBe(true);
  });

  it("returns false when the month differs", () => {
    expect(isDateInPeriod("2026-11-15", { year: 2026, month: 10 })).toBe(false);
  });

  it("returns false when the year differs", () => {
    expect(isDateInPeriod("2025-10-15", { year: 2026, month: 10 })).toBe(false);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/features/time-tracker/lib/period.test.ts`
Expected: FAIL with "Cannot find module './period'"

- [ ] **Step 3: Implement the period helpers**

```ts
// src/features/time-tracker/lib/period.ts
export type Period = { year: number; month: number }; // month: 1-12

const MONTH_LABELS = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

export function getCurrentPeriod(now: Date): Period {
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

export function formatPeriodLabel(period: Period): string {
  const monthName = MONTH_LABELS[period.month - 1];
  const capitalized = monthName.charAt(0).toUpperCase() + monthName.slice(1);
  return `${capitalized} ${period.year}`;
}

export function shiftPeriod(period: Period, delta: number): Period {
  const zeroBasedMonth = period.month - 1 + delta;
  const year = period.year + Math.floor(zeroBasedMonth / 12);
  const month = (((zeroBasedMonth % 12) + 12) % 12) + 1;
  return { year, month };
}

export function isDateInPeriod(dateStr: string, period: Period): boolean {
  const [year, month] = dateStr.split("-").map(Number);
  return year === period.year && month === period.month;
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/features/time-tracker/lib/period.test.ts`
Expected: PASS (10 tests)

- [ ] **Step 5: Commit**

```bash
git add src/features/time-tracker/lib/period.ts src/features/time-tracker/lib/period.test.ts
git commit -m "feat: add period helpers for monthly history navigation"
```

---

### Task 5: Test Object Mothers

**Files:**

- Create: `src/features/time-tracker/testing/object-mothers.ts`
- Test: `src/features/time-tracker/testing/object-mothers.test.ts`

**Interfaces:**

- Consumes: `Project`, `Task`, `TimeEntry` from `../model/types` (Task 2).
- Produces: `aProject(overrides?: Partial<Project>): Project`, `aTask(overrides?: Partial<Task>): Task`, `aTimeEntry(overrides?: Partial<TimeEntry>): TimeEntry` — every task from here on that needs domain fixtures imports these.

- [ ] **Step 1: Write the failing tests**

```ts
// src/features/time-tracker/testing/object-mothers.test.ts
import { describe, expect, it } from "vitest";
import { aProject, aTask, aTimeEntry } from "./object-mothers";

describe("aProject", () => {
  it("returns a valid project with defaults", () => {
    expect(aProject()).toMatchObject({
      id: "project-1",
      name: "Proyecto de Prueba",
    });
  });

  it("applies overrides", () => {
    expect(aProject({ id: "project-2", name: "Otro" })).toMatchObject({
      id: "project-2",
      name: "Otro",
    });
  });
});

describe("aTask", () => {
  it("returns a valid task with defaults", () => {
    expect(aTask()).toMatchObject({
      id: "task-1",
      projectId: "project-1",
      name: "Tarea de Prueba",
    });
  });

  it("applies overrides", () => {
    expect(aTask({ projectId: "project-2" })).toMatchObject({
      projectId: "project-2",
    });
  });
});

describe("aTimeEntry", () => {
  it("returns a valid time entry with defaults", () => {
    expect(aTimeEntry()).toMatchObject({
      id: "entry-1",
      taskId: "task-1",
      durationSeconds: 3600,
      source: "manual",
    });
  });

  it("applies overrides", () => {
    expect(aTimeEntry({ source: "timer", durationSeconds: 60 })).toMatchObject({
      source: "timer",
      durationSeconds: 60,
    });
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/features/time-tracker/testing/object-mothers.test.ts`
Expected: FAIL with "Cannot find module './object-mothers'"

- [ ] **Step 3: Implement the Object Mothers**

```ts
// src/features/time-tracker/testing/object-mothers.ts
import type { Project, Task, TimeEntry } from "../model/types";

export function aProject(overrides: Partial<Project> = {}): Project {
  return {
    id: "project-1",
    name: "Proyecto de Prueba",
    description: undefined,
    createdAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

export function aTask(overrides: Partial<Task> = {}): Task {
  return {
    id: "task-1",
    projectId: "project-1",
    name: "Tarea de Prueba",
    createdAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

export function aTimeEntry(overrides: Partial<TimeEntry> = {}): TimeEntry {
  return {
    id: "entry-1",
    taskId: "task-1",
    date: "2026-01-01",
    durationSeconds: 3600,
    source: "manual",
    createdAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/features/time-tracker/testing/object-mothers.test.ts`
Expected: PASS (6 tests)

- [ ] **Step 5: Commit**

```bash
git add src/features/time-tracker/testing/object-mothers.ts src/features/time-tracker/testing/object-mothers.test.ts
git commit -m "test: add time-tracker object mothers"
```

---

### Task 6: Store — createProject and createTask

**Files:**

- Create: `src/features/time-tracker/store/time-tracker-store.ts`
- Test: `src/features/time-tracker/store/time-tracker-store.test.ts`

**Interfaces:**

- Consumes: `generateId` (Task 2), `Project`/`Task`/`TimeEntry`/`ActiveTimer` types (Task 2).
- Produces: `useTimeTrackerStore` (Zustand hook), `initialTimeTrackerState`, and the actions `createProject`, `createTask` (this task), plus placeholders for `startTimer`/`stopTimer`/`addManualEntry` added in Tasks 7-8. Every later store/component task imports `useTimeTrackerStore` and `initialTimeTrackerState` from this file, and resets with `useTimeTrackerStore.setState(initialTimeTrackerState); localStorage.clear();` in `beforeEach`.

- [ ] **Step 1: Write the failing tests for createProject/createTask**

```ts
// src/features/time-tracker/store/time-tracker-store.test.ts
import { beforeEach, describe, expect, it } from "vitest";
import {
  initialTimeTrackerState,
  useTimeTrackerStore,
} from "./time-tracker-store";

beforeEach(() => {
  useTimeTrackerStore.setState(initialTimeTrackerState);
  localStorage.clear();
});

describe("createProject", () => {
  it("adds a project with a trimmed name", () => {
    const project = useTimeTrackerStore
      .getState()
      .createProject({ name: "  Rebranding  " });

    expect(project.name).toBe("Rebranding");
    expect(useTimeTrackerStore.getState().projects[project.id]).toEqual(
      project,
    );
  });

  it("persists the project to localStorage", () => {
    useTimeTrackerStore.getState().createProject({ name: "Rebranding" });

    const raw = localStorage.getItem("time-tracker:v1");
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw as string);
    expect(Object.values(parsed.state.projects)).toHaveLength(1);
  });

  it("throws when the name is empty", () => {
    expect(() =>
      useTimeTrackerStore.getState().createProject({ name: "   " }),
    ).toThrow("El nombre del proyecto es obligatorio.");
  });
});

describe("createTask", () => {
  it("adds a task linked to an existing project", () => {
    const project = useTimeTrackerStore
      .getState()
      .createProject({ name: "Rebranding" });
    const task = useTimeTrackerStore
      .getState()
      .createTask({ projectId: project.id, name: "Wireframes" });

    expect(task.projectId).toBe(project.id);
    expect(useTimeTrackerStore.getState().tasks[task.id]).toEqual(task);
  });

  it("throws when the name is empty", () => {
    const project = useTimeTrackerStore
      .getState()
      .createProject({ name: "Rebranding" });
    expect(() =>
      useTimeTrackerStore
        .getState()
        .createTask({ projectId: project.id, name: " " }),
    ).toThrow("El nombre de la tarea es obligatorio.");
  });

  it("throws when the project does not exist", () => {
    expect(() =>
      useTimeTrackerStore
        .getState()
        .createTask({ projectId: "missing", name: "Wireframes" }),
    ).toThrow("El proyecto no existe.");
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/features/time-tracker/store/time-tracker-store.test.ts`
Expected: FAIL with "Cannot find module './time-tracker-store'"

- [ ] **Step 3: Implement the store with createProject and createTask**

```ts
// src/features/time-tracker/store/time-tracker-store.ts
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { generateId } from "../lib/id";
import type { ActiveTimer, Project, Task, TimeEntry } from "../model/types";

export type TimeTrackerState = {
  projects: Record<string, Project>;
  tasks: Record<string, Task>;
  timeEntries: Record<string, TimeEntry>;
  activeTimer: ActiveTimer;
};

export type TimeTrackerActions = {
  createProject: (input: { name: string; description?: string }) => Project;
  createTask: (input: { projectId: string; name: string }) => Task;
  startTimer: (taskId: string, now?: Date) => void;
  stopTimer: (now?: Date) => void;
  addManualEntry: (input: {
    taskId: string;
    date: string;
    durationSeconds: number;
    now?: Date;
  }) => TimeEntry;
};

export const initialTimeTrackerState: TimeTrackerState = {
  projects: {},
  tasks: {},
  timeEntries: {},
  activeTimer: null,
};

export const useTimeTrackerStore = create<
  TimeTrackerState & TimeTrackerActions
>()(
  persist(
    (set, get) => ({
      ...initialTimeTrackerState,

      createProject: ({ name, description }) => {
        const trimmedName = name.trim();
        if (!trimmedName) {
          throw new Error("El nombre del proyecto es obligatorio.");
        }
        const project: Project = {
          id: generateId(),
          name: trimmedName,
          description: description?.trim() || undefined,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          projects: { ...state.projects, [project.id]: project },
        }));
        return project;
      },

      createTask: ({ projectId, name }) => {
        const trimmedName = name.trim();
        if (!trimmedName) {
          throw new Error("El nombre de la tarea es obligatorio.");
        }
        if (!get().projects[projectId]) {
          throw new Error("El proyecto no existe.");
        }
        const task: Task = {
          id: generateId(),
          projectId,
          name: trimmedName,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ tasks: { ...state.tasks, [task.id]: task } }));
        return task;
      },

      startTimer: () => {
        throw new Error("Not implemented yet");
      },
      stopTimer: () => {
        throw new Error("Not implemented yet");
      },
      addManualEntry: () => {
        throw new Error("Not implemented yet");
      },
    }),
    {
      name: "time-tracker:v1",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/features/time-tracker/store/time-tracker-store.test.ts`
Expected: PASS (6 tests)

- [ ] **Step 5: Commit**

```bash
git add src/features/time-tracker/store/time-tracker-store.ts src/features/time-tracker/store/time-tracker-store.test.ts
git commit -m "feat: add time-tracker store with createProject and createTask"
```

---

### Task 7: Store — startTimer and stopTimer

**Files:**

- Modify: `src/features/time-tracker/store/time-tracker-store.ts`
- Modify: `src/features/time-tracker/store/time-tracker-store.test.ts`

**Interfaces:**

- Consumes: the store scaffolding from Task 6.
- Produces: working `startTimer(taskId: string, now?: Date): void` and `stopTimer(now?: Date): void` — later `TimerPanel` (Task 15) and `RecentEntriesList` (Task 17) call these.

- [ ] **Step 1: Add the failing tests for startTimer/stopTimer**

Add to the end of `src/features/time-tracker/store/time-tracker-store.test.ts`:

```ts
describe("startTimer / stopTimer", () => {
  it("starts a timer for an existing task", () => {
    const project = useTimeTrackerStore
      .getState()
      .createProject({ name: "Rebranding" });
    const task = useTimeTrackerStore
      .getState()
      .createTask({ projectId: project.id, name: "Wireframes" });
    const startedAt = new Date("2026-07-02T09:00:00.000Z");

    useTimeTrackerStore.getState().startTimer(task.id, startedAt);

    expect(useTimeTrackerStore.getState().activeTimer).toEqual({
      taskId: task.id,
      startedAt: startedAt.toISOString(),
    });
  });

  it("throws when the task does not exist", () => {
    expect(() => useTimeTrackerStore.getState().startTimer("missing")).toThrow(
      "La tarea no existe.",
    );
  });

  it("stops the active timer and records a time entry with the elapsed duration", () => {
    const project = useTimeTrackerStore
      .getState()
      .createProject({ name: "Rebranding" });
    const task = useTimeTrackerStore
      .getState()
      .createTask({ projectId: project.id, name: "Wireframes" });
    const startedAt = new Date("2026-07-02T09:00:00.000Z");
    const stoppedAt = new Date("2026-07-02T09:30:00.000Z");

    useTimeTrackerStore.getState().startTimer(task.id, startedAt);
    useTimeTrackerStore.getState().stopTimer(stoppedAt);

    const entries = Object.values(useTimeTrackerStore.getState().timeEntries);
    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({
      taskId: task.id,
      date: "2026-07-02",
      durationSeconds: 1800,
      source: "timer",
    });
    expect(useTimeTrackerStore.getState().activeTimer).toBeNull();
  });

  it("stopping with no active timer is a no-op", () => {
    useTimeTrackerStore
      .getState()
      .stopTimer(new Date("2026-07-02T09:30:00.000Z"));

    expect(useTimeTrackerStore.getState().activeTimer).toBeNull();
    expect(
      Object.values(useTimeTrackerStore.getState().timeEntries),
    ).toHaveLength(0);
  });

  it("discards a zero-duration entry when start and stop happen at the same instant", () => {
    const project = useTimeTrackerStore
      .getState()
      .createProject({ name: "Rebranding" });
    const task = useTimeTrackerStore
      .getState()
      .createTask({ projectId: project.id, name: "Wireframes" });
    const instant = new Date("2026-07-02T09:00:00.000Z");

    useTimeTrackerStore.getState().startTimer(task.id, instant);
    useTimeTrackerStore.getState().stopTimer(instant);

    expect(
      Object.values(useTimeTrackerStore.getState().timeEntries),
    ).toHaveLength(0);
  });

  it("switching to a new timer stops the previous one first (RN-03)", () => {
    const project = useTimeTrackerStore
      .getState()
      .createProject({ name: "Rebranding" });
    const taskA = useTimeTrackerStore
      .getState()
      .createTask({ projectId: project.id, name: "Wireframes" });
    const taskB = useTimeTrackerStore
      .getState()
      .createTask({ projectId: project.id, name: "Revisión" });
    const startA = new Date("2026-07-02T09:00:00.000Z");
    const switchAt = new Date("2026-07-02T09:15:00.000Z");

    useTimeTrackerStore.getState().startTimer(taskA.id, startA);
    useTimeTrackerStore.getState().startTimer(taskB.id, switchAt);

    const entries = Object.values(useTimeTrackerStore.getState().timeEntries);
    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({
      taskId: taskA.id,
      durationSeconds: 900,
      source: "timer",
    });
    expect(useTimeTrackerStore.getState().activeTimer).toEqual({
      taskId: taskB.id,
      startedAt: switchAt.toISOString(),
    });
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/features/time-tracker/store/time-tracker-store.test.ts`
Expected: FAIL — the new `startTimer`/`stopTimer` cases throw `"Not implemented yet"`.

- [ ] **Step 3: Implement startTimer and stopTimer**

In `src/features/time-tracker/store/time-tracker-store.ts`, replace the `startTimer`/`stopTimer` placeholders:

```ts
      startTimer: (taskId, now = new Date()) => {
        if (!get().tasks[taskId]) {
          throw new Error("La tarea no existe.");
        }
        if (get().activeTimer) {
          get().stopTimer(now);
        }
        set({ activeTimer: { taskId, startedAt: now.toISOString() } });
      },

      stopTimer: (now = new Date()) => {
        const active = get().activeTimer;
        if (!active) {
          return;
        }
        const startedAt = new Date(active.startedAt);
        const durationSeconds = Math.floor((now.getTime() - startedAt.getTime()) / 1000);
        if (durationSeconds > 0) {
          const entry: TimeEntry = {
            id: generateId(),
            taskId: active.taskId,
            date: active.startedAt.slice(0, 10),
            startTime: active.startedAt,
            endTime: now.toISOString(),
            durationSeconds,
            source: "timer",
            createdAt: now.toISOString(),
          };
          set((state) => ({ timeEntries: { ...state.timeEntries, [entry.id]: entry } }));
        }
        set({ activeTimer: null });
      },
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/features/time-tracker/store/time-tracker-store.test.ts`
Expected: PASS (12 tests)

- [ ] **Step 5: Commit**

```bash
git add src/features/time-tracker/store/time-tracker-store.ts src/features/time-tracker/store/time-tracker-store.test.ts
git commit -m "feat: add startTimer/stopTimer with RN-03 auto-switch"
```

---

### Task 8: Store — addManualEntry

**Files:**

- Modify: `src/features/time-tracker/store/time-tracker-store.ts`
- Modify: `src/features/time-tracker/store/time-tracker-store.test.ts`

**Interfaces:**

- Consumes: the store from Tasks 6-7.
- Produces: working `addManualEntry(input: { taskId: string; date: string; durationSeconds: number; now?: Date }): TimeEntry` — later `ManualEntryForm` (Task 16) calls this.

- [ ] **Step 1: Add the failing tests for addManualEntry**

Add to the end of `src/features/time-tracker/store/time-tracker-store.test.ts`:

```ts
describe("addManualEntry", () => {
  it("adds a manual entry for an existing task", () => {
    const project = useTimeTrackerStore
      .getState()
      .createProject({ name: "Rebranding" });
    const task = useTimeTrackerStore
      .getState()
      .createTask({ projectId: project.id, name: "Wireframes" });

    const entry = useTimeTrackerStore.getState().addManualEntry({
      taskId: task.id,
      date: "2026-07-02",
      durationSeconds: 9000,
    });

    expect(entry).toMatchObject({
      taskId: task.id,
      date: "2026-07-02",
      durationSeconds: 9000,
      source: "manual",
    });
    expect(useTimeTrackerStore.getState().timeEntries[entry.id]).toEqual(entry);
  });

  it("throws when the task does not exist", () => {
    expect(() =>
      useTimeTrackerStore.getState().addManualEntry({
        taskId: "missing",
        date: "2026-07-02",
        durationSeconds: 60,
      }),
    ).toThrow("La tarea no existe.");
  });

  it("throws when the date is empty", () => {
    const project = useTimeTrackerStore
      .getState()
      .createProject({ name: "Rebranding" });
    const task = useTimeTrackerStore
      .getState()
      .createTask({ projectId: project.id, name: "Wireframes" });

    expect(() =>
      useTimeTrackerStore
        .getState()
        .addManualEntry({ taskId: task.id, date: "", durationSeconds: 60 }),
    ).toThrow("La fecha es obligatoria.");
  });

  it("throws when the duration is not greater than zero", () => {
    const project = useTimeTrackerStore
      .getState()
      .createProject({ name: "Rebranding" });
    const task = useTimeTrackerStore
      .getState()
      .createTask({ projectId: project.id, name: "Wireframes" });

    expect(() =>
      useTimeTrackerStore.getState().addManualEntry({
        taskId: task.id,
        date: "2026-07-02",
        durationSeconds: 0,
      }),
    ).toThrow("La duración debe ser mayor a cero.");
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/features/time-tracker/store/time-tracker-store.test.ts`
Expected: FAIL — the new `addManualEntry` cases throw `"Not implemented yet"`.

- [ ] **Step 3: Implement addManualEntry**

In `src/features/time-tracker/store/time-tracker-store.ts`, replace the `addManualEntry` placeholder:

```ts
      addManualEntry: ({ taskId, date, durationSeconds, now = new Date() }) => {
        if (!get().tasks[taskId]) {
          throw new Error("La tarea no existe.");
        }
        if (!date) {
          throw new Error("La fecha es obligatoria.");
        }
        if (durationSeconds <= 0) {
          throw new Error("La duración debe ser mayor a cero.");
        }
        const entry: TimeEntry = {
          id: generateId(),
          taskId,
          date,
          durationSeconds,
          source: "manual",
          createdAt: now.toISOString(),
        };
        set((state) => ({ timeEntries: { ...state.timeEntries, [entry.id]: entry } }));
        return entry;
      },
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/features/time-tracker/store/time-tracker-store.test.ts`
Expected: PASS (16 tests)

- [ ] **Step 5: Commit**

```bash
git add src/features/time-tracker/store/time-tracker-store.ts src/features/time-tracker/store/time-tracker-store.test.ts
git commit -m "feat: add addManualEntry action"
```

---

### Task 9: Selectors — totals and period queries

**Files:**

- Create: `src/features/time-tracker/lib/selectors.ts`
- Test: `src/features/time-tracker/lib/selectors.test.ts`

**Interfaces:**

- Consumes: `Project`/`Task`/`TimeEntry` types (Task 2), `Period`/`isDateInPeriod` (Task 4), `aProject`/`aTask`/`aTimeEntry` (Task 5).
- Produces: `getTaskTotalSeconds`, `getProjectTotalSeconds`, `getEntriesForPeriod`, `getProjectTotalsForPeriod`, `getRecentEntries` — consumed by `TimerPanel`/`RecentEntriesList`/`ProjectList`/`HistoryView` (Tasks 12, 15, 17, 18).

- [ ] **Step 1: Write the failing tests**

```ts
// src/features/time-tracker/lib/selectors.test.ts
import { describe, expect, it } from "vitest";
import { aProject, aTask, aTimeEntry } from "../testing/object-mothers";
import {
  getEntriesForPeriod,
  getProjectTotalSeconds,
  getProjectTotalsForPeriod,
  getRecentEntries,
  getTaskTotalSeconds,
} from "./selectors";

const project1 = aProject({ id: "project-1", name: "Rediseño" });
const project2 = aProject({ id: "project-2", name: "Nexus App" });
const task1 = aTask({ id: "task-1", projectId: "project-1" });
const task2 = aTask({ id: "task-2", projectId: "project-1" });
const task3 = aTask({ id: "task-3", projectId: "project-2" });

const projects = { [project1.id]: project1, [project2.id]: project2 };
const tasks = { [task1.id]: task1, [task2.id]: task2, [task3.id]: task3 };

describe("getTaskTotalSeconds", () => {
  it("sums the durations of entries for a task", () => {
    const entries = {
      "entry-1": aTimeEntry({
        id: "entry-1",
        taskId: "task-1",
        durationSeconds: 100,
      }),
      "entry-2": aTimeEntry({
        id: "entry-2",
        taskId: "task-1",
        durationSeconds: 200,
      }),
      "entry-3": aTimeEntry({
        id: "entry-3",
        taskId: "task-2",
        durationSeconds: 999,
      }),
    };

    expect(getTaskTotalSeconds(entries, "task-1")).toBe(300);
  });

  it("returns 0 for a task with no entries", () => {
    expect(getTaskTotalSeconds({}, "task-1")).toBe(0);
  });
});

describe("getProjectTotalSeconds", () => {
  it("sums the durations across all tasks of a project", () => {
    const entries = {
      "entry-1": aTimeEntry({
        id: "entry-1",
        taskId: "task-1",
        durationSeconds: 100,
      }),
      "entry-2": aTimeEntry({
        id: "entry-2",
        taskId: "task-2",
        durationSeconds: 200,
      }),
      "entry-3": aTimeEntry({
        id: "entry-3",
        taskId: "task-3",
        durationSeconds: 999,
      }),
    };

    expect(getProjectTotalSeconds(entries, tasks, "project-1")).toBe(300);
    expect(getProjectTotalSeconds(entries, tasks, "project-2")).toBe(999);
  });
});

describe("getEntriesForPeriod", () => {
  it("returns only entries within the period, newest date first", () => {
    const entries = {
      "entry-1": aTimeEntry({
        id: "entry-1",
        taskId: "task-1",
        date: "2026-10-05",
      }),
      "entry-2": aTimeEntry({
        id: "entry-2",
        taskId: "task-1",
        date: "2026-10-20",
      }),
      "entry-3": aTimeEntry({
        id: "entry-3",
        taskId: "task-1",
        date: "2026-11-01",
      }),
    };

    const result = getEntriesForPeriod(entries, { year: 2026, month: 10 });

    expect(result.map((entry) => entry.id)).toEqual(["entry-2", "entry-1"]);
  });
});

describe("getProjectTotalsForPeriod", () => {
  it("groups entry totals by project for the given period", () => {
    const entries = {
      "entry-1": aTimeEntry({
        id: "entry-1",
        taskId: "task-1",
        date: "2026-10-05",
        durationSeconds: 100,
      }),
      "entry-2": aTimeEntry({
        id: "entry-2",
        taskId: "task-3",
        date: "2026-10-06",
        durationSeconds: 200,
      }),
      "entry-3": aTimeEntry({
        id: "entry-3",
        taskId: "task-1",
        date: "2026-09-01",
        durationSeconds: 999,
      }),
    };

    const result = getProjectTotalsForPeriod(entries, tasks, projects, {
      year: 2026,
      month: 10,
    });

    expect(result).toEqual(
      expect.arrayContaining([
        { project: project1, totalSeconds: 100 },
        { project: project2, totalSeconds: 200 },
      ]),
    );
    expect(result).toHaveLength(2);
  });
});

describe("getRecentEntries", () => {
  it("returns the N most recently created entries, newest first", () => {
    const entries = {
      "entry-1": aTimeEntry({
        id: "entry-1",
        createdAt: "2026-07-01T10:00:00.000Z",
      }),
      "entry-2": aTimeEntry({
        id: "entry-2",
        createdAt: "2026-07-02T10:00:00.000Z",
      }),
      "entry-3": aTimeEntry({
        id: "entry-3",
        createdAt: "2026-07-03T10:00:00.000Z",
      }),
    };

    expect(getRecentEntries(entries, 2).map((entry) => entry.id)).toEqual([
      "entry-3",
      "entry-2",
    ]);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/features/time-tracker/lib/selectors.test.ts`
Expected: FAIL with "Cannot find module './selectors'"

- [ ] **Step 3: Implement the selectors**

```ts
// src/features/time-tracker/lib/selectors.ts
import type { Project, Task, TimeEntry } from "../model/types";
import { isDateInPeriod, type Period } from "./period";

export function getTaskTotalSeconds(
  timeEntries: Record<string, TimeEntry>,
  taskId: string,
): number {
  return Object.values(timeEntries)
    .filter((entry) => entry.taskId === taskId)
    .reduce((total, entry) => total + entry.durationSeconds, 0);
}

export function getProjectTotalSeconds(
  timeEntries: Record<string, TimeEntry>,
  tasks: Record<string, Task>,
  projectId: string,
): number {
  const taskIds = new Set(
    Object.values(tasks)
      .filter((task) => task.projectId === projectId)
      .map((task) => task.id),
  );
  return Object.values(timeEntries)
    .filter((entry) => taskIds.has(entry.taskId))
    .reduce((total, entry) => total + entry.durationSeconds, 0);
}

export function getEntriesForPeriod(
  timeEntries: Record<string, TimeEntry>,
  period: Period,
): TimeEntry[] {
  return Object.values(timeEntries)
    .filter((entry) => isDateInPeriod(entry.date, period))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getProjectTotalsForPeriod(
  timeEntries: Record<string, TimeEntry>,
  tasks: Record<string, Task>,
  projects: Record<string, Project>,
  period: Period,
): Array<{ project: Project; totalSeconds: number }> {
  const totalsByProject = new Map<string, number>();
  for (const entry of getEntriesForPeriod(timeEntries, period)) {
    const task = tasks[entry.taskId];
    if (!task) {
      continue;
    }
    totalsByProject.set(
      task.projectId,
      (totalsByProject.get(task.projectId) ?? 0) + entry.durationSeconds,
    );
  }
  return Array.from(totalsByProject.entries())
    .map(([projectId, totalSeconds]) => ({
      project: projects[projectId],
      totalSeconds,
    }))
    .filter((item): item is { project: Project; totalSeconds: number } =>
      Boolean(item.project),
    );
}

export function getRecentEntries(
  timeEntries: Record<string, TimeEntry>,
  limit: number,
): TimeEntry[] {
  return Object.values(timeEntries)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/features/time-tracker/lib/selectors.test.ts`
Expected: PASS (8 tests)

- [ ] **Step 5: Commit**

```bash
git add src/features/time-tracker/lib/selectors.ts src/features/time-tracker/lib/selectors.test.ts
git commit -m "feat: add totals and period selectors"
```

---

### Task 10: AppShell (sidebar navigation) and root layout

**Files:**

- Create: `src/components/app-shell/app-shell.tsx`
- Test: `src/components/app-shell/app-shell.test.tsx`
- Modify: `src/app/layout.tsx`

**Interfaces:**

- Consumes: nothing from the feature (agnostic layout component).
- Produces: `AppShell({ children }: { children: React.ReactNode })`, wired into the root layout so every page (Tasks 13, 17, 18) renders inside it. Loads `Inter`/`JetBrains Mono` fonts as `--font-inter`/`--font-jetbrains-mono`, matching the CSS variables declared in Task 1.

- [ ] **Step 1: Write the failing tests**

```tsx
// src/components/app-shell/app-shell.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AppShell } from "./app-shell";

vi.mock("next/navigation", () => ({
  usePathname: () => "/projects",
}));

describe("AppShell", () => {
  it("marks the link matching the current path as active", () => {
    render(
      <AppShell>
        <p>contenido</p>
      </AppShell>,
    );

    expect(screen.getByRole("link", { name: "Proyectos" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Tareas" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("renders the children inside the main content area", () => {
    render(
      <AppShell>
        <p>contenido</p>
      </AppShell>,
    );

    expect(screen.getByText("contenido")).toBeInTheDocument();
  });

  it("renders the three navigation links", () => {
    render(
      <AppShell>
        <p>contenido</p>
      </AppShell>,
    );

    expect(screen.getByRole("link", { name: "Tareas" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("link", { name: "Proyectos" })).toHaveAttribute(
      "href",
      "/projects",
    );
    expect(
      screen.getByRole("link", { name: "Historial de Registros" }),
    ).toHaveAttribute("href", "/history");
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/components/app-shell/app-shell.test.tsx`
Expected: FAIL with "Cannot find module './app-shell'"

- [ ] **Step 3: Implement AppShell**

```tsx
// src/components/app-shell/app-shell.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const NAV_ITEMS = [
  { href: "/", label: "Tareas" },
  { href: "/projects", label: "Proyectos" },
  { href: "/history", label: "Historial de Registros" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      <aside className="w-[280px] shrink-0 border-r border-outline-variant bg-surface p-6">
        <p className="text-headline-md font-semibold text-on-surface">
          TimeTracker
        </p>
        <nav aria-label="Navegación principal" className="mt-8">
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`block rounded px-3 py-2 text-body-lg ${
                      isActive
                        ? "bg-surface-container font-semibold text-on-surface"
                        : "text-on-surface-variant hover:bg-surface-container-low"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/components/app-shell/app-shell.test.tsx`
Expected: PASS (3 tests)

- [ ] **Step 5: Wire fonts and AppShell into the root layout**

```tsx
// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { AppShell } from "@/components/app-shell/app-shell";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TimeTracker",
  description: "Registro de tiempo por proyecto y tarea",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div className="root flex min-h-full flex-1 flex-col">
          <AppShell>{children}</AppShell>
        </div>
      </body>
    </html>
  );
}
```

- [ ] **Step 6: Verify the full test suite and build still pass**

Run: `npm run test:run && npm run build`
Expected: all tests PASS, build succeeds.

- [ ] **Step 7: Commit**

```bash
git add src/components/app-shell/app-shell.tsx src/components/app-shell/app-shell.test.tsx src/app/layout.tsx
git commit -m "feat: add AppShell navigation and wire Precision Focus fonts"
```

---

### Task 11: New Project Modal

**Files:**

- Create: `src/features/time-tracker/components/new-project-modal/new-project-modal.tsx`
- Test: `src/features/time-tracker/components/new-project-modal/new-project-modal.test.tsx`

**Interfaces:**

- Consumes: `useTimeTrackerStore`, `initialTimeTrackerState` (Task 6-8).
- Produces: `NewProjectModal({ trigger }: { trigger: React.ReactElement })`. It's rendered twice by `ProjectsView` (Task 13): once with a plain button trigger ("Nuevo Proyecto"), once with a dashed-card trigger ("Crear Nuevo Proyecto") — each instance owns its own open/close state.

- [ ] **Step 1: Write the failing tests**

```tsx
// src/features/time-tracker/components/new-project-modal/new-project-modal.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import {
  initialTimeTrackerState,
  useTimeTrackerStore,
} from "../../store/time-tracker-store";
import { NewProjectModal } from "./new-project-modal";

beforeEach(() => {
  useTimeTrackerStore.setState(initialTimeTrackerState);
  localStorage.clear();
});

describe("NewProjectModal", () => {
  it("creates a project with the entered name and description", async () => {
    const user = userEvent.setup();
    render(
      <NewProjectModal
        trigger={<button type="button">Nuevo Proyecto</button>}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Nuevo Proyecto" }));
    await user.type(screen.getByLabelText("Nombre del Proyecto"), "Rebranding");
    await user.type(
      screen.getByLabelText("Descripción"),
      "Nueva identidad visual",
    );
    await user.click(screen.getByRole("button", { name: "Crear Proyecto" }));

    const projects = Object.values(useTimeTrackerStore.getState().projects);
    expect(projects).toHaveLength(1);
    expect(projects[0]).toMatchObject({
      name: "Rebranding",
      description: "Nueva identidad visual",
    });
  });

  it("shows a validation error when the name is empty", async () => {
    const user = userEvent.setup();
    render(
      <NewProjectModal
        trigger={<button type="button">Nuevo Proyecto</button>}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Nuevo Proyecto" }));
    await user.click(screen.getByRole("button", { name: "Crear Proyecto" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "El nombre del proyecto es obligatorio.",
    );
    expect(Object.values(useTimeTrackerStore.getState().projects)).toHaveLength(
      0,
    );
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/features/time-tracker/components/new-project-modal/new-project-modal.test.tsx`
Expected: FAIL with "Cannot find module './new-project-modal'"

- [ ] **Step 3: Implement the modal**

```tsx
// src/features/time-tracker/components/new-project-modal/new-project-modal.tsx
"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Field } from "@base-ui/react/field";
import { type FormEvent, type ReactElement, useState } from "react";
import { useTimeTrackerStore } from "../../store/time-tracker-store";

export function NewProjectModal({ trigger }: { trigger: ReactElement }) {
  const createProject = useTimeTrackerStore((state) => state.createProject);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      createProject({ name, description: description || undefined });
      setName("");
      setDescription("");
      setError(null);
      setOpen(false);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "No se pudo crear el proyecto.",
      );
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger render={trigger} />
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-sm" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-surface-container-lowest p-8 shadow-lg">
          <Dialog.Title className="text-headline-md font-semibold text-on-surface">
            Nuevo Proyecto
          </Dialog.Title>
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <Field.Root className="flex flex-col gap-2">
              <Field.Label className="text-label-mono uppercase text-on-surface-variant">
                Nombre del Proyecto
              </Field.Label>
              <Field.Control
                required
                value={name}
                onValueChange={setName}
                placeholder="ej. Estrategia de Marketing Q4"
                className="rounded border border-outline-variant px-3 py-2"
              />
            </Field.Root>
            <Field.Root className="flex flex-col gap-2">
              <Field.Label className="text-label-mono uppercase text-on-surface-variant">
                Descripción
              </Field.Label>
              <Field.Control
                render={<textarea />}
                value={description}
                onValueChange={setDescription}
                placeholder="Define los objetivos primarios..."
                className="rounded border border-outline-variant px-3 py-2"
              />
            </Field.Root>
            {error ? (
              <p role="alert" className="text-body-md text-error">
                {error}
              </p>
            ) : null}
            <div className="mt-2 flex justify-end gap-3">
              <Dialog.Close className="rounded border border-outline px-4 py-2 text-body-lg">
                Cancelar
              </Dialog.Close>
              <button
                type="submit"
                className="rounded bg-primary px-4 py-2 text-body-lg text-on-primary"
              >
                Crear Proyecto
              </button>
            </div>
          </form>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/features/time-tracker/components/new-project-modal/new-project-modal.test.tsx`
Expected: PASS (2 tests). If `Field.Control`'s `render={<textarea />}` prop doesn't type-check, run `npm run build` to see the exact TypeScript error and adjust the prop name to match the installed `@base-ui/react` version's `FieldControlProps`.

- [ ] **Step 5: Commit**

```bash
git add src/features/time-tracker/components/new-project-modal
git commit -m "feat: add New Project modal"
```

---

### Task 12: Project List

**Files:**

- Create: `src/features/time-tracker/components/project-list/project-list.tsx`
- Test: `src/features/time-tracker/components/project-list/project-list.test.tsx`

**Interfaces:**

- Consumes: `useTimeTrackerStore`, `initialTimeTrackerState` (Task 6-8), `getProjectTotalSeconds` (Task 9), `formatDurationShort` (Task 3), `aProject`/`aTask`/`aTimeEntry` (Task 5).
- Produces: `ProjectList()` — a fragment of `<article>` project cards, composed into the grid by `ProjectsView` (Task 13).

- [ ] **Step 1: Write the failing tests**

```tsx
// src/features/time-tracker/components/project-list/project-list.test.tsx
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { aProject, aTask, aTimeEntry } from "../../testing/object-mothers";
import {
  initialTimeTrackerState,
  useTimeTrackerStore,
} from "../../store/time-tracker-store";
import { ProjectList } from "./project-list";

beforeEach(() => {
  useTimeTrackerStore.setState(initialTimeTrackerState);
  localStorage.clear();
});

describe("ProjectList", () => {
  it("renders each project with its name, description and total time", () => {
    const project = aProject({
      id: "project-1",
      name: "Identidad de Marca Global",
      description: "Rebranding",
    });
    const task = aTask({ id: "task-1", projectId: "project-1" });
    const entry = aTimeEntry({
      id: "entry-1",
      taskId: "task-1",
      durationSeconds: 46800,
    });

    useTimeTrackerStore.setState({
      projects: { [project.id]: project },
      tasks: { [task.id]: task },
      timeEntries: { [entry.id]: entry },
    });

    render(<ProjectList />);

    expect(screen.getByText("Identidad de Marca Global")).toBeInTheDocument();
    expect(screen.getByText("Rebranding")).toBeInTheDocument();
    expect(screen.getByText("13h 00m")).toBeInTheDocument();
  });

  it("renders nothing when there are no projects", () => {
    render(<ProjectList />);
    expect(screen.queryByRole("article")).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/features/time-tracker/components/project-list/project-list.test.tsx`
Expected: FAIL with "Cannot find module './project-list'"

- [ ] **Step 3: Implement ProjectList**

```tsx
// src/features/time-tracker/components/project-list/project-list.tsx
"use client";

import { formatDurationShort } from "../../lib/duration";
import { getProjectTotalSeconds } from "../../lib/selectors";
import { useTimeTrackerStore } from "../../store/time-tracker-store";

export function ProjectList() {
  const projects = useTimeTrackerStore((state) => state.projects);
  const tasks = useTimeTrackerStore((state) => state.tasks);
  const timeEntries = useTimeTrackerStore((state) => state.timeEntries);

  return (
    <>
      {Object.values(projects).map((project) => (
        <article
          key={project.id}
          className="rounded-lg border border-outline-variant bg-surface-container-lowest p-6"
        >
          <h3 className="text-body-lg font-semibold text-on-surface">
            {project.name}
          </h3>
          {project.description ? (
            <p className="mt-2 text-body-md text-on-surface-variant">
              {project.description}
            </p>
          ) : null}
          <p className="mt-4 text-label-mono uppercase text-on-surface-variant">
            Tiempo Registrado
          </p>
          <p className="font-mono text-headline-md text-on-surface">
            {formatDurationShort(
              getProjectTotalSeconds(timeEntries, tasks, project.id),
            )}
          </p>
        </article>
      ))}
    </>
  );
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/features/time-tracker/components/project-list/project-list.test.tsx`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add src/features/time-tracker/components/project-list
git commit -m "feat: add Project List component"
```

---

### Task 13: Projects page composition

**Files:**

- Create: `src/features/time-tracker/components/projects-view.tsx`
- Test: `src/features/time-tracker/components/projects-view.test.tsx`
- Create: `src/app/projects/page.tsx`

**Interfaces:**

- Consumes: `NewProjectModal` (Task 11), `ProjectList` (Task 12).
- Produces: `ProjectsView()`, rendered at route `/projects`.

- [ ] **Step 1: Write the failing test**

```tsx
// src/features/time-tracker/components/projects-view.test.tsx
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import {
  initialTimeTrackerState,
  useTimeTrackerStore,
} from "../store/time-tracker-store";
import { ProjectsView } from "./projects-view";

beforeEach(() => {
  useTimeTrackerStore.setState(initialTimeTrackerState);
  localStorage.clear();
});

describe("ProjectsView", () => {
  it("renders the heading and both project-creation entry points", () => {
    render(<ProjectsView />);

    expect(
      screen.getByRole("heading", { name: "Proyectos" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Nuevo Proyecto" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Crear Nuevo Proyecto" }),
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/features/time-tracker/components/projects-view.test.tsx`
Expected: FAIL with "Cannot find module './projects-view'"

- [ ] **Step 3: Implement ProjectsView**

```tsx
// src/features/time-tracker/components/projects-view.tsx
"use client";

import { NewProjectModal } from "./new-project-modal/new-project-modal";
import { ProjectList } from "./project-list/project-list";

export function ProjectsView() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-headline-lg font-semibold text-on-surface">
          Proyectos
        </h1>
        <NewProjectModal
          trigger={
            <button
              type="button"
              className="rounded border border-outline px-4 py-2 text-body-lg font-semibold"
            >
              Nuevo Proyecto
            </button>
          }
        />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <ProjectList />
        <NewProjectModal
          trigger={
            <button
              type="button"
              className="flex min-h-[200px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-outline text-body-lg font-semibold text-on-surface"
            >
              <span aria-hidden="true" className="text-headline-lg">
                +
              </span>
              Crear Nuevo Proyecto
            </button>
          }
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/features/time-tracker/components/projects-view.test.tsx`
Expected: PASS (1 test)

- [ ] **Step 5: Add the route**

```tsx
// src/app/projects/page.tsx
import { ProjectsView } from "@/features/time-tracker/components/projects-view";

export default function ProjectsPage() {
  return <ProjectsView />;
}
```

- [ ] **Step 6: Commit**

```bash
git add src/features/time-tracker/components/projects-view.tsx src/features/time-tracker/components/projects-view.test.tsx src/app/projects/page.tsx
git commit -m "feat: compose Proyectos page"
```

---

### Task 14: New Task Modal

**Files:**

- Create: `src/features/time-tracker/components/new-task-modal/new-task-modal.tsx`
- Test: `src/features/time-tracker/components/new-task-modal/new-task-modal.test.tsx`

**Interfaces:**

- Consumes: `useTimeTrackerStore`, `initialTimeTrackerState` (Task 6-8), `aProject` (Task 5).
- Produces: `NewTaskModal()`, rendered once by `TasksView` (Task 17).

- [ ] **Step 1: Write the failing tests**

```tsx
// src/features/time-tracker/components/new-task-modal/new-task-modal.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { aProject } from "../../testing/object-mothers";
import {
  initialTimeTrackerState,
  useTimeTrackerStore,
} from "../../store/time-tracker-store";
import { NewTaskModal } from "./new-task-modal";

beforeEach(() => {
  useTimeTrackerStore.setState(initialTimeTrackerState);
  localStorage.clear();
  const project = aProject({ id: "project-1", name: "Rediseño" });
  useTimeTrackerStore.setState({ projects: { [project.id]: project } });
});

describe("NewTaskModal", () => {
  it("creates a task linked to the selected project", async () => {
    const user = userEvent.setup();
    render(<NewTaskModal />);

    await user.click(screen.getByRole("button", { name: "Nueva Tarea" }));
    await user.selectOptions(screen.getByLabelText("Proyecto"), "project-1");
    await user.type(screen.getByLabelText("Nombre"), "Wireframes");
    await user.click(screen.getByRole("button", { name: "Crear Tarea" }));

    const tasks = Object.values(useTimeTrackerStore.getState().tasks);
    expect(tasks).toHaveLength(1);
    expect(tasks[0]).toMatchObject({
      projectId: "project-1",
      name: "Wireframes",
    });
  });

  it("shows a validation error when no project is selected", async () => {
    const user = userEvent.setup();
    render(<NewTaskModal />);

    await user.click(screen.getByRole("button", { name: "Nueva Tarea" }));
    await user.type(screen.getByLabelText("Nombre"), "Wireframes");
    await user.click(screen.getByRole("button", { name: "Crear Tarea" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Selecciona un proyecto.",
    );
    expect(Object.values(useTimeTrackerStore.getState().tasks)).toHaveLength(0);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/features/time-tracker/components/new-task-modal/new-task-modal.test.tsx`
Expected: FAIL with "Cannot find module './new-task-modal'"

- [ ] **Step 3: Implement the modal**

```tsx
// src/features/time-tracker/components/new-task-modal/new-task-modal.tsx
"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Field } from "@base-ui/react/field";
import { type FormEvent, useState } from "react";
import { useTimeTrackerStore } from "../../store/time-tracker-store";

export function NewTaskModal() {
  const projects = useTimeTrackerStore((state) => state.projects);
  const createTask = useTimeTrackerStore((state) => state.createTask);
  const [open, setOpen] = useState(false);
  const [projectId, setProjectId] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const projectOptions = Object.values(projects);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!projectId) {
      setError("Selecciona un proyecto.");
      return;
    }
    try {
      createTask({ projectId, name });
      setName("");
      setProjectId("");
      setError(null);
      setOpen(false);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "No se pudo crear la tarea.",
      );
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="rounded bg-primary px-4 py-2 text-body-lg text-on-primary">
        Nueva Tarea
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-sm" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-surface-container-lowest p-8 shadow-lg">
          <Dialog.Title className="text-headline-md font-semibold text-on-surface">
            Nueva Tarea
          </Dialog.Title>
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <Field.Root className="flex flex-col gap-2">
              <Field.Label className="text-label-mono uppercase text-on-surface-variant">
                Proyecto
              </Field.Label>
              <Field.Control
                render={<select />}
                value={projectId}
                onValueChange={setProjectId}
                disabled={projectOptions.length === 0}
                className="rounded border border-outline-variant px-3 py-2"
              >
                <option value="">Selecciona un proyecto</option>
                {projectOptions.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </Field.Control>
            </Field.Root>
            <Field.Root className="flex flex-col gap-2">
              <Field.Label className="text-label-mono uppercase text-on-surface-variant">
                Nombre
              </Field.Label>
              <Field.Control
                value={name}
                onValueChange={setName}
                placeholder="¿En qué estás trabajando?"
                className="rounded border border-outline-variant px-3 py-2"
              />
            </Field.Root>
            {error ? (
              <p role="alert" className="text-body-md text-error">
                {error}
              </p>
            ) : null}
            <div className="mt-2 flex justify-end gap-3">
              <Dialog.Close className="rounded border border-outline px-4 py-2 text-body-lg">
                Cancelar
              </Dialog.Close>
              <button
                type="submit"
                className="rounded bg-primary px-4 py-2 text-body-lg text-on-primary"
              >
                Crear Tarea
              </button>
            </div>
          </form>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/features/time-tracker/components/new-task-modal/new-task-modal.test.tsx`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add src/features/time-tracker/components/new-task-modal
git commit -m "feat: add New Task modal"
```

---

### Task 15: Timer Panel

**Files:**

- Create: `src/features/time-tracker/components/timer-panel/timer-panel.tsx`
- Test: `src/features/time-tracker/components/timer-panel/timer-panel.test.tsx`

**Interfaces:**

- Consumes: `useTimeTrackerStore`, `initialTimeTrackerState` (Task 6-8), `formatDurationClock` (Task 3), `aProject`/`aTask` (Task 5).
- Produces: `TimerPanel()`, rendered by `TasksView` (Task 17).

- [ ] **Step 1: Write the failing tests**

```tsx
// src/features/time-tracker/components/timer-panel/timer-panel.test.tsx
import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { aProject, aTask } from "../../testing/object-mothers";
import {
  initialTimeTrackerState,
  useTimeTrackerStore,
} from "../../store/time-tracker-store";
import { TimerPanel } from "./timer-panel";

beforeEach(() => {
  useTimeTrackerStore.setState(initialTimeTrackerState);
  localStorage.clear();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("TimerPanel", () => {
  it("shows the empty state when there is no active timer", () => {
    render(<TimerPanel />);
    expect(
      screen.getByText(
        "Ningún temporizador activo. Inicia uno desde una tarea.",
      ),
    ).toBeInTheDocument();
  });

  it("shows the running task and ticks the elapsed time every second", () => {
    vi.useFakeTimers();
    const startedAt = new Date("2026-07-02T09:00:00.000Z");
    vi.setSystemTime(startedAt);

    const project = aProject({ id: "project-1", name: "Rediseño" });
    const task = aTask({
      id: "task-1",
      projectId: "project-1",
      name: "Wireframes",
    });
    useTimeTrackerStore.setState({
      projects: { [project.id]: project },
      tasks: { [task.id]: task },
      activeTimer: { taskId: task.id, startedAt: startedAt.toISOString() },
    });

    render(<TimerPanel />);
    expect(screen.getByText("Wireframes")).toBeInTheDocument();
    expect(screen.getByText("00:00:00")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.getByText("00:00:03")).toBeInTheDocument();
  });

  it("stops the timer and clears the active state when the button is clicked", async () => {
    const startedAt = new Date("2026-07-02T09:00:00.000Z");
    const project = aProject({ id: "project-1" });
    const task = aTask({ id: "task-1", projectId: "project-1" });
    useTimeTrackerStore.setState({
      projects: { [project.id]: project },
      tasks: { [task.id]: task },
      activeTimer: { taskId: task.id, startedAt: startedAt.toISOString() },
    });

    render(<TimerPanel />);
    screen.getByRole("button", { name: "Detener Sesión" }).click();

    expect(useTimeTrackerStore.getState().activeTimer).toBeNull();
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/features/time-tracker/components/timer-panel/timer-panel.test.tsx`
Expected: FAIL with "Cannot find module './timer-panel'"

- [ ] **Step 3: Implement TimerPanel**

```tsx
// src/features/time-tracker/components/timer-panel/timer-panel.tsx
"use client";

import { useEffect, useState } from "react";
import { formatDurationClock } from "../../lib/duration";
import { useTimeTrackerStore } from "../../store/time-tracker-store";

export function TimerPanel() {
  const activeTimer = useTimeTrackerStore((state) => state.activeTimer);
  const tasks = useTimeTrackerStore((state) => state.tasks);
  const projects = useTimeTrackerStore((state) => state.projects);
  const stopTimer = useTimeTrackerStore((state) => state.stopTimer);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (!activeTimer) {
      return;
    }
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, [activeTimer]);

  if (!activeTimer) {
    return (
      <section
        aria-label="Temporizador"
        className="rounded-lg border border-outline-variant bg-surface-container-lowest p-8 text-center"
      >
        <p className="text-body-lg text-on-surface-variant">
          Ningún temporizador activo. Inicia uno desde una tarea.
        </p>
      </section>
    );
  }

  const task = tasks[activeTimer.taskId];
  const project = task ? projects[task.projectId] : undefined;
  const elapsedSeconds = Math.floor(
    (now.getTime() - new Date(activeTimer.startedAt).getTime()) / 1000,
  );

  return (
    <section
      aria-label="Temporizador"
      className="rounded-lg border border-outline-variant bg-surface-container-lowest p-8 text-center"
    >
      {project ? (
        <p className="text-label-mono uppercase text-on-surface-variant">
          {project.name}
        </p>
      ) : null}
      <p className="text-headline-md font-semibold text-on-surface">
        {task?.name ?? "Tarea"}
      </p>
      <p className="text-body-md text-on-surface-variant">
        Iniciado a las {new Date(activeTimer.startedAt).toLocaleTimeString()}
      </p>
      <p className="font-mono text-display-time text-on-surface">
        {formatDurationClock(elapsedSeconds)}
      </p>
      <button
        type="button"
        onClick={() => stopTimer()}
        className="rounded bg-primary px-6 py-3 text-body-lg text-on-primary"
      >
        Detener Sesión
      </button>
    </section>
  );
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/features/time-tracker/components/timer-panel/timer-panel.test.tsx`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/features/time-tracker/components/timer-panel
git commit -m "feat: add Timer Panel with live elapsed time"
```

---

### Task 16: Manual Entry Form

**Files:**

- Create: `src/features/time-tracker/components/manual-entry-form/manual-entry-form.tsx`
- Test: `src/features/time-tracker/components/manual-entry-form/manual-entry-form.test.tsx`

**Interfaces:**

- Consumes: `useTimeTrackerStore`, `initialTimeTrackerState` (Task 6-8), `parseManualDuration` (Task 3), `aProject`/`aTask` (Task 5).
- Produces: `ManualEntryForm()`, rendered by `TasksView` (Task 17).

- [ ] **Step 1: Write the failing tests**

```tsx
// src/features/time-tracker/components/manual-entry-form/manual-entry-form.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { aProject, aTask } from "../../testing/object-mothers";
import {
  initialTimeTrackerState,
  useTimeTrackerStore,
} from "../../store/time-tracker-store";
import { ManualEntryForm } from "./manual-entry-form";

beforeEach(() => {
  useTimeTrackerStore.setState(initialTimeTrackerState);
  localStorage.clear();
  const project = aProject({ id: "project-1", name: "Rediseño" });
  const task = aTask({
    id: "task-1",
    projectId: "project-1",
    name: "Wireframes",
  });
  useTimeTrackerStore.setState({
    projects: { [project.id]: project },
    tasks: { [task.id]: task },
  });
});

describe("ManualEntryForm", () => {
  it("saves a manual entry with the selected task and entered duration", async () => {
    const user = userEvent.setup();
    render(<ManualEntryForm />);

    await user.selectOptions(
      screen.getByLabelText("Proyecto / Tarea"),
      "task-1",
    );
    await user.type(screen.getByLabelText("Duración"), "02:30");
    await user.click(screen.getByRole("button", { name: "Guardar Registro" }));

    const entries = Object.values(useTimeTrackerStore.getState().timeEntries);
    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({
      taskId: "task-1",
      durationSeconds: 9000,
      source: "manual",
    });
  });

  it("shows a validation error for an invalid duration", async () => {
    const user = userEvent.setup();
    render(<ManualEntryForm />);

    await user.selectOptions(
      screen.getByLabelText("Proyecto / Tarea"),
      "task-1",
    );
    await user.type(screen.getByLabelText("Duración"), "abc");
    await user.click(screen.getByRole("button", { name: "Guardar Registro" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Ingresa una duración válida en formato HH:MM.",
    );
    expect(
      Object.values(useTimeTrackerStore.getState().timeEntries),
    ).toHaveLength(0);
  });

  it("shows a validation error when no task is selected", async () => {
    const user = userEvent.setup();
    render(<ManualEntryForm />);

    await user.type(screen.getByLabelText("Duración"), "02:30");
    await user.click(screen.getByRole("button", { name: "Guardar Registro" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Selecciona una tarea.",
    );
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/features/time-tracker/components/manual-entry-form/manual-entry-form.test.tsx`
Expected: FAIL with "Cannot find module './manual-entry-form'"

- [ ] **Step 3: Implement ManualEntryForm**

```tsx
// src/features/time-tracker/components/manual-entry-form/manual-entry-form.tsx
"use client";

import { Field } from "@base-ui/react/field";
import { type FormEvent, useState } from "react";
import { parseManualDuration } from "../../lib/duration";
import { useTimeTrackerStore } from "../../store/time-tracker-store";

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export function ManualEntryForm() {
  const tasks = useTimeTrackerStore((state) => state.tasks);
  const projects = useTimeTrackerStore((state) => state.projects);
  const addManualEntry = useTimeTrackerStore((state) => state.addManualEntry);

  const [taskId, setTaskId] = useState("");
  const [date, setDate] = useState(todayIsoDate);
  const [duration, setDuration] = useState("");
  const [error, setError] = useState<string | null>(null);

  const taskOptions = Object.values(tasks).map((task) => ({
    id: task.id,
    label: `${projects[task.projectId]?.name ?? "Proyecto"} / ${task.name}`,
  }));

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!taskId) {
      setError("Selecciona una tarea.");
      return;
    }
    const durationSeconds = parseManualDuration(duration);
    if (durationSeconds === null) {
      setError("Ingresa una duración válida en formato HH:MM.");
      return;
    }
    try {
      addManualEntry({ taskId, date, durationSeconds });
      setDuration("");
      setError(null);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "No se pudo guardar el registro.",
      );
    }
  }

  return (
    <section
      aria-label="Entrada Manual"
      className="rounded-lg border border-outline-variant bg-surface-container-lowest p-6"
    >
      <h2 className="text-headline-md font-semibold text-on-surface">
        Entrada Manual
      </h2>
      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
        <Field.Root className="flex flex-col gap-2">
          <Field.Label className="text-label-mono uppercase text-on-surface-variant">
            Fecha
          </Field.Label>
          <Field.Control
            type="date"
            value={date}
            onValueChange={setDate}
            className="rounded border border-outline-variant px-3 py-2"
          />
        </Field.Root>
        <Field.Root className="flex flex-col gap-2">
          <Field.Label className="text-label-mono uppercase text-on-surface-variant">
            Proyecto / Tarea
          </Field.Label>
          <Field.Control
            render={<select />}
            value={taskId}
            onValueChange={setTaskId}
            className="rounded border border-outline-variant px-3 py-2"
          >
            <option value="">Selecciona un proyecto/tarea</option>
            {taskOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </Field.Control>
        </Field.Root>
        <Field.Root className="flex flex-col gap-2">
          <Field.Label className="text-label-mono uppercase text-on-surface-variant">
            Duración
          </Field.Label>
          <Field.Control
            value={duration}
            onValueChange={setDuration}
            placeholder="02:30"
            className="rounded border border-outline-variant px-3 py-2 font-mono"
          />
        </Field.Root>
        {error ? (
          <p role="alert" className="text-body-md text-error">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          className="rounded bg-primary px-4 py-2 text-body-lg text-on-primary"
        >
          Guardar Registro
        </button>
      </form>
    </section>
  );
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/features/time-tracker/components/manual-entry-form/manual-entry-form.test.tsx`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/features/time-tracker/components/manual-entry-form
git commit -m "feat: add Manual Entry form"
```

---

### Task 17: Recent Entries List and Tareas page composition

**Files:**

- Create: `src/features/time-tracker/components/recent-entries-list/recent-entries-list.tsx`
- Test: `src/features/time-tracker/components/recent-entries-list/recent-entries-list.test.tsx`
- Create: `src/features/time-tracker/components/tasks-view.tsx`
- Test: `src/features/time-tracker/components/tasks-view.test.tsx`
- Create: `src/app/page.tsx`

**Interfaces:**

- Consumes: `getRecentEntries` (Task 9), `formatDurationClock` (Task 3), `formatRelativeTime` (Task 3), `useTimeTrackerStore`/`initialTimeTrackerState` (Task 6-8), `aProject`/`aTask`/`aTimeEntry` (Task 5), `NewTaskModal` (Task 14), `TimerPanel` (Task 15), `ManualEntryForm` (Task 16).
- Produces: `RecentEntriesList()`, `TasksView()`, rendered at route `/`.

- [ ] **Step 1: Write the failing tests for RecentEntriesList**

```tsx
// src/features/time-tracker/components/recent-entries-list/recent-entries-list.test.tsx
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { aProject, aTask, aTimeEntry } from "../../testing/object-mothers";
import {
  initialTimeTrackerState,
  useTimeTrackerStore,
} from "../../store/time-tracker-store";
import { RecentEntriesList } from "./recent-entries-list";

beforeEach(() => {
  useTimeTrackerStore.setState(initialTimeTrackerState);
  localStorage.clear();
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-07-02T12:00:00.000Z"));
});

describe("RecentEntriesList", () => {
  it("shows the empty state when there are no entries", () => {
    render(<RecentEntriesList />);
    expect(
      screen.getByText("Aún no hay registros de tiempo."),
    ).toBeInTheDocument();
  });

  it("lists the most recent entries with task, project, duration and relative time", () => {
    const project = aProject({ id: "project-1", name: "Rediseño" });
    const task = aTask({
      id: "task-1",
      projectId: "project-1",
      name: "Wireframes",
    });
    const entry = aTimeEntry({
      id: "entry-1",
      taskId: "task-1",
      durationSeconds: 3600,
      createdAt: "2026-07-02T10:00:00.000Z",
    });

    useTimeTrackerStore.setState({
      projects: { [project.id]: project },
      tasks: { [task.id]: task },
      timeEntries: { [entry.id]: entry },
    });

    render(<RecentEntriesList />);

    expect(screen.getByText("Wireframes")).toBeInTheDocument();
    expect(screen.getByText("Rediseño")).toBeInTheDocument();
    expect(screen.getByText("01:00:00")).toBeInTheDocument();
    expect(screen.getByText("hace 2h")).toBeInTheDocument();
  });

  it("starts a timer for the entry's task when its play button is clicked", () => {
    const project = aProject({ id: "project-1" });
    const task = aTask({
      id: "task-1",
      projectId: "project-1",
      name: "Wireframes",
    });
    const entry = aTimeEntry({ id: "entry-1", taskId: "task-1" });

    useTimeTrackerStore.setState({
      projects: { [project.id]: project },
      tasks: { [task.id]: task },
      timeEntries: { [entry.id]: entry },
    });

    render(<RecentEntriesList />);
    screen
      .getByRole("button", { name: "Iniciar temporizador para Wireframes" })
      .click();

    expect(useTimeTrackerStore.getState().activeTimer?.taskId).toBe("task-1");
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/features/time-tracker/components/recent-entries-list/recent-entries-list.test.tsx`
Expected: FAIL with "Cannot find module './recent-entries-list'"

- [ ] **Step 3: Implement RecentEntriesList**

```tsx
// src/features/time-tracker/components/recent-entries-list/recent-entries-list.tsx
"use client";

import { formatDurationClock } from "../../lib/duration";
import { formatRelativeTime } from "../../lib/relative-time";
import { getRecentEntries } from "../../lib/selectors";
import { useTimeTrackerStore } from "../../store/time-tracker-store";

const RECENT_ENTRIES_LIMIT = 5;

export function RecentEntriesList() {
  const timeEntries = useTimeTrackerStore((state) => state.timeEntries);
  const tasks = useTimeTrackerStore((state) => state.tasks);
  const projects = useTimeTrackerStore((state) => state.projects);
  const startTimer = useTimeTrackerStore((state) => state.startTimer);
  const now = new Date();

  const recentEntries = getRecentEntries(timeEntries, RECENT_ENTRIES_LIMIT);

  return (
    <section
      aria-label="Tareas Recientes"
      className="rounded-lg border border-outline-variant p-6"
    >
      <h2 className="text-headline-md font-semibold text-on-surface">
        Tareas Recientes
      </h2>
      {recentEntries.length === 0 ? (
        <p className="mt-4 text-body-lg text-on-surface-variant">
          Aún no hay registros de tiempo.
        </p>
      ) : (
        <ul className="mt-4 flex flex-col divide-y divide-outline-variant">
          {recentEntries.map((entry) => {
            const task = tasks[entry.taskId];
            const project = task ? projects[task.projectId] : undefined;
            return (
              <li
                key={entry.id}
                className="flex items-center justify-between py-3"
              >
                <div>
                  <p className="text-body-lg text-on-surface">
                    {task?.name ?? "Tarea eliminada"}
                  </p>
                  <p className="text-body-md text-on-surface-variant">
                    {project?.name ?? ""}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-mono text-body-md text-on-surface">
                      {formatDurationClock(entry.durationSeconds)}
                    </p>
                    <p className="text-body-md text-on-surface-variant">
                      {formatRelativeTime(entry.createdAt, now)}
                    </p>
                  </div>
                  {task ? (
                    <button
                      type="button"
                      aria-label={`Iniciar temporizador para ${task.name}`}
                      onClick={() => startTimer(task.id)}
                      className="rounded-full border border-outline p-2"
                    >
                      ▷
                    </button>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/features/time-tracker/components/recent-entries-list/recent-entries-list.test.tsx`
Expected: PASS (3 tests)

- [ ] **Step 5: Write the failing test for TasksView**

```tsx
// src/features/time-tracker/components/tasks-view.test.tsx
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import {
  initialTimeTrackerState,
  useTimeTrackerStore,
} from "../store/time-tracker-store";
import { TasksView } from "./tasks-view";

beforeEach(() => {
  useTimeTrackerStore.setState(initialTimeTrackerState);
  localStorage.clear();
});

describe("TasksView", () => {
  it("renders the heading, timer panel, manual entry form and recent entries", () => {
    render(<TasksView />);

    expect(screen.getByRole("heading", { name: "Tareas" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Nueva Tarea" }),
    ).toBeInTheDocument();
    // A <section aria-label="..."> exposes an accessible "region" landmark with that name.
    expect(
      screen.getByRole("region", { name: "Temporizador" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: "Entrada Manual" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: "Tareas Recientes" }),
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Run the test to verify it fails**

Run: `npx vitest run src/features/time-tracker/components/tasks-view.test.tsx`
Expected: FAIL with "Cannot find module './tasks-view'"

- [ ] **Step 7: Implement TasksView**

```tsx
// src/features/time-tracker/components/tasks-view.tsx
"use client";

import { ManualEntryForm } from "./manual-entry-form/manual-entry-form";
import { NewTaskModal } from "./new-task-modal/new-task-modal";
import { RecentEntriesList } from "./recent-entries-list/recent-entries-list";
import { TimerPanel } from "./timer-panel/timer-panel";

export function TasksView() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-headline-lg font-semibold text-on-surface">
          Tareas
        </h1>
        <NewTaskModal />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <TimerPanel />
        <ManualEntryForm />
      </div>
      <RecentEntriesList />
    </div>
  );
}
```

- [ ] **Step 8: Run the test to verify it passes**

Run: `npx vitest run src/features/time-tracker/components/tasks-view.test.tsx`
Expected: PASS (1 test)

- [ ] **Step 9: Add the route**

```tsx
// src/app/page.tsx
import { TasksView } from "@/features/time-tracker/components/tasks-view";

export default function Home() {
  return <TasksView />;
}
```

- [ ] **Step 10: Commit**

```bash
git add src/features/time-tracker/components/recent-entries-list src/features/time-tracker/components/tasks-view.tsx src/features/time-tracker/components/tasks-view.test.tsx src/app/page.tsx
git commit -m "feat: compose Tareas page"
```

---

### Task 18: History View and Historial page

**Files:**

- Create: `src/features/time-tracker/components/history-view/history-view.tsx`
- Test: `src/features/time-tracker/components/history-view/history-view.test.tsx`
- Create: `src/app/history/page.tsx`

**Interfaces:**

- Consumes: `getCurrentPeriod`/`formatPeriodLabel`/`shiftPeriod`/`Period` (Task 4), `getEntriesForPeriod`/`getProjectTotalsForPeriod` (Task 9), `formatDurationClock`/`formatDurationShort` (Task 3), `useTimeTrackerStore`/`initialTimeTrackerState` (Task 6-8), `aProject`/`aTask`/`aTimeEntry` (Task 5).
- Produces: `HistoryView({ initialPeriod }?: { initialPeriod?: Period })`, rendered at route `/history`.

- [ ] **Step 1: Write the failing tests**

```tsx
// src/features/time-tracker/components/history-view/history-view.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { aProject, aTask, aTimeEntry } from "../../testing/object-mothers";
import {
  initialTimeTrackerState,
  useTimeTrackerStore,
} from "../../store/time-tracker-store";
import { HistoryView } from "./history-view";

beforeEach(() => {
  useTimeTrackerStore.setState(initialTimeTrackerState);
  localStorage.clear();

  const project = aProject({ id: "project-1", name: "Rediseño" });
  const task = aTask({
    id: "task-1",
    projectId: "project-1",
    name: "Wireframes",
  });
  const octoberEntry = aTimeEntry({
    id: "entry-1",
    taskId: "task-1",
    date: "2026-10-15",
    durationSeconds: 3600,
    createdAt: "2026-10-15T10:00:00.000Z",
  });
  const novemberEntry = aTimeEntry({
    id: "entry-2",
    taskId: "task-1",
    date: "2026-11-02",
    durationSeconds: 1800,
    createdAt: "2026-11-02T10:00:00.000Z",
  });

  useTimeTrackerStore.setState({
    projects: { [project.id]: project },
    tasks: { [task.id]: task },
    timeEntries: {
      [octoberEntry.id]: octoberEntry,
      [novemberEntry.id]: novemberEntry,
    },
  });
});

describe("HistoryView", () => {
  it("shows entries and totals for the initial period", () => {
    render(<HistoryView initialPeriod={{ year: 2026, month: 10 }} />);

    expect(screen.getByText("Octubre 2026")).toBeInTheDocument();
    expect(screen.getByText("2026-10-15")).toBeInTheDocument();
    expect(screen.queryByText("2026-11-02")).not.toBeInTheDocument();
    expect(screen.getByText("1h 00m")).toBeInTheDocument();
  });

  it("navigates to the next period and shows its entries", async () => {
    const user = userEvent.setup();
    render(<HistoryView initialPeriod={{ year: 2026, month: 10 }} />);

    await user.click(screen.getByRole("button", { name: "Periodo siguiente" }));

    expect(screen.getByText("Noviembre 2026")).toBeInTheDocument();
    expect(screen.getByText("2026-11-02")).toBeInTheDocument();
  });

  it("shows an empty state when the period has no entries", async () => {
    const user = userEvent.setup();
    render(<HistoryView initialPeriod={{ year: 2026, month: 10 }} />);

    await user.click(screen.getByRole("button", { name: "Periodo siguiente" }));
    await user.click(screen.getByRole("button", { name: "Periodo siguiente" }));

    expect(
      screen.getByText("No hay registros para este periodo."),
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/features/time-tracker/components/history-view/history-view.test.tsx`
Expected: FAIL with "Cannot find module './history-view'"

- [ ] **Step 3: Implement HistoryView**

```tsx
// src/features/time-tracker/components/history-view/history-view.tsx
"use client";

import { useState } from "react";
import { formatDurationClock, formatDurationShort } from "../../lib/duration";
import {
  formatPeriodLabel,
  getCurrentPeriod,
  shiftPeriod,
  type Period,
} from "../../lib/period";
import {
  getEntriesForPeriod,
  getProjectTotalsForPeriod,
} from "../../lib/selectors";
import { useTimeTrackerStore } from "../../store/time-tracker-store";

export function HistoryView({
  initialPeriod,
}: { initialPeriod?: Period } = {}) {
  const timeEntries = useTimeTrackerStore((state) => state.timeEntries);
  const tasks = useTimeTrackerStore((state) => state.tasks);
  const projects = useTimeTrackerStore((state) => state.projects);
  const [period, setPeriod] = useState<Period>(
    () => initialPeriod ?? getCurrentPeriod(new Date()),
  );

  const entries = getEntriesForPeriod(timeEntries, period);
  const projectTotals = getProjectTotalsForPeriod(
    timeEntries,
    tasks,
    projects,
    period,
  );
  const totalSeconds = entries.reduce(
    (total, entry) => total + entry.durationSeconds,
    0,
  );
  const distinctProjectCount = new Set(
    projectTotals.map((item) => item.project.id),
  ).size;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-headline-lg font-semibold text-on-surface">
          Historial de Tiempo
        </h1>
        <div className="flex items-center gap-4 rounded-lg border border-outline-variant px-4 py-2">
          <button
            type="button"
            aria-label="Periodo anterior"
            onClick={() => setPeriod((current) => shiftPeriod(current, -1))}
          >
            {"<"}
          </button>
          <span className="text-label-mono uppercase text-on-surface-variant">
            {formatPeriodLabel(period)}
          </span>
          <button
            type="button"
            aria-label="Periodo siguiente"
            onClick={() => setPeriod((current) => shiftPeriod(current, 1))}
          >
            {">"}
          </button>
        </div>
      </div>

      {projectTotals.length === 0 ? (
        <p className="text-body-lg text-on-surface-variant">
          No hay registros para este periodo.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projectTotals.map(({ project, totalSeconds: projectSeconds }) => (
            <article
              key={project.id}
              className="rounded-lg border border-outline-variant p-6"
            >
              <p className="text-body-lg font-semibold text-on-surface">
                {project.name}
              </p>
              <p className="font-mono text-headline-md text-on-surface">
                {formatDurationShort(projectSeconds)}
              </p>
            </article>
          ))}
        </div>
      )}

      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="text-label-mono uppercase text-on-surface-variant">
              Fecha
            </th>
            <th className="text-label-mono uppercase text-on-surface-variant">
              Proyecto
            </th>
            <th className="text-label-mono uppercase text-on-surface-variant">
              Tarea
            </th>
            <th className="text-label-mono uppercase text-on-surface-variant">
              Duración
            </th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => {
            const task = tasks[entry.taskId];
            const project = task ? projects[task.projectId] : undefined;
            return (
              <tr key={entry.id} className="border-t border-outline-variant">
                <td className="py-3">{entry.date}</td>
                <td className="py-3">{project?.name ?? ""}</td>
                <td className="py-3">{task?.name ?? ""}</td>
                <td className="py-3 font-mono">
                  {formatDurationClock(entry.durationSeconds)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="flex items-center justify-between rounded-lg border border-outline-variant px-6 py-4">
        <span className="text-body-md text-on-surface-variant">
          {entries.length} registros
        </span>
        <span className="text-body-md text-on-surface-variant">
          {distinctProjectCount} proyectos
        </span>
        <span className="font-mono text-headline-md text-on-surface">
          {formatDurationClock(totalSeconds)}
        </span>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/features/time-tracker/components/history-view/history-view.test.tsx`
Expected: PASS (3 tests)

- [ ] **Step 5: Add the route**

```tsx
// src/app/history/page.tsx
import { HistoryView } from "@/features/time-tracker/components/history-view/history-view";

export default function HistoryPage() {
  return <HistoryView />;
}
```

- [ ] **Step 6: Run the full suite and build**

Run: `npm run test:run && npm run lint && npm run build`
Expected: all tests PASS, lint clean, build succeeds.

- [ ] **Step 7: Commit**

```bash
git add src/features/time-tracker/components/history-view src/app/history/page.tsx
git commit -m "feat: compose Historial page"
```
