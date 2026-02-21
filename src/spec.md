# Specification

## Summary
**Goal:** Polish the frontend UX by making empty states more actionable, improving Dashboard readability with a daily limit usage indicator, and removing dead footer links.

**Planned changes:**
- Update the Log page empty-state primary action to route to the Dashboard and auto-open the Add Entry dialog once after navigation.
- Add a clear visual daily limit usage indicator on the Dashboard (e.g., progress/meter) with an accessible, visually distinct over-limit state when today’s intake exceeds the daily limit.
- Remove or disable footer social icons/links that currently navigate to “#”, while keeping the footer layout balanced and consistent with the warm theme.

**User-visible outcome:** Users can go from an empty Log directly to adding their first entry on the Dashboard, see at-a-glance how much of their daily caffeine limit they’ve used (including a clear over-limit state), and the footer no longer contains dead social links.
