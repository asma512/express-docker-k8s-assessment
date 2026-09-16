require('dotenv').config();

const app = require('./app');
const { connectDB } = require('./config/db');

const PORT = Number(process.env.PORT || 3000);

const startServer = async () => {
  const connected = await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    if (!connected) {
      console.warn('Application started without MongoDB connectivity; database-dependent endpoints will be unavailable until MongoDB is reachable.');
    }
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Stop the other process or change PORT.`);
      process.exit(1);
    }

    console.error('Server startup error:', error.message);
    process.exit(1);
  });

  const shutdown = () => {
    server.close(() => {
      console.log('Server shutdown complete');
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
};

startServer();
