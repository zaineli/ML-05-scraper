const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.goto('https://www.daraz.pk', { waitUntil: 'networkidle2' }); 
    // Take a full-page screenshot
    await page.screenshot({
      path: 'amazon.png',
      fullPage: true, // Capture the entire page
    });

    await browser.close();
    console.log('Full-page screenshot saved successfully!');
  } catch (error) {
    console.error('Browser launch failed:', error);
    process.exit(1);
  }
})();
