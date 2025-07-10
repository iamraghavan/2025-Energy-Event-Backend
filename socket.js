const { Server } = require('socket.io');
const logger = require('./utils/logger');

module.exports = function (server) {
  const io = new Server(server, { cors: { origin: '*' } });

  io.on('connection', socket => {
    logger.info(`Socket connected: ${socket.id}`);
    socket.on('joinMatch', id => {
      socket.join(id);
      logger.info(`Joined match: ${id}`);
    });
    socket.on('leaveMatch', id => {
      socket.leave(id);
      logger.info(`Left match: ${id}`);
    });
    socket.on('disconnect', () => logger.info(`Socket disconnected: ${socket.id}`));
  });

  return io;
};
