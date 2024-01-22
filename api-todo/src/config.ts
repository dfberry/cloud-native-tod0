// api-todo/.env
const DATABASE_URI = process.env.DATABASE_URI;

// ./docker-compose.yml
const DEFAULT_MONGO_DB = 'mongodb://mongo:MongoPass@localhost:27017/';

export const getConfig = (logger) => {
  const isMongoDB =
    process.env.DATABASE_USE_MONGODB === 'true' ||
    process.env.DATABASE_USE_MONGODB === '1'
      ? true
      : false;

  logger.debug(`CONFIG: Using ${isMongoDB ? 'MongoDB' : 'in-memory'} database`);

  const dbUri = isMongoDB ? DATABASE_URI || DEFAULT_MONGO_DB : null;
  logger.debug(`CONFIG: dbUri: ${dbUri}`);

  const appConfig = {
    database: {
      isMongoDB,
      uri: dbUri,
      options: {
        dbName: 'todo',
      },
    },
  };

  return appConfig;
};
