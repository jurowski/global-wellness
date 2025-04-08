// Increase the default timeout for all tests
jest.setTimeout(30000);

// Add any global test setup here
beforeAll(() => {
  // Ensure the development server is running on port 3000
  const serverUrl = 'http://localhost:3000';
  return new Promise((resolve, reject) => {
    const maxAttempts = 5;
    let attempts = 0;

    const checkServer = async () => {
      try {
        const response = await fetch(serverUrl);
        if (response.ok) {
          resolve(true);
        } else {
          throw new Error(`Server responded with status: ${response.status}`);
        }
      } catch (error) {
        attempts++;
        if (attempts >= maxAttempts) {
          reject(new Error(`Could not connect to development server at ${serverUrl}. Please ensure 'npm run dev' is running.`));
        } else {
          setTimeout(checkServer, 1000);
        }
      }
    };

    checkServer();
  });
}); 