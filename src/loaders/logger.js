const { createLogger, format, transports } = require('winston');
const config = require('config');

const logger = createLogger({
  level: config.logs.level,
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: [
    new transports.File({ filename: 'wot-a-bot-error.log', level: 'error' }),
    new transports.File({ filename: 'wot-a-bot.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.simple()
    )
  }));
}

module.exports = logger;
