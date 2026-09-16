const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/bookshelf';

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected successfully');
});

mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error.message);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected');
});

const connectDB = async () => {
  try {
    let uri = mongoUri;

    if (!process.env.MONGO_URI) {
      const memoryServer = await MongoMemoryServer.create();
      uri = memoryServer.getUri();
      console.log(`Using in-memory MongoDB: ${uri}`);
    }

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    return mongoose.connection.readyState === 1;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    return false;
  }
};

module.exports = { connectDB, mongoUri };
