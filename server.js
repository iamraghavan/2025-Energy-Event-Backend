require('dotenv').config();
const http = require('http');
const app = require('./app');
const socketInit = require('./socket');
const connectDB = require('./config/db');
const logger = require('./utils/logger.js');

const server = http.createServer(app);
const io = socketInit(server); // Socket.IO setup

const PORT = parseInt(process.env.PORT, 10) || 8000;

(async () => {
  try {
    await connectDB();
    server.listen(PORT, () =>
      logger.info(`Server running at http://localhost:${PORT}`)
    );
  } catch (err) {
    logger.error('Failed to start the server:', err);
    process.exit(1);
  }
})();
