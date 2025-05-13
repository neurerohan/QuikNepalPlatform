#!/bin/bash

# Install necessary types
npm install --save-dev @vercel/node

# Run the regular build
npm run build 

# Create api folder in dist
mkdir -p dist/api

# Transpile API TypeScript files to JavaScript
npx tsc api/index.ts --outDir dist/api --esModuleInterop --skipLibCheck

# Create runtime config file 
echo 'export const config = { runtime: "nodejs18.x" };' > dist/api/_runtime.js

# Copy public directory contents correctly
if [ ! -d "dist/public" ]; then
  mkdir -p dist/public
fi

# Move contents from dist/public into dist directory for Vercel
if [ -d "dist/public" ]; then
  cp -r dist/public/* dist/
fi

# Log the directory structure
echo "Dist directory structure:"
find dist -type f | sort 