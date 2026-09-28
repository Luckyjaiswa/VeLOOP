// Vercel Serverless Function — wraps the Express backend
// Both frontend + backend deploy together as one Vercel project
const path = require('path');
if (process.env.NODE_ENV !== 'production') {
  require('../backend/node_modules/dotenv').config({ path: path.resolve(__dirname, '../backend/.env') });
}

const app = require('../backend/src/app');
const connectDB = require('../backend/src/config/db');
const { autoSeedRewardsIfEmpty } = require('../backend/src/utils/seedData');

// Cache the DB connection across warm invocations
let isConnected = false;

module.exports = async (req, res) => {
  if (!isConnected) {
    try {
      await connectDB();
      await autoSeedRewardsIfEmpty();
      isConnected = true;
    } catch (error) {
      console.error('Vercel initialization error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Internal Server Error during initialization. Check Vercel logs.', 
        error: error.message 
      });
    }
  }
  return app(req, res);
};
