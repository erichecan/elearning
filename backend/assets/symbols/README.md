# Symbols Asset Layout

This directory stores AAC symbol assets with strict separation between raw source files, generated indexes, and publishable bundles.

## Structure

- `arasaac/raw/png/`
  - Original ARASAAC PNG files (full library).
- `arasaac/raw/meta/metadata.en.json`
  - Original metadata downloaded from ARASAAC API.
- `arasaac/index/`
  - Generated indexes for lookup and offline processing.
- `arasaac/packs/`
  - Curated packs (core-36, core-120, scenes, holiday packs).

## Rules

- Never edit files in `raw/` manually.
- Curated mappings and role classification should be generated into `packs/` or `index/`.
- Runtime app should not directly scan the full raw folder.
