import * as fs from 'fs'
import * as path from 'path'
import { OUTPUT_DIR } from './export-registry'

export async function exportSlides(html: string, slideCount: number): Promise<string[]> {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })

  const sessionId = Date.now().toString(36)
  const htmlPath = path.join(OUTPUT_DIR, `carousel-${sessionId}.html`)
  fs.writeFileSync(htmlPath, html, 'utf8')

  const { chromium } = await import('playwright')
  const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
  const browser = await chromium.launch(executablePath ? { executablePath } : {})
  try {
    const page = await browser.newPage()
    await page.setViewportSize({ width: 1080, height: 1350 })
    await page.goto(`file://${htmlPath}`, { waitUntil: 'load' })

    await Promise.race([
      page.evaluate(() => document.fonts.ready),
      page.waitForTimeout(5000),
    ])
    await page.waitForTimeout(500)

    const paths: string[] = []
    for (let i = 0; i < slideCount; i++) {
      await page.evaluate((idx: number) => {
        document.querySelectorAll('.slide').forEach((el, n) => {
          el.classList.toggle('active', n === idx)
        })
      }, i)
      await page.waitForTimeout(200)

      const outPath = path.join(OUTPUT_DIR, `${sessionId}-slide-${String(i + 1).padStart(2, '0')}.png`)
      await page.screenshot({ path: outPath, clip: { x: 0, y: 0, width: 1080, height: 1350 } })
      paths.push(outPath)
    }
    return paths
  } finally {
    await browser.close().catch(() => {})
    if (fs.existsSync(htmlPath)) fs.unlinkSync(htmlPath)
  }
}
