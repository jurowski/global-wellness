import { test, expect } from '@playwright/test';

test('monitor state comparison page for errors', async ({ page }) => {
  // Set up console error listener
  const errors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  // Set up page error listener
  const pageErrors: string[] = [];
  page.on('pageerror', exception => {
    pageErrors.push(exception.message);
  });

  // Set up request error listener
  const requestErrors: string[] = [];
  page.on('requestfailed', request => {
    requestErrors.push(`${request.failure()?.errorText} - ${request.url()}`);
  });

  // Visit the page
  await page.goto('http://localhost:3000/state-comparison');
  
  // Wait for initial load
  await page.waitForLoadState('networkidle');

  // Check for any errors
  if (errors.length > 0 || pageErrors.length > 0 || requestErrors.length > 0) {
    console.log('\n=== Errors Found ===');
    if (errors.length > 0) {
      console.log('\nConsole Errors:');
      errors.forEach(error => console.log(`- ${error}`));
    }
    if (pageErrors.length > 0) {
      console.log('\nPage Errors:');
      pageErrors.forEach(error => console.log(`- ${error}`));
    }
    if (requestErrors.length > 0) {
      console.log('\nRequest Errors:');
      requestErrors.forEach(error => console.log(`- ${error}`));
    }
    throw new Error('Errors found on the state comparison page');
  }

  // Check for specific error messages in the page content
  const errorTexts = await page.locator('text=Error').all();
  if (errorTexts.length > 0) {
    console.log('\n=== Error Messages Found in Page Content ===');
    for (const errorText of errorTexts) {
      console.log(`- ${await errorText.textContent()}`);
    }
    throw new Error('Error messages found in page content');
  }

  // Check for loading states
  const loadingStates = await page.locator('text=Loading').all();
  if (loadingStates.length > 0) {
    console.log('\n=== Loading States Found ===');
    for (const loadingState of loadingStates) {
      console.log(`- ${await loadingState.textContent()}`);
    }
    throw new Error('Loading states found on page');
  }

  // If we get here, no errors were found
  console.log('\nNo errors found on the state comparison page!');
}); 