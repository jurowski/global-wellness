import { chromium, test, expect, Browser, Page, ConsoleMessage, Request, Route } from '@playwright/test';

const SERVER_PORT = process.env.PORT || 3000;

test.describe('GraphQL Integration Tests', () => {
  let browser: Browser;
  let page: Page;

  test.beforeAll(async () => {
    browser = await chromium.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const context = await browser.newContext({
      ignoreHTTPSErrors: true,
      viewport: { width: 1280, height: 720 }
    });
    
    page = await context.newPage();
    
    page.on('console', msg => {
      if (msg.type() === 'error' || msg.type() === 'warning') {
        console.log(`Browser ${msg.type()}:`, msg.text());
      }
    });
    
    page.on('pageerror', error => {
      console.error('Page error:', error.message);
      test.fail();
    });

    page.on('requestfailed', request => {
      console.log('Failed request:', {
        url: request.url(),
        error: request.failure()?.errorText
      });
    });
  });

  test.afterAll(async () => {
    await browser?.close().catch(console.error);
  });

  test.afterEach(async ({ }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      await page.screenshot({ path: `test-failure-${Date.now()}.png` });
      await browser?.close();
      process.exit(1);
    }
  });

  test('should load the page without GraphQL errors', async () => {
    console.log(`Navigating to http://localhost:${SERVER_PORT}/`);
    
    const consoleErrors: string[] = [];
    const failedRequests: string[] = [];

    page.on('console', (msg: ConsoleMessage) => {
      if (msg.type() === 'error') {
        console.log('Console error:', msg.text());
        consoleErrors.push(msg.text());
      }
    });

    page.on('requestfailed', (request: Request) => {
      const error = `${request.url()} - ${request.failure()?.errorText}`;
      console.log('Failed request:', error);
      failedRequests.push(error);
    });

    let retries = 3;
    let response;
    
    while (retries > 0) {
      try {
        response = await page.goto(`http://localhost:${SERVER_PORT}/`, {
          waitUntil: 'networkidle',
          timeout: 30000
        });
        break;
      } catch (error) {
        console.log(`Retry attempt ${4 - retries} failed:`, error);
        retries--;
        if (retries === 0) {
          await page.screenshot({ path: `navigation-failure-${Date.now()}.png` });
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
    
    expect(response?.status()).toBe(200);
    
    await page.waitForTimeout(5000);
    
    if (consoleErrors.length > 0 || failedRequests.length > 0) {
      await page.screenshot({ path: `error-state-${Date.now()}.png` });
      throw new Error('Test failed due to console errors or failed requests');
    }
    
    expect(consoleErrors).toHaveLength(0);
    expect(failedRequests).toHaveLength(0);
  });

  test('should successfully fetch country data', async () => {
    const graphqlErrors: string[] = [];
    
    await page.route('**/api/graphql', async (route: Route) => {
      try {
        const response = await route.fetch();
        const data = await response.json();
        
        if (data.errors) {
          console.log('GraphQL errors:', data.errors);
          graphqlErrors.push(...data.errors.map((e: any) => e.message));
          await page.screenshot({ path: `graphql-error-${Date.now()}.png` });
        }
        
        await route.fulfill({ response });
      } catch (error) {
        console.error('Error handling GraphQL request:', error);
        await page.screenshot({ path: `graphql-request-error-${Date.now()}.png` });
        await route.fulfill({ status: 500 });
      }
    });

    let retries = 3;
    let response;
    
    while (retries > 0) {
      try {
        response = await page.goto(`http://localhost:${SERVER_PORT}/`, {
          waitUntil: 'networkidle',
          timeout: 30000
        });
        break;
      } catch (error) {
        console.log(`Retry attempt ${4 - retries} failed:`, error);
        retries--;
        if (retries === 0) {
          await page.screenshot({ path: `navigation-failure-${Date.now()}.png` });
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
    
    expect(response?.status()).toBe(200);
    
    await page.waitForTimeout(5000);
    
    if (graphqlErrors.length > 0) {
      throw new Error(`GraphQL errors encountered: ${graphqlErrors.join(', ')}`);
    }
    
    expect(graphqlErrors).toHaveLength(0);
  });
}); 