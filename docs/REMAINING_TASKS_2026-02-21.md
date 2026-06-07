# Remaining Tasks (2026-02-21)

## Completed in this round

- Core words 17 manual mappings applied to DB.
- Core words mapping coverage reached 200/200.
- Fixed-long-press guard moved to Settings and persisted (`localStorage`).
- Home now renders partitioned 36 tiles (fixed + dynamic) without grid scroll.
- Backend DB pool centralized with shared singleton and error listener.
- One-command smoke test added: `npm run smoke:corewords`.

## Remaining (Priority)

1. Symbol quality review for the 17 manually mapped words.
- Goal: replace approximate icons with best AAC-friendly symbols where needed.

2. Symbol pack publishing pipeline.
- Build versioned pack manifests and CDN path strategy (`v1`, `v1.1`), then switch runtime to manifest-only loading.

3. Recommendation model hardening. ✅ (implemented)
- Replaced rule-only ordering with grammar-transition scoring + scene/task bias + 30-day acceptance-rate weighting.
- Added feedback loop endpoints:
  - `POST /api/recommendations/shown`
  - `POST /api/recommendations/accept`
  - `POST /api/recommendations/complete`
- Home screen now reports shown/accept/complete events to close the loop.

4. Backend resilience hardening. ✅ (implemented)
- Critical services now use retry/backoff wrapper (`queryWithRetry`), including:
  - `focus-data`
  - `vsd-service`
  - `word-query-service`
  - `analytics-service`
  - `home-data` / `category-service` / `vocabulary-service` / `recommendation-service`
- `/api/health/db` is online for runtime checks.

5. Regression automation expansion. ✅ (implemented)
- Smoke script extended with:
  - recommendation API + shown event checks
  - dynamic hint update check after selecting `I`
  - dynamic-zone top-6 verb density check after selecting `I`
  - settings persistence check
