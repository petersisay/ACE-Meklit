const mongoose = require('mongoose');

let mongodInstance = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ace_meklit';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000,
    });
    console.log(`[MongoDB] Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (primaryError) {
    console.warn(`[MongoDB] Primary connection to ${uri} failed: ${primaryError.message}`);

    // In development or test, try in-memory MongoDB server fallback
    if (process.env.NODE_ENV !== 'production') {
      try {
        console.log('[MongoDB] Attempting in-memory MongoDB fallback for local development...');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        mongodInstance = await MongoMemoryServer.create();
        const memoryUri = mongodInstance.getUri();
        const conn = await mongoose.connect(memoryUri);
        console.log(`[MongoDB] Connected to in-memory instance: ${memoryUri}`);
        return conn;
      } catch (fallbackError) {
        console.error('[MongoDB] In-memory fallback also failed:', fallbackError.message);
      }
    }

    console.error('[MongoDB] Unable to connect to MongoDB. Please ensure MongoDB is running or provide a valid MONGODB_URI in server/.env');
    throw primaryError;
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongodInstance) {
    await mongodInstance.stop();
  }
};

module.exports = { connectDB, disconnectDB };
