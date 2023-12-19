import express from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  Todo,
  getAllTodos,
  addTodo,
  updateTodo,
  deleteTodo,
  validateTodo,
} from '../data/todo';
import { sendResponse } from '../middleware/response';
import { logger } from '../logger';

// Create Todo router with all routes then export it
const todoRouter = express.Router();

// Validation middleware
function validateRequestBody(req, res, next) {
  if (req.method !== 'PUT' && req.method !== 'POST') {
    next();
  }

  const { valid, error, todo } = validateTodo(req.body, true);
  if (!valid) {
    sendResponse(req, res, StatusCodes.BAD_REQUEST, {
      error: 'Invalid todo',
      details: error,
    });
    return;
  }
  req.todo = todo;
  next();
}
// Route handlers
function getAllTodosHandler(req, res) {
  const todos: Todo[] = getAllTodos();
  sendResponse(req, res, StatusCodes.OK, todos);
  return;
}
function addTodoHandler(req, res) {
  const addedTodo = addTodo(req.todo);
  sendResponse(req, res, StatusCodes.CREATED, addedTodo);
  return;
}

function updateTodoHandler(req, res) {
  const id: number = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    sendResponse(req, res, StatusCodes.BAD_REQUEST, { error: 'Invalid id' });
  }

  const updatedTodo: Todo | null = updateTodo(id, req.todo);
  if (updatedTodo) {
    sendResponse(req, res, StatusCodes.ACCEPTED, updatedTodo);
  } else {
    sendResponse(req, res, StatusCodes.NOT_FOUND, {
      error: `Todo not found:${id} `,
    });
  }
  return;
}
function deleteTodoHandler(req, res) {
  const id: number = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    sendResponse(req, res, StatusCodes.BAD_REQUEST, { error: 'Invalid id' });
    return;
  }

  const deletedTodo: number | null = deleteTodo(id);

  if (deletedTodo !== null) {
    sendResponse(req, res, StatusCodes.ACCEPTED, { id });
  } else {
    sendResponse(req, res, StatusCodes.NOT_FOUND, {
      error: `Todo not found:${id} `,
    });
  }
  return;
}
// Error handling middleware
function handleError(err, req, res) {
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
}
todoRouter.get('/', getAllTodosHandler);
todoRouter.post('/', validateRequestBody, addTodoHandler);
todoRouter.put('/:id', validateRequestBody, updateTodoHandler);
todoRouter.delete('/:id', deleteTodoHandler);

// Catch-all route
todoRouter.all('*', (req, res) => {
  sendResponse(req, res, StatusCodes.NOT_FOUND, { error: 'Not Found' });
  return;
});
todoRouter.use(handleError);

// Export the router
export default todoRouter;
