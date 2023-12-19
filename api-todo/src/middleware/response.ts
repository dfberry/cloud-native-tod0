import { logger } from '../logger';
export function logRequest(req, _, next) {
  logger.info(`Request ${req.method} ${req.path}`);
  next();
}
export function sendResponse(req, res, status, body) {
  const message = `Response ${req.method} ${
    req.path
  } ${status}: ${JSON.stringify(body)}`;

  if (status >= 500) {
    logger.error(message);
  } else if (status >= 400) {
    logger.warn(message);
  } else {
    logger.info(message);
  }

  res.status(status).json(body);
}
