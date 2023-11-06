import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { StatusCodes } from 'http-status-codes';
import todoRouter from './routes/todo';
import { logger } from './logger';

interface HttpError extends Error {
  status?: number;
}

const swaggerDocument = YAML.load(path.resolve(__dirname, './openapi.yaml'));

const app = express();
app.use(bodyParser.json());
app.use(cors());

// add preroute handler
app.use((req: Request, res: Response, next: NextFunction) => {
  //logger.info(`${req.method} ${req.path}`);
  next();
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// import and use todo route
app.use('/todo', todoRouter);
app.use('/', (req: Request, res: Response) => {
  return res.status(StatusCodes.ACCEPTED).send('Hello World!');
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
  res.status(err.status || 500).json({ error: err.message });
});
export default app;
