import { logger } from '../../logger';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '../../middleware/response';
import { Request, Response } from 'express';
import { HttpError } from '../types';
// Error handling middleware
export function handleError(err, req, res) {
  try {
    // TODO: dfberry 2023-12-19 this is never hit
    logger.error(err);
    logger.error(
      `Todo error handler - ${req.method} ${req.path} error ${JSON.stringify(
        err
      )}`
    );
    logger.info(
      `Todo error handler - ${req.method} ${req.path} error ${JSON.stringify(
        err
      )}`
    );
    sendResponse(req, res, err.status || 500, { error: err.message });
    return;
  } catch (error) {
    sendResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, { error });
    return;
  }
}
export function handle404(err: HttpError, req: Request, res: Response) {
  // Set locals, only providing error in development
  logger.error(`${req.method} ${req.path} error ${JSON.stringify(err)}`);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  logger.error(`Server error hande - ${err.message}`);
  sendResponse(req, res, err.status || 500, { error: err.message });
  return;
}
