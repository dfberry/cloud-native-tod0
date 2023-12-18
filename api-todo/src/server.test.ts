import request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import { initialData, setTodos } from './data/todo';

import app from './server';

const regexTodoNotFound = /Todo not found/;
const INVALID_TODO_ERROR = { error: 'Invalid todo' };
const INVALID_ID_ERROR = { error: 'Invalid id' };
const TODO_NOT_FOUND_ERROR = {
  error: expect.stringMatching(regexTodoNotFound),
};

describe('todo', () => {
  describe('GET /todo', () => {
    beforeEach(() => {
      setTodos(initialData);
    });

    it('responds with json', async () => {
      const response = await request(app).get('/todo');
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            title: expect.any(String),
          }),
        ])
      );
    });
    it('responds with 404 when GET /id', async () => {
      const response = await request(app).get('/todo/1');
      expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
    });
  });

  describe('POST /todo', () => {
    it('responds with the posted todo', async () => {
      const todo = { title: 'Test Todo' };
      const response = await request(app).post('/todo').send(todo);
      expect(response.statusCode).toBe(StatusCodes.CREATED);
      expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          title: 'Test Todo',
        })
      );
    });
    it('responds with the error', async () => {
      const todo = { title: '' };
      const response = await request(app).post('/todo').send(todo);
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual(
        expect.objectContaining(INVALID_TODO_ERROR)
      );
    });
    it('responds with the error when title has over 1000k', async () => {
      const todo = { title: 'a'.repeat(1001) };
      const response = await request(app).post('/todo').send(todo);
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual(
        expect.objectContaining(INVALID_TODO_ERROR)
      );
    });
    it('responds with the error when Todo has extra properties', async () => {
      setTodos(initialData);
      const todo = { title: 'hello', id: 5, note: 'help me' };
      const response = await request(app).post('/todo').send(todo);
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual(
        expect.objectContaining(INVALID_TODO_ERROR)
      );
    });
  });

  describe('PUT /todo/:id', () => {
    beforeEach(() => {
      setTodos(initialData);
    });

    it('updates the todo with the given id', async () => {
      setTodos(initialData);

      // id in this case is ignored
      const todo = { id: 1, title: 'Updated Todo' };

      const response = await request(app).put('/todo/1').send(todo);
      expect(response.statusCode).toBe(StatusCodes.ACCEPTED);
      expect(response.body).toEqual(
        expect.objectContaining({
          // partial match of title string
          title: 'Updated Todo',
        })
      );
    });
    it('responds with the error when malformed Todo', async () => {
      setTodos(initialData);
      const todo = { title: '', id: 'dog' };
      const response = await request(app).put('/todo/2').send(todo);
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual(
        expect.objectContaining(INVALID_TODO_ERROR)
      );
    });
    it('responds with the error when id not found', async () => {
      setTodos(initialData);
      const todo = { title: 'This is a test', id: 2 };
      const response = await request(app).put('/todo/100').send(todo);
      expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
      expect(response.body).toEqual(
        expect.objectContaining(TODO_NOT_FOUND_ERROR)
      );
    });
    it('responds with the error when Todo has extra properties', async () => {
      setTodos(initialData);
      const todo = { title: '', id: 100, note: 'help me' };
      const response = await request(app).put('/todo/2').send(todo);
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual(
        expect.objectContaining(INVALID_TODO_ERROR)
      );
    });
    it('responds with the error when title has over 1000k', async () => {
      const todo = { title: 'a'.repeat(1001) };
      const response = await request(app).put('/todo/2').send(todo);
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual(
        expect.objectContaining(INVALID_TODO_ERROR)
      );
    });
  });
  describe('DELETE /todo/:id', () => {
    beforeEach(() => {
      setTodos(initialData);
    });

    it('deletes the todo with the given id', async () => {
      const response = await request(app).delete('/todo/1');
      expect(response.statusCode).toBe(StatusCodes.ACCEPTED);
      expect(response.body).toEqual(expect.objectContaining({ id: 1 }));
    });
    it('responds with the error when malformed id', async () => {
      const response = await request(app).delete('/todo/dog');
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual(expect.objectContaining(INVALID_ID_ERROR));
    });
    it('responds with the error when id not found', async () => {
      const response = await request(app).delete('/todo/100');
      expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
      expect(response.body).toEqual(
        expect.objectContaining(TODO_NOT_FOUND_ERROR)
      );
    });
  });
});
