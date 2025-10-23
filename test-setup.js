#!/usr/bin/env node

console.log('🚀 Testing Strapi Portfolio Setup...');

// Test 1: Check if we're in the right directory
const fs = require('fs');
const path = require('path');

console.log('📁 Current directory:', process.cwd());
console.log('📦 Package.json exists:', fs.existsSync('package.json'));
console.log('🗄️  Database file exists:', fs.existsSync('.tmp/data.db'));

// Test 2: Check if portfolio seed script exists
console.log('🌱 Portfolio seed script exists:', fs.existsSync('scripts/portfolio-seed.js'));

// Test 3: Check if content types exist
const contentTypes = [
  'src/api/cv-entry',
  'src/api/skill', 
  'src/api/portfolio-item',
  'src/api/section',
  'src/api/social-link',
  'src/api/page-content',
  'src/api/site-setting'
];

console.log('📋 Content types:');
contentTypes.forEach(type => {
  console.log(`  ${fs.existsSync(type) ? '✅' : '❌'} ${type}`);
});

console.log('🎯 Setup test complete!');
