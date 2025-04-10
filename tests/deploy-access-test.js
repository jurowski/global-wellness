const { chromium } = require('playwright');

async function testDeployedSite() {
  const browser = await chromium.launch({ headless: true });
  console.log('Browser launched');
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  console.log('Opening deployed URL with protection bypass...');
  const deployedUrl = 'https://global-wellness-c8qjzq8qc-sandon-jurowskis-projects.vercel.app';
  const bypassToken = 'cjjdP0yzZIEst1I0Urr4EnnKmWXfx011';
  const urlWithBypass = `${deployedUrl}?x-vercel-protection-bypass=${bypassToken}`;
  
  try {
    // Navigate to the site with a timeout of 30 seconds
    const response = await page.goto(urlWithBypass, { timeout: 30000, waitUntil: 'networkidle' });
    console.log(`Status: ${response.status()}`);
    
    // Check if we're redirected to a login page
    const currentUrl = page.url();
    console.log(`Current URL: ${currentUrl}`);
    
    if (currentUrl.includes('login') || currentUrl.includes('auth')) {
      console.error('❌ Authentication still required - bypass token might not be working');
      await page.screenshot({ path: 'auth-redirect-error.png' });
    } else {
      // Check page content for login indicators
      const pageContent = await page.content();
      const hasLoginForm = pageContent.includes('Log in') || 
                          pageContent.includes('Sign in') || 
                          pageContent.includes('Login') ||
                          pageContent.includes('Password');
      
      if (hasLoginForm) {
        console.error('❌ Authentication form detected on page');
        await page.screenshot({ path: 'auth-form-error.png' });
      } else {
        console.log('✅ Site loaded successfully with bypass token!');
        await page.screenshot({ path: 'successful-load.png' });
      }
    }
    
    // Check for specific content that should be on your site
    const homePageContent = await page.textContent('body');
    if (homePageContent.includes('Global Wellness') || 
        homePageContent.includes('State Comparison')) {
      console.log('✅ Site content verified');
    } else {
      console.warn('⚠️ Expected content not found - might not be the correct page');
    }
    
  } catch (error) {
    console.error(`❌ Error accessing the site: ${error.message}`);
    await page.screenshot({ path: 'access-error.png' });
  } finally {
    await browser.close();
    console.log('Test completed');
  }
}

testDeployedSite().catch(console.error); 