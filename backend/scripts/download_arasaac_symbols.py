#!/usr/bin/env python3
"""
Download all ARASAAC symbols (pictograms) with English keyword filenames.

Usage:
    python3 download_arasaac_symbols.py [--output-dir OUTPUT_DIR] [--resolution 500|2500] [--workers N]

Examples:
    python3 download_arasaac_symbols.py
    python3 download_arasaac_symbols.py --output-dir ./my_symbols --resolution 2500 --workers 20
"""

import argparse
import json
import os
import re
import sys
import time
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor, as_completed
from urllib.request import urlopen, Request
from urllib.error import HTTPError, URLError


API_URL = "https://api.arasaac.org/api/pictograms/all/en"
IMAGE_URL_TEMPLATE = "https://static.arasaac.org/pictograms/{id}/{id}_{resolution}.png"
DEFAULT_OUTPUT_DIR = os.path.join(
    os.path.dirname(__file__),
    "..",
    "assets",
    "symbols",
    "arasaac",
    "raw",
    "png",
)
DEFAULT_RESOLUTION = 500
DEFAULT_WORKERS = 10


def sanitize_filename(name: str) -> str:
    """Remove or replace characters that are invalid in filenames."""
    # Replace slashes, backslashes, and other problematic chars with underscores
    name = re.sub(r'[\\/:*?"<>|]', '_', name)
    # Collapse multiple underscores/spaces
    name = re.sub(r'[\s_]+', '_', name)
    # Strip leading/trailing whitespace and dots
    name = name.strip(' ._')
    # Limit length to avoid filesystem issues
    if len(name) > 200:
        name = name[:200]
    return name


def fetch_pictogram_list() -> list:
    """Fetch the complete list of pictograms from the ARASAAC API."""
    print(f"Fetching pictogram list from {API_URL} ...")
    req = Request(API_URL, headers={"User-Agent": "ArasaacDownloader/1.0"})
    with urlopen(req, timeout=120) as response:
        data = json.loads(response.read().decode("utf-8"))
    print(f"  Found {len(data)} pictograms.")
    return data


def build_filename_map(pictograms: list) -> dict:
    """
    Build a mapping of pictogram ID -> filename.
    Uses the first (or primary) English keyword. Handles duplicates by appending the ID.
    """
    # First pass: collect preferred keyword per ID
    id_to_keyword = {}
    for p in pictograms:
        pid = p["_id"]
        keywords = p.get("keywords", [])
        if not keywords:
            id_to_keyword[pid] = str(pid)
            continue

        # Prefer keyword with hasLocution=True, or just use the first one
        primary = keywords[0].get("keyword", str(pid))
        for kw in keywords:
            if kw.get("hasLocution"):
                primary = kw.get("keyword", primary)
                break

        id_to_keyword[pid] = sanitize_filename(primary) if primary else str(pid)

    # Second pass: detect duplicate filenames and disambiguate with ID
    name_counts = defaultdict(list)
    for pid, name in id_to_keyword.items():
        name_counts[name.lower()].append(pid)

    filename_map = {}
    for pid, name in id_to_keyword.items():
        if len(name_counts[name.lower()]) > 1:
            filename_map[pid] = f"{name}_{pid}"
        else:
            filename_map[pid] = name

    return filename_map


def download_one(pid: int, filename: str, output_dir: str, resolution: int) -> tuple:
    """Download a single pictogram image. Returns (pid, filename, success, error_msg)."""
    url = IMAGE_URL_TEMPLATE.format(id=pid, resolution=resolution)
    filepath = os.path.join(output_dir, f"{filename}.png")

    # Skip if already downloaded
    if os.path.exists(filepath) and os.path.getsize(filepath) > 0:
        return (pid, filename, True, "skipped (exists)")

    try:
        req = Request(url, headers={"User-Agent": "ArasaacDownloader/1.0"})
        with urlopen(req, timeout=30) as response:
            data = response.read()
        with open(filepath, "wb") as f:
            f.write(data)
        return (pid, filename, True, None)
    except (HTTPError, URLError, OSError) as e:
        return (pid, filename, False, str(e))


def main():
    parser = argparse.ArgumentParser(description="Download all ARASAAC pictogram symbols.")
    parser.add_argument(
        "--output-dir",
        default=DEFAULT_OUTPUT_DIR,
        help=f"Directory to save images (default: {DEFAULT_OUTPUT_DIR})",
    )
    parser.add_argument(
        "--resolution",
        type=int,
        choices=[500, 2500],
        default=DEFAULT_RESOLUTION,
        help="Image resolution in pixels (default: 500)",
    )
    parser.add_argument(
        "--workers",
        type=int,
        default=DEFAULT_WORKERS,
        help=f"Number of concurrent download threads (default: {DEFAULT_WORKERS})",
    )
    args = parser.parse_args()

    output_dir = os.path.abspath(args.output_dir)
    os.makedirs(output_dir, exist_ok=True)
    print(f"Output directory: {output_dir}")

    # Step 1: Fetch pictogram metadata
    pictograms = fetch_pictogram_list()

    # Step 2: Build filename map
    filename_map = build_filename_map(pictograms)

    # Step 3: Save metadata as JSON for reference
    metadata_dir = os.path.abspath(
        os.path.join(output_dir, "..", "meta")
    )
    os.makedirs(metadata_dir, exist_ok=True)
    metadata_path = os.path.join(metadata_dir, "metadata.en.json")
    metadata = []
    for p in pictograms:
        pid = p["_id"]
        keywords_en = [kw.get("keyword", "") for kw in p.get("keywords", [])]
        metadata.append({
            "id": pid,
            "filename": f"{filename_map[pid]}.png",
            "keywords": keywords_en,
            "categories": p.get("categories", []),
        })
    with open(metadata_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, ensure_ascii=False, indent=2)
    print(f"Saved metadata to {metadata_path}")

    # Step 4: Download images in parallel
    total = len(filename_map)
    print(f"\nDownloading {total} images with {args.workers} workers (resolution: {args.resolution}px)...")
    start_time = time.time()
    success_count = 0
    skip_count = 0
    fail_count = 0
    errors = []

    with ThreadPoolExecutor(max_workers=args.workers) as executor:
        futures = {
            executor.submit(download_one, pid, fname, output_dir, args.resolution): pid
            for pid, fname in filename_map.items()
        }

        for i, future in enumerate(as_completed(futures), 1):
            pid, fname, ok, err = future.result()
            if ok:
                if err and "skipped" in err:
                    skip_count += 1
                else:
                    success_count += 1
            else:
                fail_count += 1
                errors.append((pid, fname, err))

            if i % 200 == 0 or i == total:
                elapsed = time.time() - start_time
                print(f"  Progress: {i}/{total}  ({success_count} new, {skip_count} skipped, {fail_count} failed)  [{elapsed:.1f}s]")

    elapsed = time.time() - start_time
    print(f"\nDone in {elapsed:.1f}s!")
    print(f"  Downloaded: {success_count}")
    print(f"  Skipped:    {skip_count}")
    print(f"  Failed:     {fail_count}")

    if errors:
        error_log_path = os.path.join(output_dir, "_errors.log")
        with open(error_log_path, "w") as f:
            for pid, fname, err in errors:
                f.write(f"ID={pid}  file={fname}.png  error={err}\n")
        print(f"  Error log:  {error_log_path}")


if __name__ == "__main__":
    main()
