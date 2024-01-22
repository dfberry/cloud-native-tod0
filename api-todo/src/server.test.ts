import request from 'supertest';
import configureApp from './server'; // Import your Express app
import 'dotenv/config';

//write a function to test the shape of a Todo
const testTodoShape = (todo) => {
  const keys = Object.keys(todo);

  expect(keys.length).toEqual(5);
  expect(keys).toContainEqual('id');
  expect(keys).toContainEqual('title');
  expect(keys).toContainEqual('description');
  expect(keys).toContainEqual('createdAt');
  expect(keys).toContainEqual('updatedAt');
};
const testTodoArrayShape = (todos) => {
  expect(todos).toBeInstanceOf(Array);
  todos.forEach(testTodoShape);
};

const testAdd = (addResponse) => {
  // operational error
  expect(addResponse.error).toEqual(false);

  const { status, body } = addResponse;
  expect(status).toEqual(201);
  const { data, error } = body;
  expect(error).toEqual(null);
  expect(data).not.toEqual(null);
  testTodoShape(data);
};

const testUpdate = (updateResponse) => {
  // operational error
  expect(updateResponse.error).toEqual(false);

  const { status, body } = updateResponse;
  expect(status).toEqual(202);
  const { data, error } = body;
  expect(error).toEqual(null);
  expect(data).not.toEqual(null);
  testTodoShape(data);
};

const testDelete = (deleteResponse) => {
  // operational error
  expect(deleteResponse.error).toEqual(false);

  const { status, body } = deleteResponse;
  expect(status).toEqual(202);
  const { data, error } = body;
  expect(error).toEqual(null);
  expect(data).not.toEqual(null);
  testTodoShape(data);
};

const testBatch = (batchResponse) => {
  // operational error
  expect(batchResponse.error).toEqual(false);

  const { status, body } = batchResponse;
  expect(status).toEqual(201);
  const { data, error } = body;
  expect(error).toEqual(null);
  expect(data).not.toEqual(null);
  testTodoArrayShape(data);
};

const testGetAll = (getAllResponse, dataLength) => {
  // operational error
  expect(getAllResponse.error).toEqual(false);

  const { status, body } = getAllResponse;
  expect(status).toEqual(200);
  const { data, error } = body;
  expect(error).toEqual(null);
  expect(data).not.toEqual(null);
  expect(data.length).toEqual(dataLength);
  testTodoArrayShape(data);
};

const testDeleteAll = (deleteAllResponse, dataLength) => {
  // operational error
  expect(deleteAllResponse.error).toEqual(false);

  const { status, body } = deleteAllResponse;
  expect(status).toEqual(202);
  const { data, error } = body;
  expect(error).toEqual(null);
  expect(data).not.toEqual(null);
  expect(data.deletedCount).toEqual(dataLength);
};

describe('Todo API against running MongoDB', () => {
  it('test all todo routes', async () => {
    process.env.NODE_ENV = 'test';

    const { app, connection } = await configureApp();
    await request(app).delete('/todos');

    // Add one
    const addOneResponse = await request(app)
      .post('/todo')
      .send({
        todo: {
          title: 'Sa1 - ' + Date.now(),
          description: 'Sa2 - ' + Date.now(),
        },
      });
    testAdd(addOneResponse);

    // // Update one
    const updateOneResponse = await request(app)
      .put('/todo/' + addOneResponse.body.data.id)
      .send({
        todo: {
          title: 'Su1 - ' + Date.now(),
          description: 'su2 ' + Date.now(),
        },
      });
    testUpdate(updateOneResponse);

    // // Delete `Sa1`, `Su1` should still be there
    const deletedOneResponse = await request(app).delete(
      '/todo/' + addOneResponse.body.data.id
    );
    testDelete(deletedOneResponse);

    // Batch all - after this call 3 items should be in the database
    // 3 B
    const addThreeBody = {
      todos: [
        {
          title: 'B1a ' + Date.now(),
          description: 'B1b' + Date.now(),
        },
        {
          title: 'B2a' + Date.now(),
          description: 'B2b' + Date.now(),
        },
        {
          title: 'B3a' + Date.now(),
          description: 'B3b' + Date.now(),
        },
      ],
    };
    const batchResponse = await request(app).patch('/todos').send(addThreeBody);
    testBatch(batchResponse);

    // // Get All - should return four items
    const getAllResponse = await request(app).get('/todos');
    testGetAll(getAllResponse, 3);

    // Delete All
    const deleteAllResponse = await request(app).delete('/todos');
    testDeleteAll(deleteAllResponse, 3);

    if (connection) {
      connection.close();
    }
  }, 30000);
});
