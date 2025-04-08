// Increase timeout for tests
jest.setTimeout(60000);

// Don't mock fetch for Puppeteer tests
if (!process.env.PUPPETEER_TEST) {
  global.fetch = jest.fn();
}

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});

// Mock ResizeObserver
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserver;

// Mock IntersectionObserver
class IntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.IntersectionObserver = IntersectionObserver;

// Set up environment variables for tests
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000/api';
process.env.NODE_ENV = process.env.NODE_ENV || 'test'; 