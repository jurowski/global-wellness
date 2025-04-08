import puppeteer, { Browser, Page } from 'puppeteer';

interface SimulationOptions {
  url?: string;
  timeout?: number;
  waitForSelector?: string;
  actions?: ((page: Page) => Promise<void>)[];
}

export class PageSimulator {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private consoleMessages: { type: string; text: string }[] = [];

  async init() {
    this.browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox']
    });
    this.page = await this.browser.newPage();

    // Capture console logs
    this.page.on('console', (message) => {
      this.consoleMessages.push({
        type: message.type(),
        text: message.text()
      });
    });

    // Capture network errors
    this.page.on('pageerror', (error) => {
      this.consoleMessages.push({
        type: 'error',
        text: error.message
      });
    });
  }

  async simulatePage({
    url = 'http://localhost:3000',
    timeout = 30000,
    waitForSelector = 'body',
    actions = []
  }: SimulationOptions = {}) {
    if (!this.page) {
      throw new Error('Page not initialized. Call init() first.');
    }

    try {
      // Navigate to the page
      await this.page.goto(url, {
        waitUntil: 'networkidle0',
        timeout
      });

      // Wait for the selector to be present
      await this.page.waitForSelector(waitForSelector, { timeout });

      // Execute any additional actions
      for (const action of actions) {
        await action(this.page);
      }

      return {
        consoleMessages: this.consoleMessages,
        page: this.page
      };
    } catch (error) {
      console.error('Error during page simulation:', error);
      throw error;
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
      this.consoleMessages = [];
    }
  }

  getConsoleMessages() {
    return this.consoleMessages;
  }

  clearConsoleMessages() {
    this.consoleMessages = [];
  }
}

// Example usage:
// const simulator = new PageSimulator();
// await simulator.init();
// const { consoleMessages } = await simulator.simulatePage({
//   actions: [
//     async (page) => {
//       await page.click('#country1-select');
//       await page.type('#country1-select', 'US');
//     }
//   ]
// });
// console.log(consoleMessages);
// await simulator.close(); 