# Design

## Color Palette

### Primary
- **Red (Emergency)**: `#DC2626` (Tailwind red-600) — used for headers, CTA buttons, status indicators
- **Green (Alive)**: `#16A34A` (Tailwind green-600) — "Con vida" status
- **Red (Missing)**: `#DC2626` (Tailwind red-600) — "Desaparecido/a" status
- **Blue (Found)**: `#2563EB` (Tailwind blue-600) — "Encontrado/a" status

### Neutral
- **Text**: `#1F2937` (Tailwind gray-800) — body, high contrast
- **Text Secondary**: `#6B7280` (Tailwind gray-500) — help text, labels
- **Border**: `#D1D5DB` (Tailwind gray-300) — input borders, dividers
- **Background**: `#F9FAFB` (Tailwind gray-50) — page bg
- **Surface**: `#FFFFFF` (white) — cards, modals, input backgrounds

## Typography

### Font Stack
```
-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif
```

### Sizes & Weights (Tailwind defaults)
- **H1 (Page title)**: `text-2xl font-bold` (24px) — Emergency Venezuela header
- **H2 (Section)**: `text-xl font-bold` (20px) — "Reportar Persona", search headers
- **Body**: `text-base` (16px), `text-lg` (18px) — forms, lists
- **Labels**: `text-sm font-semibold` (14px bold) — form labels, status badges
- **Small**: `text-xs` (12px) — help text, timestamps

## Spacing

### Scale (Tailwind multiples of 0.25rem)
- Gutters: `p-4` (16px)
- Section gap: `space-y-3` to `space-y-6` (12-24px)
- Button padding: `py-3` to `py-4` (12-16px v), `px-3` to `px-4` (12-16px h)
- Touch target minimum: 48px (iOS), 56px (Android)

## Components

### Buttons
- **Primary (Report, Search)**: `bg-green-600 text-white py-4 rounded-lg font-bold` — large, thumb-reachable
- **Secondary (Update, Cancel)**: `bg-gray-400 text-white py-3 rounded-lg` — slightly smaller
- **Danger**: `bg-red-600 text-white` — edit/delete (future)

### Inputs
- **Text/Number**: `border-2 border-gray-300 rounded-lg px-3 py-2 text-base`
- **Numeric (Cedula)**: `type="tel" inputMode="numeric"` for mobile keyboard
- **Select**: Same border/padding
- **Textarea**: `h-20` minimum height for thumb-friendly text entry

### Cards
- Minimal borders: `border-2` only on search/list items
- No drop shadows (emergency context: clarity over depth)
- Rounded: `rounded-lg` (8px), never over 16px

### Modals
- Full-screen on mobile
- Backdrop: `bg-black bg-opacity-50` (semi-transparent dark)
- Close button: top-right, large tap target

## Layout

### Mobile (primary)
- Full-width stack: header → mapa (40vh min) → sidebar (scrollable)
- Header: `bg-red-600 text-white p-4`, always visible
- Mapa: responsive container, Leaflet interactive
- Sidebar: list/form content, scrolls independently

### Desktop (secondary)
- Two-column: mapa (flex-1) + sidebar (w-96)
- Header full-width above
- Footer full-width below

## Accessibility

### Contrast
- Text on red header: white on #DC2626 → 4.73:1 ✓
- Body gray on white: #1F2937 on #FFFFFF → 15.3:1 ✓
- Labels on white: #6B7280 on #FFFFFF → 5.74:1 ✓
- Placeholder: same as label contrast (16px font-size)

### Touch Targets
- All buttons: minimum 48px (iOS spec), ideally 56px (Android spec)
- Report button: `py-4` (16px v padding + line-height ~24px = 56px+)
- Input fields: `py-2` (8px) + text-base (16px) = ~32px min, pad parent container to 48px

### Motion
- Tailwind `animate-pulse` for loading
- No gratuitous animations; modals fade in/out (CSS)

## Known Issues / Next Steps
- Reformat report form as full-screen modal (priority)
- Increase touch targets on all interactive elements
- Test placeholder contrast (currently may fail 4.5:1 on some inputs)
- Add clear error states with icon + text (not color-only)
- Ensure location map in form doesn't trap user (must be scrollable, submit visible)
