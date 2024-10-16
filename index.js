const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.goto('https://www.wikipedia.org/');
    await page.screenshot({ path: '/app/example.png' });

    await browser.close();
    console.log('Screenshot saved successfully!');
  } catch (error) {
    console.error('Browser launch failed:', error);
    process.exit(1);
  }
})();
