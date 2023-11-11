import winston, { Logger } from 'winston';

let logger: Logger;

if (process.env.NODE_ENV !== 'test') {
  logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'todo-service' },
    transports: [
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' }),
    ],
  });

  if (process.env.NODE_ENV !== 'production') {
    logger.add(
      new winston.transports.Console({
        format: winston.format.simple(),
      })
    );
  }
}

function logRequest(req, res, next) {
  const { method, url } = req;
  const logMessage = `Request: ${method} ${url}`;

  logger.info(logMessage);
  next();
}

function logResponse(req, res, next) {
  res.on('finish', () => {
    const { statusCode } = res;
    const logMessage = `Response: ${statusCode} ${res.statusMessage}`;

    if (statusCode >= 500) {
      logger.error(logMessage);
    } else if (statusCode >= 400) {
      logger.warn(logMessage);
    } else {
      logger.info(logMessage);
    }
  });

  next();
}

export { logger, logRequest, logResponse };
