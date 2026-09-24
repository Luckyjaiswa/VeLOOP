require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./src/config/db');
const { seedDatabase } = require('./src/utils/seedData');

const run = async () => {
  try {
    await connectDB();
    await seedDatabase();
    console.log('[Seed] All done! Closing connection...');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error] Failed:', error);
    process.exit(1);
  }
};

run();
