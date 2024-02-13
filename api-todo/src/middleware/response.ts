import { logger } from '../logger';
export function logRequest(req, _, next) {
  logger.info(`Request ${req.method} ${req.path} ${JSON.stringify(req.body)}`);
  next();
}
export function sendResponse(req, res, status, body) {
  const message = `Response ${req.method} ${
    req.path
  } ${status}: ${JSON.stringify(body)}`;

  const { data, error } = body;

  logger.info(error);
  logger.info(data);

  if (status >= 500) {
    logger.error(message);
  } else if (status >= 400) {
    logger.warn(message);
  } else {
    logger.info(message);
  }

  const returnBody = {
    data: !data ? null : data,
    error: !error
      ? null
      : process.env.NODE_ENV === 'development'
        ? error.stack
        : typeof error === 'string'
          ? error
          : error.message,
  };

  res.status(status).json(returnBody);
}
