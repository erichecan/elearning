# Core Words -> ARASAAC Symbols Plan

Date: 2026-02-16

## 1. Goal and boundary

- Core Words remains sentence-first AAC board, not a full dictionary browser.
- ARASAAC becomes the only default symbol source.
- Flashcards handles large topical vocabulary (holiday, school units, seasonal words).

## 2. Local storage strategy

Use two tiers:

- Tier A: full offline source set for tooling only
  - Path: `backend/assets/symbols/arasaac/raw/png/` (13,717 files)
  - Used by mapping scripts and manual curation tools.
- Tier B: runtime publish packs for app delivery
  - Path: `backend/public/symbols/arasaac/<pack-version>/...`
  - Only curated symbols required by app experience.

Recommended local pre-store for runtime:

- `core-36`: 36 fixed symbols (always local)
- `core-120`: sentence-building extension (always local)
- `starter-600`: high-frequency fringe vocabulary (optional local cache)

If storage/network is constrained:

- Minimum must-have local set: `core-120` + UI icons (< 30 MB at 500px PNG).

## 3. Online delivery model

Use versioned static hosting (CDN/object storage):

- Base URL example: `https://cdn.example.com/aac/symbols/arasaac/v1/`
- URL pattern: `{base}/{pack}/{filename}`
- Manifest URL: `{base}/manifest/{pack}.json`

Client load order:

1. Try local app manifest cache.
2. Try CDN URL.
3. Fallback to local bundled placeholder symbol.

Do not fetch by search at runtime. Runtime only consumes pre-reviewed manifests.

## 4. Classification model

Each word-symbol mapping should carry 3 parallel dimensions:

- Grammar role: `pronoun | verb | noun | adjective | adverb | preposition | question | social | helper`
- Semantic domain: `people | actions | food | places | school | health | feelings | play | holiday`
- Usage pack: `core-fixed | core-dynamic | flashcards | scene-overrides`

Core Words board behavior uses grammar role first, semantic domain second.

## 5. Data model changes

Add/extend DB fields:

- `vocabulary_items.symbol_provider` default `arasaac`
- `vocabulary_items.symbol_key` (filename or stable id)
- `vocabulary_items.grammar_role`
- `vocabulary_items.semantic_domain`
- `vocabulary_items.usage_pack`
- `vocabulary_items.is_core_fixed` (for motor-planning stable cells)

Add new table:

- `symbol_assets`
  - `provider`, `symbol_key`, `cdn_url`, `local_path`, `license`, `version`, `tags`, `is_active`

## 6. Mapping pipeline

Offline pipeline (scripted):

1. Normalize vocabulary text (`lemma`, lowercase, punctuation cleanup).
2. Match by exact keyword from `index/keyword_lookup.en.json`.
3. If multiple candidates, resolve by grammar role + semantic domain rules.
4. Export `packs/<pack>/manifest.json`.
5. Human review in HTML editor before publish.

Acceptance bar:

- Core-36 manual review 100%
- Core-120 manual review 100%
- Flashcards packs manual review only for newly added words

## 7. Product split: Core Words vs Flashcards

- Core Words
  - Fixed anchor cells: pronouns + high-frequency verbs + essential social words.
  - Dynamic area: nouns/adjectives/questions suggested from current sentence state.
- Flashcards
  - Thematic vocabulary expansion (Halloween, Thanksgiving, school topics).
  - Independent progression and mastery tracking.

This avoids overloading Core Words with topic-only nouns.

## 8. Implementation phases

Phase 0 (done now)

- ARASAAC assets reorganized locally.
- Metadata and lookup index prepared.

Phase 1

- DB migration for symbol fields.
- Build `symbol_assets` table + seed from ARASAAC manifest.
- Replace `image_url` direct usage with `symbol_provider + symbol_key` resolver.

Phase 2

- Build curation tool page:
  - left: word list
  - middle: candidate symbols
  - right: final selected symbol and tags
- Export `core-36` and `core-120` manifests.

Phase 3

- Frontend Core Words renders from curated manifests only.
- Add fixed-position lock policy for motor planning.
- Add dynamic suggestion policy based on grammar state.

Phase 4

- Upload publish packs to CDN.
- Enable versioned rollout (`v1`, `v1.1`) with rollback support.

## 9. Governance and operations

- Every symbol update is manifest-based and versioned.
- No direct ad-hoc image edits in DB rows.
- Keep changelog per pack:
  - added words
  - replaced symbols
  - deprecated symbols

## 10. Risks and controls

- Risk: wrong symbol for abstract verbs.
  - Control: mandatory manual review for all verbs in core packs.
- Risk: board instability harms motor memory.
  - Control: keep `is_core_fixed=true` words locked.
- Risk: CDN outage.
  - Control: ship local `core-120` pack in app bundle.
