# Product

## Register
Product (app UI / tool)

## Purpose
Emergency response app for earthquake disaster zones. Users trapped or searching for missing family need to rapidly report missing persons and their location, or search for someone already reported. Every second counts.

## Users & Context
- **Primary:** People at the disaster site (trapped, rescuers, family searching) with phones, under stress, time-critical
- **Usage context:** Active emergency (minutes matter), crowded/chaotic physical environment, sporadic network, battery anxiety
- **Primary task:** Report person with name, age, ID, location, contact info in <2 minutes
- **Secondary task:** Search for someone by name or ID, verify they're alive
- **Critical path:** Tap → Share location → Type name/age/status → Hit send → Back to search/home

## User Goals
1. Report trapped/missing person before phone dies or network drops
2. Correct mistakes immediately if wrong info was entered
3. Find family members quickly by name or ID
4. See location on map to understand geography

## Brand Personality
Urgent, clear, trustworthy. No fluff. Designed for crisis: large text, one-tap actions, no confusion.

## Anti-references
- Slow animations or microinteractions that waste time
- Unclear buttons or vague labels ("OK" instead of "Send Report")
- Tiny touch targets
- Modals that require scrolling to find the submit button
- Color-only status differentiation (must use text + icon)
- Confusing multi-step flows that hide what's next

## Design Principles
1. **Speed first.** Every action should take ≤3 taps, ≤2 seconds. No loading screens longer than necessary.
2. **Location is sacred.** Sharing location must be the first visual action on report form; use map, not coordinates.
3. **Undo/fix is visible.** If user makes a mistake, they can see what went wrong and fix it without restarting.
4. **Mobile-first.** Designed for thumb-reach, one-handed use, edge-to-edge buttons.
5. **Accessibility by default.** High contrast, large type, generous spacing, clear labels. Crisis users are stressed; clarity saves lives.
6. **Text is big.** Minimum 16px body, 20px+ headers. No squinting.

## Accessibility
- WCAG AA (contrast ≥4.5:1 for body text)
- Touch targets ≥48px (iOS) / ≥56px (Android); buttons much larger
- Clear focus states for keyboard nav (unlikely but critical if touchscreen fails)
- No color-only information (red/green status must have text/icon)
- Reduced motion default (animations opt-in)

## Register Override
None. Product register confirmed.
