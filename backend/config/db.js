const mongoose = require('mongoose');
const dns = require('dns');
require('dotenv').config();

// On Windows, local ISP DNS often fails SRV lookups for mongodb+srv with querySrv ECONNREFUSED.
// Set reliable DNS servers (Google / Cloudflare) to ensure seamless Atlas SRV resolution.
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore if custom DNS cannot be configured in environment
}

let mongoMemoryServer = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mini_project';
  
  try {
    // Connect to MongoDB Atlas / primary database
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`✅ MongoDB Connected successfully!`);
    console.log(`📡 Host: ${conn.connection.host}`);
    console.log(`📦 Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.warn(`⚠️ Could not connect to primary MongoDB at ${uri}: ${error.message}`);
    console.log('🔄 Attempting fallback to in-memory MongoDB for zero-config development...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create();
      const memoryUri = mongoMemoryServer.getUri();
      
      const conn = await mongoose.connect(memoryUri);
      console.log(`✅ Connected to in-memory MongoDB at ${memoryUri}`);
      console.log('💡 Note: Data will be persisted in RAM for this session. Check MONGODB_URI in .env for persistent Atlas storage.');
      return conn;
    } catch (memError) {
      console.error('❌ Failed to start in-memory MongoDB fallback:', memError.message);
      process.exit(1);
    }
  }
};

const closeDB = async () => {
  await mongoose.connection.close();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};

module.exports = { connectDB, closeDB };
