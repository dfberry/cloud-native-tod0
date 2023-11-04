import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

const swaggerDocument = YAML.load(path.resolve(__dirname, './openapi.yaml'));

interface Todo {
  id: number;
  title: string;
}

const todos: Todo[] = [
  { id: 1, title: 'First Todo' },
  { id: 2, title: 'Second Todo' },
  { id: 3, title: 'Third Todo' },
];

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/todos', (req: Request, res: Response) => {
  res.send(todos);
});

app.post('/todos', (req: Request, res: Response) => {
  const todo: Todo = {
    id: new Date().valueOf(),
    title: req.body.title,
  };

  todos.push(todo);
  res.status(201).send(todo);
});

app.put('/todos/:id', (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);
  const index: number = todos.findIndex((todo) => todo.id === id);

  if (index > -1) {
    todos[index] = { id, title: req.body.title };
    res.send(todos[index]);
  } else {
    res.status(404).send({ message: 'Todo not found' });
  }
});

app.delete('/todos/:id', (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);
  const index: number = todos.findIndex((todo) => todo.id === id);

  if (index > -1) {
    const todo = todos.splice(index, 1);
    res.send(todo);
  } else {
    res.status(404).send({ message: 'Todo not found' });
  }
});
// ... rest of your routes ...

export default app;
