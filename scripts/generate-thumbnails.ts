import * as fs from 'fs'
import * as path from 'path'
import { buildCarouselHTML } from '../lib/template-engine'
import type { Slide, CarouselMeta } from '../lib/types'

const OUT_DIR = path.join(process.cwd(), 'public', 'thumbnails')

// Sample hook slide for each template — enough content to show the visual character
const HOOK: Slide = {
  id: 'thumb',
  type: 'hook',
  headline: 'AI costs',
  headline2: '~dropped 95%',
  headline3: 'in 18 months',
  pill: 'The real disruption is already here',
}

const TEMPLATES: Array<{ theme: CarouselMeta['theme']; filename: string }> = [
  { theme: 'marrakech',  filename: 'marrakech.png'  },
  { theme: 'reykjavik',  filename: 'reykjavik.png'  },
  { theme: 'valletta',   filename: 'valletta.png'   },
  { theme: 'tbilisi',    filename: 'tbilisi.png'    },
  { theme: 'havana',     filename: 'havana.png'     },
  { theme: 'medellin',   filename: 'medellin.png'   },
  { theme: 'luanda',     filename: 'luanda.png'     },
  { theme: 'tangier',    filename: 'tangier.png'    },
  { theme: 'tallinn',    filename: 'tallinn.png'    },
  { theme: 'cartagena',  filename: 'cartagena.png'  },
  { theme: 'kyoto',      filename: 'kyoto.png'      },
  { theme: 'copenhagen', filename: 'copenhagen.png' },
  { theme: 'zurich',     filename: 'zurich.png'     },
]

const META_BASE: Omit<CarouselMeta, 'theme'> = {
  handle: '@thefounderlab',
  pageName: 'The Founder Lab',
  topic: 'AI cost reduction',
}

async function run() {
  fs.mkdirSync(OUT_DIR, { recursive: true })

  const { chromium } = await import('playwright')
  const browser = await chromium.launch()

  try {
    for (const { theme, filename } of TEMPLATES) {
      console.log(`Generating ${filename}…`)

      const meta: CarouselMeta = { ...META_BASE, theme }
      const html = buildCarouselHTML([HOOK], meta)

      const page = await browser.newPage()
      await page.setViewportSize({ width: 1080, height: 1350 })

      // Write to temp file so file:// protocol works for Google Fonts
      const tmp = path.join(OUT_DIR, `_tmp_${theme}.html`)
      fs.writeFileSync(tmp, html, 'utf8')

      await page.goto(`file://${tmp}`, { waitUntil: 'load' })
      await Promise.race([
        page.evaluate(() => document.fonts.ready),
        page.waitForTimeout(6000),
      ])
      await page.waitForTimeout(600)

      // Make first slide visible
      await page.evaluate(() => {
        const slides = document.querySelectorAll('.slide')
        if (slides[0]) slides[0].classList.add('active')
      })
      await page.waitForTimeout(200)

      const outPath = path.join(OUT_DIR, filename)
      await page.screenshot({ path: outPath, clip: { x: 0, y: 0, width: 1080, height: 1350 } })
      await page.close()

      fs.unlinkSync(tmp)
      console.log(`  ✓ ${outPath}`)
    }
  } finally {
    await browser.close()
  }

  console.log('\nAll thumbnails generated.')
}

run().catch(err => { console.error(err); process.exit(1) })
