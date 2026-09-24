const mongoose = require('mongoose');
const dns = require('dns');

// Fix for Windows / Node.js querySrv ECONNREFUSED when resolving MongoDB Atlas SRV records
// Configure reliable DNS servers (Google & Cloudflare) to ensure SRV record resolution works on all ISPs/routers
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {
  // If system prevents overriding DNS servers, continue with defaults
}

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/veloop_rewards';

    const conn = await mongoose.connect(mongoUri, {
      dbName: 'veloop_rewards',
    });

    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[Database Error] Failed to connect to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
