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

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`\n❌ [Server Error] Port ${PORT} is already in use by another instance.`);
        console.error(`👉 Close the existing terminal running the backend or kill the process on port ${PORT}.\n`);
      } else {
        console.error(`\n❌ [Server Error] ${err.message}\n`);
      }
      process.exit(1);
    });

    // Graceful shutdown on nodemon restart (SIGUSR2) and termination
    process.once('SIGUSR2', () => {
      server.close(() => {
        process.kill(process.pid, 'SIGUSR2');
      });
    });
    process.on('SIGINT', () => {
      server.close(() => process.exit(0));
    });
    process.on('SIGTERM', () => {
      server.close(() => process.exit(0));
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
