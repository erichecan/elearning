# ARASAAC Symbols

Current local inventory:

- Full PNG library: `raw/png/` (13,717 files)
- Metadata: `raw/meta/metadata.en.json`
- Indexes:
  - `index/summary.json`
  - `index/categories.top200.json`
  - `index/keyword_lookup.en.json`

## Regenerate indexes

Run from project root:

```bash
python3 backend/scripts/build_arasaac_index.py
```

## Download/update full library

```bash
python3 backend/scripts/download_arasaac_symbols.py
```

By default this writes to:

- `backend/assets/symbols/arasaac/raw/png/`
- `backend/assets/symbols/arasaac/raw/meta/metadata.en.json`
