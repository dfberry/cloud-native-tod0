import express from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  getTodoHandler,
  addTodoHandler,
  deleteTodoHandler,
  updateTodoHandler,
} from './todo.handlers';
import { handleError } from '../handlers/global.handlers';
import { sendResponse } from '../../middleware/response';

// Create Todo router with all routes then export it
const todoRouter = express.Router();

todoRouter.get('/:id', getTodoHandler);
todoRouter.post('/', addTodoHandler);
todoRouter.put('/:id', updateTodoHandler);
todoRouter.delete('/:id', deleteTodoHandler);

// Catch-all route
todoRouter.all('*', (req, res) => {
  sendResponse(req, res, StatusCodes.NOT_FOUND, { error: 'Not Found' });
  return;
});
todoRouter.use(handleError);

// Export the router
export default todoRouter;
