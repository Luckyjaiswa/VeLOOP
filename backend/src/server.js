require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const { autoSeedRewardsIfEmpty } = require('./utils/seedData');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await connectDB();

    // Auto-seed default 7-day rewards if not already present
    await autoSeedRewardsIfEmpty();

    const server = app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`🚀 VELoop Rewards Backend running in ${process.env.NODE_ENV || 'development'} mode`);
      console.log(`🌐 Server URL: http://localhost:${PORT}`);
      console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`====================================================`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.error(`[Unhandled Rejection] Error: ${err.message}`);
    });
  } catch (error) {
    console.error(`[Server Start Error] ${error.message}`);
    process.exit(1);
  }
};

startServer();
