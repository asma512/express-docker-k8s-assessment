const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/bookshelf';
let memoryServerInstance = null;

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
      memoryServerInstance = await MongoMemoryServer.create();
      uri = memoryServerInstance.getUri();
      console.log(`Using in-memory MongoDB: ${uri}`);
    }

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    return mongoose.connection.readyState === 1;
  } catch (error) {
    const fallbackEnabled = !process.env.MONGO_URI || /localhost|127\.0\.0\.1/.test(process.env.MONGO_URI || '');

    if (fallbackEnabled) {
      try {
        if (!memoryServerInstance) {
          memoryServerInstance = await MongoMemoryServer.create();
        }

        const fallbackUri = memoryServerInstance.getUri();
        console.warn(`MongoDB unavailable at ${mongoUri}. Falling back to in-memory MongoDB: ${fallbackUri}`);
        await mongoose.connect(fallbackUri, {
          serverSelectionTimeoutMS: 5000,
        });

        return mongoose.connection.readyState === 1;
      } catch (fallbackError) {
        console.error('In-memory MongoDB fallback failed:', fallbackError.message);
        return false;
      }
    }

    console.error('MongoDB connection error:', error.message);
    return false;
  }
};

module.exports = { connectDB, mongoUri };
