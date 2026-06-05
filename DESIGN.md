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
