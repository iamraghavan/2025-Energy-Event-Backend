require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const app = require('./app');

const PORT = process.env.PORT || 8000;

// Create HTTP server
const server = http.createServer(app);

// Create Socket.IO server
const io = new Server(server, {
  cors: { origin: '*' }
});

// Make io available to all routes via req.io
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Generic Socket.IO event handlers
io.on('connection', (socket) => {
  console.log('New client connected');

  // Universal match join — works for Kabaddi, Volleyball, Football, etc.
  socket.on('joinMatch', (matchId) => {
    socket.join(matchId);
    console.log(`Client joined match room: ${matchId}`);
  });

  socket.on('leaveMatch', (matchId) => {
    socket.leave(matchId);
    console.log(`Client left match room: ${matchId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Connect DB and start server
(async () => {
  try {
    await connectDB();
    server.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();
