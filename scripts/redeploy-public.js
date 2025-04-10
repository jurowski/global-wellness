const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Creating a new public deployment...');

// 1. First, let's check if we have a .vercel directory with project.json
if (!fs.existsSync(path.join(process.cwd(), '.vercel', 'project.json'))) {
  console.log('No Vercel project configuration found. Running vercel link first...');
  try {
    execSync('vercel link', { stdio: 'inherit' });
  } catch (error) {
    console.error('Error linking project:', error);
    process.exit(1);
  }
}

// 2. Create a temporary .env file with public access flag
console.log('Setting up environment for public access...');
fs.writeFileSync(
  path.join(process.cwd(), '.vercel', '.env.production'),
  'PUBLIC_ACCESS=true\n'
);

// 3. Deploy with explicit flags
console.log('Deploying with public access...');
try {
  // Add debug param and override protection off
  execSync('vercel deploy --prod --public --yes', { stdio: 'inherit' });
  console.log('Deployment complete! Site should be publicly accessible.');
} catch (error) {
  console.error('Deployment error:', error);
  process.exit(1);
}

// 4. Add a deployment check
console.log('Checking deployment access...');
try {
  execSync('node tests/deploy-access-test.js', { stdio: 'inherit' });
} catch (error) {
  console.error('Deployment check error:', error);
} 