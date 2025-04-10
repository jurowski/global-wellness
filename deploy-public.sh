#!/bin/bash
set -e

# Create a public demo version that will be accessible without authentication
echo "Creating a public demo version..."

# Create a directory for the public demo
mkdir -p public-demo

# Copy the static HTML file to the public demo directory
cp public/index.html public-demo/index.html

# Create a simple README
cat > public-demo/README.md << EOL
# Global Wellness - Public Demo

This is a public demo for the Global Wellness application.
The main application is available in the full repository.

## Access Test

This demo tests public access without authentication requirements.
EOL

# Initialize git in the public demo directory
cd public-demo
git init
git add .
git commit -m "Initial public demo for testing access"

# Create a GitHub Pages branch
git checkout -b gh-pages

# Push to GitHub Pages (this will require user authentication)
echo "Ready to push to GitHub Pages."
echo "Run the following commands manually to complete the deployment:"
echo ""
echo "cd public-demo"
echo "git remote add origin https://github.com/jurowski/global-wellness-public.git"
echo "git push -u origin gh-pages --force"
echo ""
echo "After pushing, the site will be available at: https://jurowski.github.io/global-wellness-public/"
echo ""

chmod +x deploy-public.sh 