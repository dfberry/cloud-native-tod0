import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { StatusCodes } from 'http-status-codes';
import todoRouter from './routes/todo';
import { logger } from './logger';
import { sendResponse, logRequest } from './middleware/response';
import { setVersionHeader } from './middleware/version';
import { version } from '../package.json';

interface HttpError extends Error {
  status?: number;
}

const swaggerDocument = YAML.load(path.resolve(__dirname, './openapi.yaml'));

const app = express();
app.use(bodyParser.json());
app.use(cors());

// add preroute handlers
app.use(logRequest);
app.use(setVersionHeader);

// add swagger docsLearn
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// import and use todo route
app.use('/todo', todoRouter);
app.use('/', (req: Request, res: Response) => {
  sendResponse(req, res, StatusCodes.ACCEPTED, {
    data: `Hello World! ${version} `,
  });
  return;
});

// Catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  const err: HttpError = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use((err: HttpError, req: Request, res: Response) => {
  // Set locals, only providing error in development
  logger.error(`${req.method} ${req.path} error ${JSON.stringify(err)}`);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  logger.error(`Server error hande - ${err.message}`);
  sendResponse(req, res, err.status || 500, { error: err.message });
  return;
});

export default app;
