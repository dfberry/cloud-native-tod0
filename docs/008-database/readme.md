# Add database to the project

The goal of **iteration 008** is to add a database to the project. 

At this point, it doesn't matter if it is no-SQL, or SQL-based because there are no relationships or transactions. Someone suggested I look at Prisma for my ORM. After some testing, I realized a free Azure SQL database wasn't going to work because, Prisma requires a 2nd database, although only temporarily, for diffing the migrations. 

While I'm sure Prisma has its purpose, at this stage of the project, it seems like overkill compared to adding a database and client library I'm more familiar with. A point in the project where boring is good. 

Since I'm already on Azure, selecting some flavor of SQL Server or Cosmos DB makes sense if there is a consumption (pay-as-you-go) pricing tier (SKU) which is free-ish for such as small project. Mongoose and the Cosmos DB API for MongoDB are expedient choices given the wealth of documentation for both for TypeScript/JavaScript. 

* Mongo DB developer guide for Cosmos DB
* Mongoose documentation

## Add a MongoDB container to the development environment

All the local services are managed by Docker compose for local development where possible. Add the MongoDB container so development and testing don't incur any pay-as-you-go costs. 

```yaml
version: "3"

services:
  api-todo:
    build:
      context: ./api-todo
    ports:
      - "3000:3000"
    depends_on:
      - mongodb

  client:
    build:
      context: ./client
    environment:
      VITE_USE_LOCAL_API: "true"
      VITE_API_URL: http://localhost:3000
    ports:
      - "3005:3005"
    depends_on:
      - api-todo

  mongodb:
    image: mongo:5.0
    restart: always
    environment:
      - MONGO_INITDB_ROOT_USERNAME=mongo
      - MONGO_INITDB_ROOT_PASSWORD=MongoPass
    ports:
      - "27017:27017"
    volumes:
      - ./mongodata:/data/db

volumes:
  mongodata:
```

Start the service in a separate terminal with:

```bash
docker compose up mongodb
```

I stoke this idea from the Contoso Real Estate project which has a wealth of development environment configuration for you to use. 

Now that the database is running, add the MongoDB viewer.

## Visual Studio Code extension for MongoDB

Make sure you add the [MongoDB](https://marketplace.visualstudio.com/items?itemName=mongodb.mongodb-vscode) viewer extension to the development environment, in the `devcontainer.json`. 

```json
	"customizations": {
		"vscode": {
			"extensions": [
				...other extensions,

				"mongodb.mongodb-vscode",
			]
		}
	},
```

You can add a connection with a connection string so this can be used for both local and cloud databases. 


## TODO shape

The shape of the TODO prior to this iteration was: 

```json
{
  id: 123
  title: 'Get Milk'
}
```

Update the shape to allow for data shape growth:

```json
{
  id: '65ad9ad0769c2853d2804f3f',
  title: 'Get Milk',
  description: 'the oaty kind',
  createdAt: '2024-01-21T22:29:36.849Z',
  updatedAt: ''
}
```

The title and description should have a max size to help the UI. 

## Install mongoose to API

TypeScript types are already in the package so just install it. 

```bash
npm install mongoose
```

The `package.json` shows `"mongoose": "^8.0.4",` in the dependencies property. 

## Connect to the database

Before jumping in with code in the API, make sure you can connect to the database with the client library. Design your schema and make sure any restrictions, validations, and transformations are complete. Leave the script in the repo, it will be handy for the next person onboarded to the project to not have to figure out how to connection and view data. Keep this connection script all as a single file. This allows someone new to the team and Mongoose to understand how the pieces fit together. 

```javascript
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const COLLECTION = 'TodoConnectionTest';

// Run mongo with `docker compose up mongodb`
const URI = 'mongodb://mongo:MongoPass@localhost:27017/';

const TodoSchema = new Schema(
  {
    title: {
      type: String,
      unique: true,
      minlength: 1,
      maxlength: 40,
    },
    description: {
      type: String,
      maxlength: 1000,
      default: null,
    },
    createdAt: {
      type: String,
    },
    updatedAt: {
      type: String,
      default: null,
    },
  },
  {
    versionKey: false,
    virtuals: true,
  }
);

TodoSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
TodoSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const main = async () => {
  // Connect to db
  mongoose.connect(URI);

  // Create a model
  const TodoDb = mongoose.model(COLLECTION, TodoSchema);

  // Using create
  const saveResult1 = await TodoDb.create({
    title: 'first todo',
    description: 'description',
    createdAt: new Date().toISOString(),
  });
  const transformed1 = saveResult1.toJSON();
  console.log('Created lean--------------------------------');
  console.log(transformed1);

  // ADD MORE COMMANDS

};

main()
  .then(() => {
    console.log('done');
    mongoose.disconnect();
  })
  .catch((e) => {
    console.log(e);
  });
```

Add a script to the `package.json` so you can test the connection:

```json
"mongoose:test": "node ./scripts/test-mongo-connection.js"
```

## TypeScript database service

Start with a generic CRUD class. All MongoDB collections will use this class to enforce consistency. 

```typescript
export default class CrudService<T> {
  #model: Model<T>;

  constructor(model: Model<T>) {
    this.#model = model;
  }

  // Add
  async add(doc: Partial<T>): Promise<T> {
      const improvedDoc = {
        ...doc,
        createdAt: new Date().toISOString(),
        updatedAt: null,
      };
      const data = await this.#model.create(improvedDoc);

      return data?.toJSON();
  }

  // Read
  async get(id: string): Promise<T> {

      const data = await this.#model.findById(id);

      return data: data?.toJSON();
  }

  // Update
  async update(
    id: string,
    update: Partial<T>
  ): Promise<T> {
      const improvedDoc = { ...update, updatedAt: new Date().toISOString() };

      const data = await this.#model.findByIdAndUpdate(id, improvedDoc, {
        new: true,
      });

      return data?.toJSON();
  }

  // Delete
  async delete(id: string): Promise<T> {
      const data = await this.#model.findByIdAndDelete(id);

      return data?.toJSON();
  }

  // Get All
  async getAll(): Promise<T[]> {
      const data = await this.#model.find();
      return data;
  }

  // Delete All
  async deleteAll(): Promise<unknown> {
      const deleteAllResponse = await this.#model.deleteMany({});
      return deleteAllResponse;
  }

  // Batch insert
  async seed(docs: T[] | Partial<T>[]): Promise<T[]> {
      const result = await this.#model.insertMany(docs);
      return data;
  }
}
```

MongoDB and the Mongoose client provide a high degree of configuration for what type of information to return from the mongoose calls. Its important to play with this in the previous script to determine what you want returned then apply those changes to this Crud class and the schema via the model that it uses. 

* **`_id` versus `id`**: MongoDB stores the unique id as `_id` but I want the REST API and the UI to only use `id`. Any transformations need to be done at this data layer. If this data service was used for automation or other movement of data between backend services, that would probably require some strict contracts so an ambitious DBA didn't make assumptions that the native `_id` was required. 
* transformation on **single versus multiple** items: many of the convenience functions run a query inside the mongoose client which is meant to operate on multiple values. When running queries, transformations applied to a single object (such as with create()) aren't applied to the objects. You need to either transform the objects yourself, or provide an aggregation pipeline to make sure you get the shape returned which you expect. This means your tests need to validate the shape of objects for all CRUD operations where you want data returned. You may opt to have have the transformations applied at the CRUD class level and the schema level, if the owner of the application code and the owner of the schema object definition are different people. For example, the tests might include:
  * Test property property count
  * Test property names
  * Test that `_id` and `_v` aren't returned
  * Test a new item only has the createdAt date
  * Test an updated item only has the updatedAt data
* **data returned**: the mongoose client methods can return a stunning variety of values and information. For example, when updating, the returned information can include the data set in, the data after it was updated, or include the number of items which were updated. Be clear in your design when to return what kind of information. The API layer should only return what the UI needs. 

## Use the CRUD class for collections

Create an interface to provide a data layer contract:

```typescript
export interface IDataClass<T> {
  add: (todo: Partial<T>) => Promise<T>;
  get: (id: string) => Promise<T>;
  getAll: () => Promise<T[]>;
  update: (id: string, todo: Partial<T>) => Promise<T>;
  delete: (id: string) => Promise<T>;
  deleteAll: () => Promise<unknown>;
  batch: (todos: T[]) => Promise<T[]>;
}
```

If there are specific validations or transformations for a collection, apply them at a layer above the generic CRUD class. 

```typescript
export type CrudServiceResponse<T> = {
  data: T | T[] | unknown | null;
  error: Error | null | ValidationError | ValidationError[] | undefined;
  valid?: boolean;
};

export class TodoService implements IDataClass<Todo> {
  #service: CrudService<Todo>;

  constructor(connection: mongoose.Connection) {
    const ConnectedTodoModel = connection.model<Todo>('Todo', TodoSchema);
    this.#service = new CrudService<Todo>(ConnectedTodoModel);
  }

  async get(id: string): Promise<CrudServiceResponse<Todo>> {
    if (!id) {
      return { data: null, error: new Error('id is required') };
    }

    return await this.#service.get(id);
  }

  async add(todo: Partial<Todo>): Promise<CrudServiceResponse<Todo>> {
    const { valid, error } = isValidPartial(todo);
    if (!valid) {
      return { data: null, error: error };
    }
    const addResponse = await this.#service.add(todo);
    return addResponse;
  }

  async update(
    id: string,
    todo: Partial<Todo>
  ): Promise<CrudServiceResponse<Todo>> {
    if (!id) {
      return { data: null, error: new Error('id is required') };
    }

    const { valid, error } = isValidPartial(todo);
    if (!valid) {
      return { data: null, error: error };
    }

    const updateResponse = await this.#service.update(id, {
      title: todo.title as string,
      description: todo.description as string,
      updatedAt: new Date().toISOString(),
    } as Todo);
    return updateResponse;
  }

  async delete(id: string): Promise<CrudServiceResponse<Todo>> {
    if (!id) {
      return { data: null, error: new Error('id is required') };
    }

    return await this.#service.delete(id);
  }
  async getAll(): Promise<CrudServiceResponse<Todo[]>> {
    return await this.#service.getAll();
  }
  async seed(
    incomingTodos: Partial<Todo>[]
  ): Promise<CrudServiceResponse<Todo[]>> {
    return await this.#service.seed(incomingTodos);
  }
  async deleteAll(): Promise<CrudServiceResponse<Todo[]>> {
    const deleteResponse = await this.#service.deleteAll();
    return deleteResponse;
  }
}
```

## Create the API routes and handlers

The API is separated between individual and multiple items. 

```typescript
// Multiples Routes

// Create Todo router with all routes then export it
const todosRouter = express.Router();

todosRouter.get('/', getAllTodosHandler);
todosRouter.patch('/', batchUploadTodoHandler);
todosRouter.delete('/', deleteAllTodoHandler);

// Catch-all route
todosRouter.all('*', (req, res) => {
  sendResponse(req, res, StatusCodes.NOT_FOUND, { error: 'Not Found' });
  return;
});
todosRouter.use(handleError);
```

```typescript
// Singles Routes
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
```

Pull in the routes to the Express app: 

```typescript
// Route that operates on a single todo
app.use('/todo', todoRouter);

// Route that operates on multiple todos
app.use('/todos', todosRouter);
```

## Test the APIs

You can use cURL, Postman, or Supertest. 

```bash
## Single
curl -X GET http://localhost:3000/todo/65ac3b70d3adb5df333004d7 --verbose
curl -X POST -H "Content-Type: application/json" -d '{"todo": {"title":"CURL New Todo", "description":"This is a new todo"}}' http://localhost:3000/todo --verbose
curl -X PUT -H "Content-Type: application/json" -d '{"todo": {"title":"CURL XXX Updated Todo", "description":"This is an updated todo"}}' http://localhost:3000/todo/65ac3d1b4c60586e545b3628 --verbose
curl -X DELETE http://localhost:3000/todo/65ac396a9afd90f786ab1fee --verbose

## Multiple
curl -X GET http://localhost:3000/todos --verbose
curl -X PATCH -H "Content-Type: application/json" -d @batch.json http://localhost:3000/todos/ --verbose
curl -X DELETE http://localhost:3000/todos --verbose
```

```typescript
import request from 'supertest';
import configureApp from './server'; // Import your Express app
import 'dotenv/config';

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
```

Make sure you validate the data returned:

```typescript
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
```

## Next step

The next step is to add this functionality to the cloud environment. 