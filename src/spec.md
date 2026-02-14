# Specification

## Summary
**Goal:** Build an authenticated, per-user caffeine intake tracker with a warm coffee-themed UI, covering daily tracking, entry management, basic insights, and configurable limits/presets.

**Planned changes:**
- Create frontend pages: Dashboard (today’s total, remaining to limit, quick-add), Log (recent entries with edit/delete), Insights (7-day trend chart), Settings (daily limit + drink presets).
- Implement Motoko backend (single actor) with Internet Identity–scoped storage for entries, presets, and settings, including CRUD methods and stable persistence.
- Connect frontend to backend using React Query for all reads/mutations with loading/empty/error states and automatic UI refresh after changes.
- Apply a consistent espresso/cream visual theme with responsive, card-based layout and clear interaction states.
- Add generated static branding/empty-state images under `frontend/public/assets/generated` and use them in the header and empty-entry views.

**User-visible outcome:** Users can sign in with Internet Identity, log and manage caffeine entries, see today’s total and remaining allowance, view a simple 7-day intake chart, and adjust daily limits and drink presets; the app includes branded visuals and clear empty/loading/error states.
