import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { handleError } from './handlers/global.handlers';
import { sendResponse } from '../middleware/response';

// Create Todo router with all routes then export it
const router = express.Router();

// Password changes on each deployment
router.all('*', (req, res) => {
  const isCorrectPassword =
    (req.query.password || '') === process.env.API_STATUS_PASSWORD;

  if (isCorrectPassword) {
    const envVars = process.env;

    sendResponse(req, res, StatusCodes.OK, {
      data: envVars,
      error: null,
    });
    return;
  }
  sendResponse(req, res, StatusCodes.NOT_FOUND, {
    data: null,
    error: 'Status: Incorrect password',
  });
  return;
});
router.use(handleError);

// Export the router
export default router;
