import { test, expect, chromium } from '@playwright/test';
import { saveTestScreenshot, saveTestError, saveTestLog } from '../utils/testArtifacts';

const SERVER_PORT = process.env.PORT || 3000;

test.describe('GraphQL Integration', () => {
  let browser: any;
  let page: any;

  test.beforeAll(async () => {
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  });

  test.beforeEach(async () => {
    page = await browser.newPage();
    await page.goto(`http://localhost:${SERVER_PORT}`);
  });

  test.afterEach(async () => {
    if (page) {
      try {
        await page.close();
      } catch (error) {
        console.error('Error closing page:', error);
      }
    }
  });

  test.afterAll(async () => {
    if (browser) {
      try {
        await browser.close();
      } catch (error) {
        console.error('Error closing browser:', error);
      }
    }
  });

  test('page loads without GraphQL errors', async () => {
    const consoleErrors: string[] = [];
    const failedRequests: string[] = [];

    page.on('console', async (msg: any) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
        await saveTestLog(msg.text(), 'graphql-console-error');
      }
    });

    page.on('requestfailed', async (request: any) => {
      failedRequests.push(`${request.method()} ${request.url()}`);
      await saveTestLog(`${request.method()} ${request.url()}`, 'graphql-request-failed');
    });

    // Wait for the page to load and any initial GraphQL requests to complete
    await page.waitForLoadState('networkidle');

    // Take a screenshot for debugging
    const screenshotUrl = await saveTestScreenshot(page, 'graphql-page-load');

    // Check for console errors
    if (consoleErrors.length > 0) {
      const errorUrl = await saveTestError(
        new Error(`Console errors found: ${consoleErrors.join(', ')}`),
        'graphql-console-errors'
      );
      throw new Error(`Console errors found. See ${errorUrl} for details. Screenshot: ${screenshotUrl}`);
    }

    // Check for failed requests
    if (failedRequests.length > 0) {
      const errorUrl = await saveTestError(
        new Error(`Failed requests found: ${failedRequests.join(', ')}`),
        'graphql-failed-requests'
      );
      throw new Error(`Failed requests found. See ${errorUrl} for details. Screenshot: ${screenshotUrl}`);
    }
  });

  test('can fetch country data successfully', async () => {
    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Check for GraphQL errors in the response
    const graphqlErrors: string[] = [];
    page.on('response', async (response: any) => {
      if (response.url().includes('/api/graphql')) {
        const data = await response.json();
        if (data.errors) {
          graphqlErrors.push(...data.errors.map((e: any) => e.message));
          await saveTestLog(JSON.stringify(data.errors, null, 2), 'graphql-response-errors');
        }
      }
    });

    // Take a screenshot for debugging
    const screenshotUrl = await saveTestScreenshot(page, 'graphql-country-data');

    // Check for GraphQL errors
    if (graphqlErrors.length > 0) {
      const errorUrl = await saveTestError(
        new Error(`GraphQL errors found: ${graphqlErrors.join(', ')}`),
        'graphql-errors'
      );
      throw new Error(`GraphQL errors found. See ${errorUrl} for details. Screenshot: ${screenshotUrl}`);
    }
  });
}); 