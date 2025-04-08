#!/bin/bash

# Exit on error
set -e

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the seed script
echo "Building seed script..."
npx tsc scripts/seed-data.ts

# Run the seed script
echo "Running seed script..."
node scripts/seed-data.js

echo "Data seeding complete!" 