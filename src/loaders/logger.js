const { format, transports, createLogger } = require('winston');

const customFormat = format.printf(
  ({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`
);

const logger = createLogger({
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.timestamp(),
        customFormat
      )
    })
  ]
});

module.exports = { logger };
