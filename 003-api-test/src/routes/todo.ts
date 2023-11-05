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

// Create Todo router with all routes then export it
const todoRouter = express.Router();

// Error handling middleware
function handleError(err, _, res) {
  console.error(err);
  res.status(500).send('Something broke!');
}
// Validation middleware
function validateRequestBody(req, res, next) {
  const { valid, error, todo } = validateTodo(req.body, true);
  if (!valid) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: 'Invalid todo', details: error });
  }
  req.todo = todo;
  next();
}
// Route handlers
function getAllTodosHandler(__, res) {
  const todos: Todo[] = getAllTodos();
  res.status(StatusCodes.OK).json(todos);
}
function addTodoHandler(req, res) {
  const addedTodo = addTodo(req.todo);
  res.status(StatusCodes.CREATED).json(addedTodo);
}

function updateTodoHandler(req, res) {
  const id: number = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid id' });
  }

  const updatedTodo: Todo | null = updateTodo(id, req.todo);
  if (updatedTodo) {
    return res.status(StatusCodes.ACCEPTED).json(updatedTodo);
  } else {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: `Todo not found:${id} ` });
  }
}
function deleteTodoHandler(req, res) {
  const id: number = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid id' });
  }

  const deletedTodo: number | null = deleteTodo(id);

  if (deletedTodo !== null) {
    return res.status(StatusCodes.ACCEPTED).json({ id });
  } else {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: `Todo not found:${id} ` });
  }
}
todoRouter.get('/', getAllTodosHandler);
todoRouter.post('/', validateRequestBody, addTodoHandler);
todoRouter.put('/:id', validateRequestBody, updateTodoHandler);
todoRouter.delete('/:id', deleteTodoHandler);
todoRouter.use(handleError);

// Export the router
export default todoRouter;
