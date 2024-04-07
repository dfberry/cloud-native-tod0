import { TodoService } from './mongoose/todo.service';
import { TodoInMemoryService } from './inmem/todo.service';

import { IDataClass } from './types';
import { Todo } from './todo.types';
import connectAppToMongoose from './mongoose/config';
import { Connection } from 'mongoose';

type DatabaseCollections = {
  todo: IDataClass<Todo>;
  connection?: Connection | null;
};

export type DatabaseServiceType = {
  isMongoDB: boolean;
  db: DatabaseCollections;
};

const setupMongoDB = async (CONFIG, logger): Promise<DatabaseCollections> => {
  logger.debug('Data service: Using mongoddb database');
  const connection = await connectAppToMongoose(CONFIG, process, logger);

  if (!connection) {
    throw Error('MongoDB connection not returned');
  }
  if (connection && connection.readyState === 1) {
    const dbTodoCollection = new TodoService(connection);

    if (
      process.env.NODE_ENV == 'test' ||
      process.env.NODE_ENV == 'testwithlogs'
    ) {
      return { todo: dbTodoCollection, connection };
    } else {
      return { todo: dbTodoCollection, connection: null };
    }
  } else {
    throw Error('Mongoose database connection error, readystate=== ');
  }
};
const setupInMemory = async (logger): Promise<DatabaseCollections> => {
  logger.debug('Data service: Using in-memory database');
  const dbTodoCollection = new TodoInMemoryService();
  return { todo: dbTodoCollection };
};

const DatabaseService = async (
  CONFIG,
  logger
): Promise<DatabaseServiceType> => {
  const isMongoDB = CONFIG.database.isMongoDB;
  console.log('CONFIG: Using ${isMongoDB ? MongoDB : in-memory} database');

  const databaseCollections: DatabaseCollections = isMongoDB
    ? await setupMongoDB(CONFIG, logger)
    : await setupInMemory(logger);

  return {
    db: databaseCollections,
    isMongoDB,
  };
};

export default DatabaseService;
