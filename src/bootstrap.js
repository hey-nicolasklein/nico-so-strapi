'use strict';

// Import the portfolio seed script
const portfolioSeed = require('../scripts/portfolio-seed');

module.exports = async () => {
  await portfolioSeed();
};