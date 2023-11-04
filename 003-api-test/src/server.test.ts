import request from 'supertest';
import app from './server';

describe('GET /todos', () => {
  it('responds with json', async () => {
    const response = await request(app).get('/todos');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          title: expect.any(String),
        }),
      ])
    );
  });
});

describe('POST /todos', () => {
  it('responds with the posted todo', async () => {
    const todo = { title: 'Test Todo' };
    const response = await request(app).post('/todos').send(todo);
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        title: 'Test Todo',
      })
    );
  });
});

describe('PUT /todos/:id', () => {
  it('updates the todo with the given id', async () => {
    const todo = { title: 'Updated Todo' };
    const response = await request(app).put('/todos/1').send(todo);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: 1,
        title: 'Updated Todo',
      })
    );
  });
});

describe('DELETE /todos/:id', () => {
  it('deletes the todo with the given id', async () => {
    const response = await request(app).delete('/todos/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining([{ id: 1, title: 'Updated Todo' }])
    );
  });
});
