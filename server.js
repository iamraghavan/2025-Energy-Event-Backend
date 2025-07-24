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

     setTimeout(() => {
  setInterval(() => {
    fetch(`http://localhost:${PORT}/ping`)
      .then(res => {
        if (res.ok) {
          logger.info(`[Keep-Alive] Self-ping OK: ${res.status} ${res.statusText}`);
        } else {
          logger.warn(`[Keep-Alive] Self-ping failed: ${res.status} ${res.statusText}`);
        }
      })
      .catch(err => logger.error('[Keep-Alive] Ping error:', err.message));
  }, 60 * 1000); // Every 1 minute
}, 10 * 1000); // Delay to ensure server is fully started



      
    });
  } catch (err) {
    logger.error('Failed to start the server:', err);
    process.exit(1);
  }
})();
