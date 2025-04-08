import { Page } from '@playwright/test';
import { uploadTestArtifact } from '../../utils/blobStorage';

export async function saveTestScreenshot(page: Page, testName: string): Promise<string> {
  const screenshot = await page.screenshot();
  return uploadTestArtifact(screenshot, testName, 'screenshot');
}

export async function saveTestError(error: Error, testName: string): Promise<string> {
  const errorData = Buffer.from(JSON.stringify({
    message: error.message,
    stack: error.stack,
    name: error.name,
  }, null, 2));
  return uploadTestArtifact(errorData, testName, 'error');
}

export async function saveTestLog(log: string, testName: string): Promise<string> {
  return uploadTestArtifact(Buffer.from(log), testName, 'log');
} 