const mockRequest = (sessionData, body) => ({
  session: { data: sessionData },
  body,
  params: {
    id: null,
  },
});

type Res = {
  status?: (code: number) => object;
  json?: (data: unknown) => object;
};

const mockResponse = () => {
  const res: Res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

import {
  getTodoHandler,
  updateTodoHandler,
  addTodoHandler,
} from './todo.handlers'; // import your handlers

describe('getTodoHandler incoming params', () => {
  let req;
  let res;

  beforeEach(() => {
    req = mockRequest({}, {});
    res = mockResponse();
  });
  test('getTodo by id with null id will return 400', async () => {
    req.params.id = null;
    req.body = null;

    await getTodoHandler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      data: null,
      error: 'Invalid id',
    });
  });
  test('addTodo with null todo will return 400', async () => {
    req.body = {
      todo: null,
    };

    await addTodoHandler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      data: null,
      error: 'Invalid todo',
    });
  });
  test('updateTodo with null id will return 400', async () => {
    req.params.id = null;
    req.body = {
      todo: {
        id: null,
        title: 'test title',
        description: 'test description',
        createdAt: '2021-09-01T00:00:00.000Z',
        updatedAt: null,
      },
    };

    await updateTodoHandler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      data: null,
      error: 'Invalid id',
    });
  });
  test('updateTodo with null todo will return 400', async () => {
    req.params.id = '123';
    req.body = {
      todo: null,
      data: {},
    };

    await updateTodoHandler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      data: null,
      error: 'Invalid id',
    });
  });
});
