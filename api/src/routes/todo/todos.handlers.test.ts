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

import { batchUploadTodoHandler } from './todos.handlers'; // import your handlers

describe('getTodoHandler incoming params', () => {
  let req;
  let res;

  beforeEach(() => {
    req = mockRequest({}, {});
    res = mockResponse();
  });
  test('batchUploadTodo with null todos will return 400', async () => {
    req.body = {
      todos: null,
    };

    await batchUploadTodoHandler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      data: null,
      error: 'Invalid todos',
    });
  });
  test('batchUploadTodo with empty array will return 400', async () => {
    req.body = {
      todos: [],
    };

    await batchUploadTodoHandler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      data: null,
      error: 'Invalid todos',
    });
  });
});
