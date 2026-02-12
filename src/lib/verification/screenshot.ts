
import puppeteer from 'puppeteer'

export async function captureProfile(username: string): Promise<Buffer> {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    })

    try {
        const page = await browser.newPage()
        await page.setViewport({ width: 1200, height: 800 })

        // Navigate to X profile
        // Note: X might block headless puppeteer or require login.
        // For this implementation, we assume public access or we might need cookies.
        // If blocked, we would need to use a scraping API or inject cookies.
        // Given the prompt "Puppeteer + Sharp", we assume direct Puppeteer usage.
        await page.goto(`https://x.com/${username}`, { waitUntil: 'networkidle2' })

        // Select the banner element
        // The banner selector on X changes frequently. 
        // We might need to take full screenshot and crop, or identify the element.
        // For robustness, full page screenshot or specific region.
        // Standard banner aspect ratio is 3:1 (1500x500).
        // It's usually at the top.
        // Let's take a screenshot of the top viewport or specific element if we can find it.
        // Selector approximation: `div[data-testid="presentation"] > img` (often the banner)
        // Or just 1500x500 header.

        // Let's try to find the banner image element.
        // If not found, fallback to top region crop.

        const banner = await page.$('a[href$="/header_photo"] img')
        // or data-testid="UserUrl" sibling... X structure is complex and React-based.

        // Safer approach: Screenshot the top area where banner resides.
        // X banner is usually the first large image.

        const screenshot = await page.screenshot({
            encoding: 'binary',
            clip: { x: 0, y: 0, width: 1200, height: 400 } // Approx header area
        })

        // Or return full buffer and let Sharp crop precise region if we know it.
        // But crop here is efficient.

        return screenshot as Buffer
    } finally {
        await browser.close()
    }
}
