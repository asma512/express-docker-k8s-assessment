require('dotenv').config();

const app = require('./app');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  const connected = await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    if (!connected) {
      console.warn('Application started without MongoDB connectivity; database-dependent endpoints will be unavailable until MongoDB is reachable.');
    }
  });
};

startServer();
