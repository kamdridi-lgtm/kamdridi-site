const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  const viewports = [
    { width: 1440, height: 900, name: 'desktop-1440' },
    { width: 1024, height: 768, name: 'laptop-1024' },
    { width: 768, height: 1024, name: 'tablet-768' },
    { width: 375, height: 812, name: 'mobile-375' }
  ];

  for (const vp of viewports) {
    await page.setViewport({ width: vp.width, height: vp.height });
    // scroll to universe section
    await page.evaluate(() => {
      const el = document.getElementById('universe');
      if (el) el.scrollIntoView();
    });
    // wait a bit for images to load
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: `capture-${vp.name}.png`, fullPage: false });
    console.log(`Saved capture-${vp.name}.png`);
  }

  // Also capture the navigation
  await page.setViewport({ width: 1440, height: 900 });
  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: `capture-nav-1440.png`, fullPage: false });
  console.log(`Saved capture-nav-1440.png`);

  await browser.close();
})();
