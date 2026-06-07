#!/usr/bin/env python3
import json
import os
from collections import Counter

ROOT = os.path.abspath(
    os.path.join(os.path.dirname(__file__), '..', 'assets', 'symbols', 'arasaac')
)
META_PATH = os.path.join(ROOT, 'raw', 'meta', 'metadata.en.json')
PNG_DIR = os.path.join(ROOT, 'raw', 'png')
INDEX_DIR = os.path.join(ROOT, 'index')


def main() -> None:
    if not os.path.exists(META_PATH):
        raise SystemExit(f'metadata not found: {META_PATH}')
    os.makedirs(INDEX_DIR, exist_ok=True)

    with open(META_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)

    cat_counter = Counter()
    for item in data:
        for category in item.get('categories') or []:
            cat_counter[category] += 1

    png_count = 0
    if os.path.isdir(PNG_DIR):
        png_count = len([name for name in os.listdir(PNG_DIR) if name.lower().endswith('.png')])

    summary = {
        'source': 'ARASAAC all pictograms (en)',
        'total_symbols': len(data),
        'png_count': png_count,
        'core_vocab_tagged_count': sum(
            1
            for item in data
            if any('core vocabulary' in c.lower() for c in (item.get('categories') or []))
        ),
    }

    with open(os.path.join(INDEX_DIR, 'summary.json'), 'w', encoding='utf-8') as f:
        json.dump(summary, f, ensure_ascii=False, indent=2)

    with open(os.path.join(INDEX_DIR, 'categories.top200.json'), 'w', encoding='utf-8') as f:
        json.dump(
            [{'category': c, 'count': n} for c, n in cat_counter.most_common(200)],
            f,
            ensure_ascii=False,
            indent=2,
        )

    lookup = {}
    for item in data:
        candidate = {
            'id': item.get('id'),
            'filename': item.get('filename'),
            'categories': item.get('categories') or [],
        }
        for kw in item.get('keywords') or []:
            key = kw.strip().lower()
            if not key:
                continue
            lookup.setdefault(key, []).append(candidate)

    with open(os.path.join(INDEX_DIR, 'keyword_lookup.en.json'), 'w', encoding='utf-8') as f:
        json.dump(lookup, f, ensure_ascii=False)

    print('Generated: summary.json, categories.top200.json, keyword_lookup.en.json')


if __name__ == '__main__':
    main()
