import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '../../middleware/response';
import { CrudServiceResponse } from '../../data/types';
import { Todo } from '../../data/todo.types';

async function getAllTodosHandler(req, res) {
  try {
    if (req?.app?.locals?.db) {
      const { data, error }: CrudServiceResponse<Todo[]> =
        await req.app.locals.db.todo.getAll();
      if (error) {
        sendResponse(req, res, StatusCodes.BAD_REQUEST, { data, error });
        return;
      } else {
        sendResponse(req, res, StatusCodes.OK, { data, error: null });
        return;
      }
    } else {
      sendResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, {
        data: null,
        error: 'db is null',
      });
      return;
    }
  } catch (error) {
    sendResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, {
      error,
      data: null,
    });
    return;
  }
}
async function deleteAllTodoHandler(req, res) {
  try {
    if (req.app.locals.db) {
      const { data, error } = await req.app.locals.db.todo.deleteAll();
      if (error) {
        sendResponse(req, res, StatusCodes.ACCEPTED, { data, error });
      } else {
        sendResponse(req, res, StatusCodes.ACCEPTED, { data, error });
      }
      return;
    } else {
      sendResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, {
        data: null,
        error: 'db is null',
      });
      return;
    }
  } catch (error) {
    sendResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, {
      data: null,
      error,
    });
    return;
  }
}
async function batchUploadTodoHandler(req, res) {
  try {
    const { todos } = req?.body;
    if (!todos || todos.length === 0) {
      sendResponse(req, res, StatusCodes.BAD_REQUEST, {
        data: null,
        error: 'Invalid todos',
      });
      return;
    }

    if (req.app.locals.db) {
      const { data, error } = await req.app.locals.db.todo.seed(req.body.todos);
      if (error) {
      } else {
        sendResponse(req, res, StatusCodes.CREATED, { data, error });
        return;
      }
    } else {
      sendResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, {
        data: null,
        error: 'db is null',
      });
      return;
    }
  } catch (error) {
    sendResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, { error });
    return;
  }
}

export { getAllTodosHandler, deleteAllTodoHandler, batchUploadTodoHandler };
