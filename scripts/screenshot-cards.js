/**
 * screenshot-cards.js
 * Renders each card HTML at 300×400 and saves a JPG to client/public/cards/
 *
 * Usage:
 *   node scripts/screenshot-cards.js
 *
 * Requires puppeteer:
 *   npm install --save-dev puppeteer   (run from project root)
 */

const puppeteer = require('puppeteer');
const path      = require('path');
const fs        = require('fs');

const CARD_W = 300;
const CARD_H = 400;

const cards = [
  {
    html:     'client/src/cards/florabox_marbled_rose_v7.html',
    out:      'client/public/cards/marbled-rose.jpg',
    selector: '.card-shadow',
    isCanvas: false,
  },
  {
    html:     'client/src/cards/florabox_golden_hour_v2.html',
    out:      'client/public/cards/golden-hour.jpg',
    selector: '.card-shadow',
    isCanvas: false,
  },
  {
    html:     'client/src/cards/florabox_mineral_moon_v6.html',
    out:      'client/public/cards/mineral-moon.jpg',
    selector: '#mc',
    isCanvas: true,
    // The HTML loads 'assets/images/moon.jpg' (relative path that breaks under file://)
    // We intercept and serve the actual file instead.
    interceptMap: {
      'moon.jpg': 'client/public/moon.jpg',
    },
  },
];

(async () => {
  const root    = path.resolve(__dirname, '..');
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--window-size=400,500', '--disable-web-security'],
  });

  for (const card of cards) {
    const page = await browser.newPage();
    await page.setViewport({ width: CARD_W, height: CARD_H, deviceScaleFactor: 2 });

    // Set up request interception BEFORE goto so image loads are caught
    if (card.interceptMap) {
      await page.setRequestInterception(true);
      page.on('request', req => {
        const url = req.url();
        const match = Object.entries(card.interceptMap).find(([key]) => url.includes(key));
        if (match) {
          const [, localPath] = match;
          req.respond({
            status:      200,
            contentType: 'image/jpeg',
            body:        fs.readFileSync(path.join(root, localPath)),
          });
        } else {
          req.continue();
        }
      });
    }

    const filePath = 'file://' + path.join(root, card.html).replace(/\\/g, '/');
    console.log(`→ Loading  ${card.html}`);
    await page.goto(filePath, { waitUntil: 'networkidle0' });

    // Resize the target element to exactly 300×400 and hide wrapper chrome
    await page.evaluate((sel, w, h) => {
      document.querySelectorAll('.eyebrow, .card-name, .cn, .acts').forEach(el => {
        el.style.display = 'none';
      });
      const el = document.querySelector(sel);
      if (el) {
        el.style.width        = w + 'px';
        el.style.height       = h + 'px';
        el.style.margin       = '0';
        el.style.padding      = '0';
        el.style.position     = 'fixed';
        el.style.top          = '0';
        el.style.left         = '0';
        el.style.borderRadius = '0';
        el.style.boxShadow    = 'none';
      }
      document.body.style.cssText = 'margin:0;padding:0;overflow:hidden;background:transparent;';
      const fw = document.querySelector('.fw');
      if (fw) fw.style.cssText = 'margin:0;padding:0;background:transparent;';
    }, card.selector, CARD_W, CARD_H);

    if (card.isCanvas) {
      // Wait for RAF frames to paint the canvas
      await page.evaluate(() => new Promise(resolve => {
        let frames = 0;
        function tick() {
          if (++frames >= 10) resolve();
          else requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      }));
      // Extra settle for moon surface detail
      await new Promise(r => setTimeout(r, 800));
    } else {
      // Static SVG — short wait for fonts
      await new Promise(r => setTimeout(r, 600));
    }

    const el = await page.$(card.selector);
    if (!el) throw new Error(`Selector not found: ${card.selector}`);

    const outPath = path.join(root, card.out);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });

    await el.screenshot({ path: outPath, type: 'jpeg', quality: 92 });
    console.log(`✓ Saved    ${card.out}`);
    await page.close();
  }

  await browser.close();
  console.log('\nDone. All cards screenshotted.');
})();
