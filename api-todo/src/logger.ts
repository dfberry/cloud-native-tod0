import winston, { Logger } from 'winston';
import path from 'path';
let logger: Logger;

const logPath = path.join(__dirname, process.env.LOG_PATH || '../logs');

if (process.env.NODE_ENV !== 'test') {
  logger = winston.createLogger({
    level: process.env.LOGLEVEL || 'debug',
    format: winston.format.json(),
    defaultMeta: { service: 'todo-service' },
    transports: [
      new winston.transports.File({ filename: logPath + '/combined.log' }),
    ],
  });
  if (process.env.NODE_ENV !== 'production') {
    logger.add(
      new winston.transports.Console({
        format: winston.format.simple(),
      })
    );
  }
} else {
  const mockLogger = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  };
  logger = mockLogger as unknown as Logger;
}

export { logger };
