#!/usr/bin/env python3
"""
Edge TTS Audio Generator
Generates high-quality MP3 files for all words using Microsoft Edge Neural TTS (free).
"""

import asyncio
import edge_tts
import os
import sys
import json
import urllib.request

# Configuration
OUTPUT_DIR = "public/audio"
VOICE_EN = "en-US-AriaNeural"  # Female, natural sounding
VOICE_EN_ALT = "en-US-GuyNeural"  # Male alternative
API_URL = "http://localhost:3001/api/words"

async def generate_audio(word: str, output_path: str, voice: str = VOICE_EN):
    """Generate MP3 for a single word."""
    communicate = edge_tts.Communicate(word, voice)
    await communicate.save(output_path)
    print(f"✅ Generated: {word} -> {output_path}")

async def main():
    # Create output directory
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # Fetch words from API
    print("📡 Fetching words from API...")
    try:
        with urllib.request.urlopen(API_URL) as response:
            words = json.loads(response.read().decode())
    except Exception as e:
        print(f"❌ Failed to fetch words: {e}")
        print("Make sure the backend is running on localhost:3001")
        sys.exit(1)
    
    print(f"📝 Found {len(words)} words to process")
    
    # Generate audio for each word
    success_count = 0
    skip_count = 0
    error_count = 0
    
    for word_data in words:
        word = word_data.get('word', '')
        word_id = word_data.get('id', '')
        
        if not word:
            continue
            
        # Create filename from word (sanitize for filesystem)
        safe_word = word.lower().replace(' ', '_').replace("'", "")
        output_path = os.path.join(OUTPUT_DIR, f"{word_id}_{safe_word}.mp3")
        
        # Skip if already exists
        if os.path.exists(output_path):
            print(f"⏭️ Skipped (exists): {word}")
            skip_count += 1
            continue
        
        try:
            await generate_audio(word, output_path)
            success_count += 1
        except Exception as e:
            print(f"❌ Error generating {word}: {e}")
            error_count += 1
    
    print("\n" + "="*50)
    print(f"✅ Generated: {success_count}")
    print(f"⏭️ Skipped (existed): {skip_count}")
    print(f"❌ Errors: {error_count}")
    print(f"📁 Output directory: {OUTPUT_DIR}")

if __name__ == "__main__":
    asyncio.run(main())
