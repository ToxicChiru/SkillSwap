const mongoose = require('mongoose');

let mongoMemoryServer = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skillswap';
  
  try {
    // Attempt standard connection with 3-second timeout
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
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
      console.log('💡 Note: Data will be persisted in RAM for this session. Configure MONGODB_URI in .env for persistent Atlas storage.');
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
