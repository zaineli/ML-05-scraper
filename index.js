const axios = require('axios');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');


const screenshotsDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
}


async function fetchUrls(query) {
    try {
        const response = await axios.get(`http://backend:8000/search?query=${query}`);
        return response.data; 
    } catch (error) {
        console.error("Error fetching URLs from FastAPI:", error);
        throw error;
    }
}


async function takeScreenshot(url) {
    const browser = await puppeteer.launch({
        headless: "new",  
        defaultViewport: null,  
        args: ['--no-sandbox', '--disable-setuid-sandbox'], 
    });
    
    const page = await browser.newPage();
    
    
    await page.setRequestInterception(true);
    page.on('request', (request) => {
        if (['image', 'font'].includes(request.resourceType())) {
            request.abort();
        } else {
            request.continue();
        }
    });

    const websiteName = new URL(url).hostname.replace('www.', ''); 

    try {
        console.log(`Attempting to navigate to: ${url}`);  
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 }); 
        await page.waitForTimeout(2000);  
        const screenshotPath = path.join(screenshotsDir, `${websiteName}.png`); 
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`Screenshot saved as: ${screenshotPath}`);
    } catch (error) {
        console.error(`Error taking screenshot for ${url}:`, error);
    } finally {
        await browser.close();
    }
}


async function main(query) {
    try {
        const urls = await fetchUrls(query);
        for (const url of urls) {
            const decodedUrl = decodeURIComponent(url);  
            await takeScreenshot(decodedUrl); 
        }
    } catch (error) {
        console.error('Error in main function:', error);
    }
}


main('ecommerce men shirts')
    .then(() => console.log('All screenshots taken!'))
    .catch(err => console.error(err));
