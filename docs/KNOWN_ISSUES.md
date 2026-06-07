# Known Issues

## 2026-02-16

1. `coreword-manual-mapping.html` can show blank images when backend (`127.0.0.1:3001`) is not running.
- Symptom: local HTML opens but symbols are broken.
- Root cause: image URLs depend on backend static route `/symbols/arasaac/raw/*`.
- Mitigation: restart backend before opening mapping page.
- Status: documented, reproducible.

