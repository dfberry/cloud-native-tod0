import winston, { Logger } from 'winston';
import path from 'path';
let logger: Logger;

const logPath = path.join(__dirname, process.env.LOG_PATH || '../logs');

const winstonSimple = {
  format: winston.format.simple(),
};

const winstonComplete = {
  level: process.env.LOGLEVEL || 'debug',
  format: winston.format.json(),
  defaultMeta: { service: 'todo-service' },
  transports: [
    new winston.transports.File({ filename: logPath + '/combined.log' }),
  ],
};

const mockLogger = {
  info: () => {},
  error: () => {},
  warn: () => {},
  debug: (x) => console.log(x),
  verbose: (x) => console.log(x),
};

const env = process.env.NODE_ENV || 'development';

switch (env) {
  case 'development':
    logger = winston.createLogger(winstonComplete);
    logger.add(new winston.transports.Console(winstonSimple));
    break;
  case 'production':
    logger = winston.createLogger(winstonComplete);
    break;
  case 'test':
  case 'testwithlogs':
    logger = mockLogger as unknown as Logger;
    break;
  default:
    logger = mockLogger as unknown as Logger;
}

export { logger };
