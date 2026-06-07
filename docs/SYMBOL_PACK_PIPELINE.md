# Symbol Pack Pipeline

## Goal

Move runtime symbol loading from raw library paths to versioned publish packs.

## Current packs

- Provider: `arasaac`
- Pack: `core-200`
- Version: `v1`
- Optional pack: `starter-600` (built from mapped active vocabulary, limit 600)

## Build command

```bash
cd /Users/eric/Desktop/secondme/projects/Audrey2.0/backend
npm run build:symbol-pack:core200
npm run build:symbol-pack:starter600
```

## Outputs

- Pack files:
  - `backend/public/symbols/arasaac/v1/core-200/*.png`
- Manifests:
  - `backend/public/symbols/arasaac/manifest/core-200.v1.json`
  - `backend/public/symbols/arasaac/manifest/core-200.latest.json`
  - `backend/public/symbols/arasaac/manifest/starter-600.v1.json`
  - `backend/public/symbols/arasaac/manifest/starter-600.latest.json`

## Runtime resolution order

1. `image_url` (explicit override)
2. Pack URL (`/symbols/arasaac/<version>/<usage_pack>/<symbol_key>`) if `usage_pack` is set
3. `symbol_assets.cdn_url`
4. `symbol_assets.local_path`
5. Raw fallback (`/symbols/arasaac/raw/<symbol_key>`)

## Notes

- `build:symbol-pack:core200` updates `vocabulary_items.usage_pack='core-200'` for mapped core words.
- `build:symbol-pack:starter600` only builds files/manifests by default (does not overwrite `usage_pack`).
- You can switch version via env `SYMBOL_PACK_VERSION` (default `v1`).
- Pack list API: `GET /api/symbol-packs?provider=arasaac`
