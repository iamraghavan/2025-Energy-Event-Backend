require('dotenv').config();
const http = require('http');
const app = require('./app');
const socketInit = require('./socket');
const connectDB = require('./config/db');
const logger = require('./utils/logger.js');

// 1. Create HTTP server
const server = http.createServer(app);

// 2. Initialize Socket.IO and attach to server
const io = socketInit(server);

// ✅ 3. Attach Socket.IO instance to app so it can be used in controllers
app.set('io', io); // ✅ Add this line here

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
