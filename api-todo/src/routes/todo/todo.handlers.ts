import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '../../middleware/response';
//import { CrudServiceResponse } from '../../data/types';
//import { Todo } from '../../data/todo.types';

// Route handlers
async function getTodoHandler(req, res) {
  try {
    const id = req.params.id;
    if (!id) {
      sendResponse(req, res, StatusCodes.BAD_REQUEST, {
        data: null,
        error: 'Invalid id',
      });
      return;
    }

    if (req?.app?.locals?.db) {
      const { data, error } = await req.app.locals.db.todo.get(id);
      if (error) {
        sendResponse(req, res, StatusCodes.BAD_REQUEST, {
          data: null,
          error,
        });
      } else {
        sendResponse(req, res, StatusCodes.ACCEPTED, {
          data: data,
          error: null,
        });
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
      data: null,
      error,
    });
    return;
  }
}
async function addTodoHandler(req, res) {
  try {
    const todo = req?.body?.todo;

    if (!todo) {
      sendResponse(req, res, StatusCodes.BAD_REQUEST, {
        data: null,
        error: 'Invalid todo',
      });
      return;
    }

    if (req.app.locals.db) {
      const { data, error } = await req.app.locals.db.todo.add(req.body.todo);
      if (error) {
        sendResponse(req, res, StatusCodes.BAD_REQUEST, {
          data: null,
          error,
        });
      } else {
        sendResponse(req, res, StatusCodes.CREATED, { data, error });
      }
    } else {
      sendResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, {
        data: null,
        error: 'db is null',
      });
    }
  } catch (error) {
    sendResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, {
      data: null,
      error,
    });
    return;
  }
}

async function updateTodoHandler(req, res) {
  try {
    const id = req.params.id;
    const todo = req?.body?.todo;
    if (!id || !todo) {
      sendResponse(req, res, StatusCodes.BAD_REQUEST, {
        data: null,
        error: 'Invalid id',
      });
      return;
    }

    if (req.app.locals.db) {
      const { data, error } = await req.app.locals.db.todo.update(
        id,
        req.body.todo
      );
      if (error) {
        sendResponse(req, res, StatusCodes.BAD_REQUEST, {
          data: null,
          error,
        });
      } else {
        sendResponse(req, res, StatusCodes.ACCEPTED, { data, error });
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
      data: null,
      error,
    });
    return;
  }
}
async function deleteTodoHandler(req, res) {
  try {
    const id = req.params.id;
    if (!id) {
      sendResponse(req, res, StatusCodes.BAD_REQUEST, {
        data: null,
        error: 'Invalid id',
      });
      return;
    }

    if (req.app.locals.db) {
      const { data, error } = await req.app.locals.db.todo.delete(id);
      if (error) {
        sendResponse(req, res, StatusCodes.BAD_REQUEST, {
          data: null,
          error,
        });
      } else {
        sendResponse(req, res, StatusCodes.ACCEPTED, {
          data,
          error,
        });
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

export { getTodoHandler, addTodoHandler, updateTodoHandler, deleteTodoHandler };
