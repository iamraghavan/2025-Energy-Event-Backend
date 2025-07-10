const { createLogger, format, transports } = require('winston');
const { combine, timestamp, errors, json, printf, colorize } = format;

const isDev = process.env.NODE_ENV !== 'production';

const devFormat = printf(({ level, message, timestamp, stack }) => {
  return `[${timestamp}] ${level}: ${stack || message}`;
});

const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    errors({ stack: true }),
    isDev ? devFormat : json()
  ),
  transports: [
    new transports.Console({
      format: isDev ? combine(colorize(), devFormat) : json(),
    }),
  ],
  exitOnError: false,
});

module.exports = logger;
