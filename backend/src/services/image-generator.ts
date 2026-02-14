import Replicate from 'replicate';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';

// Ensure the auth token is present
if (!process.env.REPLICATE_API_TOKEN) {
  console.warn("REPLICATE_API_TOKEN is missing in environment variables.");
}

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export const imageGeneratorService = {
  /**
   * Generates an image using Replicate (Flux model).
   * Defaulting to `black-forest-labs/flux-schnell` for speed and low cost.
   * Can switch to `black-forest-labs/flux-1.1-pro` for higher quality.
   */
  async generateImage(prompt: string, model: 'schnell' | 'pro' = 'schnell'): Promise<string> {
    try {
      console.log(`Generating image with Replicate (${model})... Prompt: ${prompt.substring(0, 50)}...`);

      let output: any;

      if (model === 'pro') {
        // Flux 1.1 Pro
        output = await replicate.run(
          "black-forest-labs/flux-1.1-pro",
          {
            input: {
              prompt: prompt,
              aspect_ratio: "4:3",
              output_format: "jpg",
              output_quality: 90,
              safety_tolerance: 2
            }
          }
        );
      } else {
        // Flux Schnell (Cheaper, Faster)
        output = await replicate.run(
          "black-forest-labs/flux-schnell",
          {
            input: {
              prompt: prompt,
              aspect_ratio: "4:3",
              output_format: "jpg",
              output_quality: 90,
              safety_tolerance: 2,
              disable_safety_checker: true
            }
          }
        );
      }

      console.log('Replicate output type:', typeof output);

      // Handle Array output (often Replicate returns [url] or [stream])
      if (Array.isArray(output) && output.length > 0) {
        output = output[0];
      }

      // 1. Direct String URL
      if (typeof output === 'string') {
        return output;
      }

      // 2. URL Object
      if (output instanceof URL) {
        return output.toString();
      }

      // 3. Object with URL property
      if (output && typeof output === 'object' && output.url) {
        // sometimes .url is a function, sometimes a property
        if (typeof output.url === 'function') return output.url().toString();
        return output.url.toString();
      }

      // 4. ReadableStream (Save to local file)
      // Check for standard ReadableStream or Node Stream
      if (output instanceof ReadableStream || (output && typeof output.getReader === 'function') || (output && typeof output.pipe === 'function')) {
        console.log('Output is a Stream. Saving to local file...');

        const fileName = `${crypto.randomUUID()}.jpg`;
        // Ensure we go up from 'src/services' to 'public/generated'
        // Process.cwd() is usually backend root in this context
        const publicDir = path.join(process.cwd(), 'public', 'generated');

        if (!fs.existsSync(publicDir)) {
          fs.mkdirSync(publicDir, { recursive: true });
        }

        const filePath = path.join(publicDir, fileName);
        const writeStream = fs.createWriteStream(filePath);

        if (output instanceof ReadableStream) {
          // Convert Web Stream to Node Stream for pipeline
          // @ts-ignore
          const nodeStream = Readable.fromWeb(output);
          await pipeline(nodeStream, writeStream);
        } else {
          // It's likely a Node stream or compatible
          await pipeline(output, writeStream);
        }

        console.log(`Saved image to ${filePath}`);

        // Return local URL
        // Assuming backend runs on port 3001
        return `http://localhost:3001/generated/${fileName}`;
      }

      // If we got here, we don't know what it is. Log it.
      console.log('Unknown output format:', output);
      // Attempt to stringify if it has a toString that isn't [object Object]
      if (output && output.toString && output.toString() !== '[object Object]') {
        return output.toString();
      }

      throw new Error('Unexpected output format from Replicate');

    } catch (error) {
      console.error('Replicate generation failed:', error);
      throw error;
    }
  },

  /**
   * Search for an image using Tavily API.
   * Useful for finding real-world images or illustrations when generation is not needed.
   */
  async searchImage(query: string): Promise<string> {
    const apiKey = process.env.TAVILY_API_KEY;
    if (!apiKey) {
      throw new Error('TAVILY_API_KEY is missing in backend .env');
    }

    try {
      console.log(`Searching image with Tavily: ${query}`);
      console.log(`Tavily Key Present: ${!!apiKey}, Key Length: ${apiKey?.length}`);

      const response = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          api_key: apiKey,
          query: query,
          search_depth: "basic",
          include_images: true,
          include_image_descriptions: false,
          max_results: 1
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Tavily API error: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      if (data.images && data.images.length > 0) {
        // Return first image URL
        const firstImage = data.images[0];
        if (typeof firstImage === 'string') return firstImage;
        if (firstImage.url) return firstImage.url;
        return String(firstImage);
      }

      throw new Error('No images found by Tavily');

    } catch (error: any) {
      console.error('Tavily search failed:', error);
      console.error('Error details:', error.message);
      if (error.cause) console.error('Cause:', error.cause);
      throw error;
    }
  }
};
