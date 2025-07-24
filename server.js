require('dotenv').config();
const http = require('http');
const app = require('./app');
const socketInit = require('./socket');
const connectDB = require('./config/db');
const logger = require('./utils/logger');

// Import fetch dynamically for self-ping
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// Create HTTP server and initialize Socket.IO
const server = http.createServer(app);
const io = socketInit(server);
app.set('io', io); // Attach io to app for use in controllers

const PORT = parseInt(process.env.PORT, 10) || 8000;

(async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      logger.info(`Server running at http://localhost:${PORT}`);

      // Keep-alive ping to prevent Render free tier from sleeping
      setInterval(() => {
        fetch('https://two025-energy-event-backend.onrender.com/ping')
          .then(() => logger.info('[Keep-Alive] Ping sent to Render'))
          .catch(err => logger.error('[Keep-Alive] Ping failed:', err.message));
      }, 60 * 1000); // every 1 minute
    });
  } catch (err) {
    logger.error('Failed to start the server:', err);
    process.exit(1);
  }
})();
