import express from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  getAllTodosHandler,
  deleteAllTodoHandler,
  batchUploadTodoHandler,
} from './todos.handlers';
import { handleError } from '../handlers/global.handlers';
import { sendResponse } from '../../middleware/response';

// Create Todo router with all routes then export it
const todosRouter = express.Router();

todosRouter.get('/', getAllTodosHandler);
todosRouter.patch('/', batchUploadTodoHandler);
todosRouter.delete('/', deleteAllTodoHandler);

// Catch-all route
todosRouter.all('*', (req, res) => {
  sendResponse(req, res, StatusCodes.NOT_FOUND, { error: 'Not Found' });
  return;
});
todosRouter.use(handleError);

// Export the router
export default todosRouter;
