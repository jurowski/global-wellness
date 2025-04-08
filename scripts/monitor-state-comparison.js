const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

async function runTest() {
  try {
    const { stdout, stderr } = await execAsync('npx playwright test tests/state-comparison-monitor.spec.ts');
    console.log('Test output:', stdout);
    if (stderr) console.error('Test errors:', stderr);
    return true;
  } catch (error) {
    console.error('Test failed:', error.message);
    return false;
  }
}

async function monitor() {
  const maxAttempts = 10;
  const delay = 5000; // 5 seconds between attempts

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    console.log(`\nAttempt ${attempt} of ${maxAttempts}`);
    
    const success = await runTest();
    if (success) {
      console.log('Test passed successfully!');
      process.exit(0);
    }

    if (attempt < maxAttempts) {
      console.log(`Waiting ${delay/1000} seconds before next attempt...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  console.error('Maximum attempts reached. Test failed to pass.');
  process.exit(1);
}

monitor(); 