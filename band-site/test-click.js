const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  await page.goto('http://localhost:3000');
  
  // Find the button with text "ORACLE (MYRIAM)"
  const buttons = await page.$$('button');
  for (const button of buttons) {
    const text = await page.evaluate(el => el.textContent, button);
    if (text && text.includes('ORACLE (MYRIAM)')) {
      console.log('Found ORACLE button, clicking...');
      await page.evaluate(el => el.click(), button);
      await new Promise(r => setTimeout(r, 3000));
      break;
    }
  }
  
  console.log("Checking if widget exists...");
  const widgetText = await page.evaluate(() => document.body.innerText);
  if (widgetText.includes("Welcome to the Vault")) {
     console.log("Widget rendered successfully!");
  } else {
     console.log("Widget NOT FOUND!");
  }

  await browser.close();
})();
