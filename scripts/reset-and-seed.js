'use strict';

const fs = require('fs-extra');
const path = require('path');

async function resetAndSeed() {
  try {
    console.log('🗑️  Clearing database...');
    
    // Remove the database file
    const dbPath = path.join(__dirname, '..', '.tmp', 'data.db');
    if (fs.existsSync(dbPath)) {
      fs.removeSync(dbPath);
      console.log('✅ Database cleared');
    } else {
      console.log('ℹ️  No database file found');
    }

    console.log('🌱 Starting Strapi with portfolio seed...');
    console.log('📝 The portfolio data will be automatically imported on first run');
    console.log('🚀 You can now start Strapi with: npm run develop');
    
  } catch (error) {
    console.error('❌ Error during reset:', error);
  }
}

resetAndSeed();
