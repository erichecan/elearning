import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

export const imageScraperService = {
    async scrapeGoogleImage(query: string): Promise<string> {
        let browser;
        try {
            console.log(`Scraping image for: ${query}`);
            browser = await puppeteer.launch({
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--disable-gpu'
                ]
            });

            const page = await browser.newPage();

            // Set viewport to a realistic desktop size
            await page.setViewport({ width: 1366, height: 768 });

            // Navigate to Google Images
            await page.goto(`https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch&udm=2`, {
                waitUntil: 'networkidle2',
                timeout: 30000
            });

            // Wait for image results to load
            const selector = 'div[data-id] img';
            await page.waitForSelector(selector, { timeout: 5000 });

            // Get the first image src
            const imageUrl = await page.evaluate(() => {
                const images = document.querySelectorAll('div[data-id] img');
                for (const img of Array.from(images)) {
                    const src = (img as HTMLImageElement).src;
                    if (src && src.length > 0) return src;
                }
                return null;
            });

            if (!imageUrl) {
                throw new Error('No image found in search results');
            }

            console.log(`Found image URL for ${query}: ${imageUrl.substring(0, 50)}...`);
            return imageUrl;

        } catch (error) {
            console.error('Puppeteer scraping error:', error);
            // Return a safe placeholder if scraping fails
            return `https://placehold.co/600x400?text=${encodeURIComponent(query)}`;
        } finally {
            if (browser) {
                await browser.close();
            }
        }
    }
};
