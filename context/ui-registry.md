# UI Registry

Living document. Updated after every component is built. Read this before building any new component — match existing patterns exactly before inventing new ones.

---

## How to Use

Before building any component:

1. Check if a similar component already exists here
2. If yes — match its exact classes
3. If no — build it following ui-rules.md and ui-tokens.md, then add it here

After building any component — update this file with the component name, file path, and exact classes used.

---

## Components

### Logo
- **File:** `components/ui/Logo.tsx`
- **Classes:** `inline-flex items-center gap-2.5`, gradient icon `rounded-[10px] bg-gradient-to-tr from-[#5E4CFF] via-[#7C5CFC] to-[#9B82FC]`, text `text-[19px] font-bold tracking-tight text-text-primary`

### Navbar

File: `components/layout/Navbar.tsx`
Last updated: 2026-09-18

| Property         | Class |
| ---------------- | ----- |
| Background       | `bg-surface` |
| Border           | `border-b border-border` |
| Border radius    | `rounded-lg` (CTA button, sign-out button), `rounded-full` (user avatar) |
| Text — primary   | `text-text-primary` |
| Text — secondary | `text-text-secondary` |
| Spacing          | `h-16 px-6 lg:px-8`, `gap-8` (nav items), `gap-3` (auth actions) |
| Hover state      | `hover:text-text-primary` (nav links), `hover:bg-surface-secondary` (buttons) |
| Shadow           | none |
| Accent usage     | `text-accent` (active nav route), `bg-accent-muted text-accent` (avatar circle) |

**Pattern notes:**
Active nav links use `text-accent` without underlines. When authenticated, shows a `w-8 h-8 rounded-full bg-accent-muted border border-border text-accent` initial badge with sign-out action; unauthenticated visitors see `bg-text-black text-white rounded-lg` CTA button.

### Footer

File: `components/layout/Footer.tsx`
Last updated: 2026-09-17

| Property         | Class |
| ---------------- | ----- |
| Background       | `bg-surface` |
| Border           | `border-t border-border` |
| Border radius    | none |
| Text — primary   | `text-text-primary` |
| Text — secondary | `text-text-secondary` |
| Spacing          | `px-6 lg:px-8 py-8`, `gap-6` |
| Hover state      | `hover:text-text-primary` |
| Shadow           | none |
| Accent usage     | none |

### Hero

File: `components/homepage/Hero.tsx`
Last updated: 2026-09-17

| Property         | Class |
| ---------------- | ----- |
| Background       | Gradient `bg-gradient-to-b from-[#edf1ff]/80 via-[#f8f9ff]/70 to-[#eff3fb]/80`, `bg-surface` (mockup) |
| Border           | `border border-border/80` (container), `border border-border` (mockup) |
| Border radius    | `rounded-[28px]` (hero card), `rounded-2xl` (mockup) |
| Text — primary   | `text-text-primary` (h1: `text-4xl sm:text-5xl lg:text-[54px] font-bold tracking-tight`) |
| Text — secondary | `text-text-secondary` |
| Spacing          | `px-6 py-14 sm:py-20 lg:py-24` |
| Hover state      | `hover:bg-black`, `hover:bg-surface-secondary` |
| Shadow           | `shadow-sm` (container), `shadow-2xl` (mockup) |
| Accent usage     | none (subtle indigo/purple card gradient backdrop) |

### Features

File: `components/homepage/Features.tsx`
Last updated: 2026-09-17

| Property         | Class |
| ---------------- | ----- |
| Background       | `bg-surface` (section card, jobs table), `#131316` (code terminal) |
| Border           | `border border-border` (cards), `border-[#272835]` (terminal) |
| Border radius    | `rounded-3xl` (section card), `rounded-2xl` (table & terminal cards) |
| Text — primary   | `text-text-primary` |
| Text — secondary | `text-text-secondary` |
| Spacing          | `p-8 sm:p-12 lg:p-16` (container), `p-6` (inner cards) |
| Hover state      | `hover:bg-surface-secondary` (table rows) |
| Shadow           | `shadow-sm` (cards), `shadow-xl` (terminal) |
| Accent usage     | `border-accent` (active feature tab indicator) |

### Testimonial

File: `components/homepage/Testimonial.tsx`
Last updated: 2026-09-17

| Property         | Class |
| ---------------- | ----- |
| Background       | `bg-surface-secondary/40` |
| Border           | `border-y border-border` |
| Border radius    | `rounded-full` (avatar `w-11 h-11`) |
| Text — primary   | `text-text-primary` (quote: `text-xl sm:text-2xl font-medium`) |
| Text — secondary | `text-text-secondary` |
| Spacing          | `py-20 md:py-28` |
| Hover state      | none |
| Shadow           | none |
| Accent usage     | `text-accent uppercase` (section label) |

### BottomCta

File: `components/homepage/BottomCta.tsx`
Last updated: 2026-09-17

| Property         | Class |
| ---------------- | ----- |
| Background       | Gradient `bg-gradient-to-b from-[#edf1ff]/80 via-[#f8f9ff]/70 to-[#eff3fb]/80` |
| Border           | `border border-border/80` |
| Border radius    | `rounded-[28px]` |
| Text — primary   | `text-text-primary` (`text-3xl sm:text-4xl lg:text-[46px] font-bold`) |
| Text — secondary | `text-text-secondary` |
| Spacing          | `px-6 py-16 sm:py-20 lg:py-24` |
| Hover state      | `hover:bg-black`, `hover:bg-surface-secondary` |
| Shadow           | `shadow-sm` |
| Accent usage     | none |

### LoginPage

File: `app/(auth)/login/page.tsx`
Last updated: 2026-09-18

| Property         | Class |
| ---------------- | ----- |
| Background       | `bg-surface` (login card), `bg-background` (page layout) |
| Border           | `border border-border` (card and OAuth buttons) |
| Border radius    | `rounded-2xl` (card), `rounded-lg` (OAuth buttons and alert) |
| Text — primary   | `text-text-primary` (`text-2xl font-bold tracking-tight`) |
| Text — secondary | `text-text-secondary` (`text-sm`), `text-text-muted` (terms notice) |
| Spacing          | `p-8` (card padding), `px-4 py-3` (buttons), `gap-3.5` (button stack) |
| Hover state      | `hover:bg-surface-secondary hover:border-border-muted` (OAuth buttons) |
| Shadow           | `shadow-sm` (card), `shadow-xs` (OAuth buttons) |
| Accent usage     | `text-accent` (loading spinner) |

**Pattern notes:**
Auth form card is centered on `bg-background` with max width `max-w-md`. OAuth provider buttons use secondary button tokens with authentic SVG brand logos. Destructive error notifications use `bg-error/10 border border-error/30 text-error`.

### CallbackPage

File: `app/(auth)/callback/page.tsx`
Last updated: 2026-09-18

| Property         | Class |
| ---------------- | ----- |
| Background       | `bg-surface` (card), `bg-background` (page layout) |
| Border           | `border border-border` |
| Border radius    | `rounded-2xl` (card), `rounded-lg` (return button), `rounded-full` (status icon) |
| Text — primary   | `text-text-primary` (`text-lg font-semibold`) |
| Text — secondary | `text-text-secondary` (`text-sm`) |
| Spacing          | `p-8` (card padding), `px-4 py-2.5` (button), `space-y-4` |
| Hover state      | `hover:bg-accent-dark` (return CTA) |
| Shadow           | `shadow-sm` |
| Accent usage     | `text-accent` (spinner), `bg-accent text-accent-foreground` (return button) |

**Pattern notes:**
Uses the same `max-w-md` centered card layout as `LoginPage` for visual continuity during the OAuth redirect lifecycle. Errors feature a circular alert badge (`w-12 h-12 rounded-full bg-error-light/20 text-error`).



