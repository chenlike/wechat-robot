  
import { createLogger, format, transports }  from "winston"
import 'winston-daily-rotate-file'


const LOG_PATH = __dirname  + "/logs/"
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),

  transports: [
    new transports.DailyRotateFile({
      filename: LOG_PATH + 'error/%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level:'error'
    }),
    new transports.DailyRotateFile({
      filename: LOG_PATH + 'info/%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '90d',
    })
  ]
});

logger.add(new transports.Console({
  format: format.combine(
    format.colorize(),
    format.simple()
  )
}));


process.on("uncaughtException", function (err) {
  logger.error(err);
});
process.on("unhandledRejection", (reason, p) => {
  logger.error(reason);
  logger.error(p);
});
export default logger