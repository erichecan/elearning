#!/usr/bin/env python3
import asyncio
import edge_tts
import os
import sys

VOICE = os.environ.get("EDGE_TTS_VOICE", "en-US-JennyNeural")

async def main():
    if len(sys.argv) < 3:
        print("Usage: edge-tts-single.py <text> <output_path>")
        sys.exit(1)

    text = sys.argv[1]
    output_path = sys.argv[2]

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    communicate = edge_tts.Communicate(text, VOICE)
    await communicate.save(output_path)

if __name__ == "__main__":
    asyncio.run(main())
