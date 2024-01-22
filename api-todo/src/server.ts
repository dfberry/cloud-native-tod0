import express, { Request, Response /*, NextFunction*/ } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { StatusCodes } from 'http-status-codes';
import todoRouter from './routes/todo/todo';
import todosRouter from './routes/todo/todos';
import { sendResponse, logRequest } from './middleware/response';
import { setVersionHeader } from './middleware/version';
import { version } from '../package.json';
import { handle404, handleError } from './routes/handlers/global.handlers';
import DatabaseService from './data/service';
import { getConfig } from './config';
import { logger } from './logger';
// interface HttpError extends Error {
//   status?: number;
// }

const configureApp = async () => {
  const CONFIG = getConfig(logger);
  const { db } = await DatabaseService(CONFIG, logger);

  const swaggerDocument = YAML.load(path.resolve(__dirname, './openapi.yaml'));

  const app = express();
  app.locals.db = db;
  app.use(bodyParser.json());
  app.use(cors());

  // add preroute handlers
  app.use(logRequest);
  app.use(setVersionHeader);

  // add swagger docsLearn
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // Route that operates on a single todo
  app.use('/todo', todoRouter);

  // Route that operates on multiple todos
  app.use('/todos', todosRouter);

  const rootHandler = (req: Request, res: Response) => {
    sendResponse(req, res, StatusCodes.ACCEPTED, {
      data: `Hello World! ${version} `,
    });
    return;
  };

  app.use('/', rootHandler);

  // Catch 404 and forward to error handler
  app.use(handle404);

  // Error handler
  app.use(handleError);

  return { app, CONFIG, connection: db.connection };
};

export default configureApp;
