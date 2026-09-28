// Vercel Serverless Function — wraps the Express backend
// Both frontend + backend deploy together as one Vercel project
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../backend/.env') });

const app = require('../backend/src/app');
const connectDB = require('../backend/src/config/db');
const { autoSeedRewardsIfEmpty } = require('../backend/src/utils/seedData');

// Cache the DB connection across warm invocations
let isConnected = false;

module.exports = async (req, res) => {
  if (!isConnected) {
    await connectDB();
    await autoSeedRewardsIfEmpty();
    isConnected = true;
  }
  return app(req, res);
};
