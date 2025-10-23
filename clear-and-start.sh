#!/bin/bash

echo "🗑️  Clearing Strapi database and starting fresh..."

# Remove database file
rm -f .tmp/data.db
echo "✅ Database cleared"

# Remove any existing .tmp directory
rm -rf .tmp
echo "✅ Temp directory cleared"

# Create fresh .tmp directory
mkdir -p .tmp
echo "✅ Fresh temp directory created"

echo "🚀 Ready to start Strapi with fresh database!"
echo "Run: npm run develop"
