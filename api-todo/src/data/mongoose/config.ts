import mongoose, { ConnectOptions } from 'mongoose';

class DatabaseConnectionError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'DatabaseConnectionError';
  }
}

const connectAppToMongoose = async (CONFIG, process, logger) => {
  try {
    await connectMongoose(CONFIG.database.uri, CONFIG.database.options, logger);
    return mongoose.connection;
  } catch (err) {
    logger.error('Error connecting to database:', err);
    process.exit(1);
  }
};

const setupMongooseListeners = (db: mongoose.Connection, logger) => {
  db.on('connecting', () => logger.info('Mongoose connecting...'));
  db.on('connected', () => logger.info('Mongoose connected successfully!'));
  db.on('disconnecting', () => logger.info('Mongoose disconnecting...'));
  db.on('disconnected', () =>
    logger.info('Mongoose disconnected successfully!')
  );
  db.on('reconnected', () => logger.info('Mongoose reconnected!'));
  db.on('close', () => logger.info('Mongoose connection closed!'));
  db.on('error', (err: Error) => logger.error('Mongoose database error:', err));
};

export const connectMongoose = async (
  uri: string,
  config: ConnectOptions,
  logger
) => {
  try {
    logger.info('Connecting to MongoDB...' + uri);
    logger.info('Config...' + JSON.stringify(config));

    await mongoose.connect(uri, config);
    const db = mongoose.connection;
    setupMongooseListeners(db, logger);

    switch (db.readyState) {
      case 0: // disconnected
        logger.info('Mongoose is disconnected.');
        break;
      case 1: // connected
        logger.info('Mongoose connected successfully!');
        break;
      case 2: // connecting
        logger.info('Mongoose is connecting...');
        break;
      case 3: // disconnecting
        logger.info('Mongoose is disconnecting...');
        break;
      default:
        logger.info('Unknown Mongoose connection state:', db.readyState);
    }
    return db;
  } catch (err) {
    logger.error('Mongoose database error:', err);
    throw new DatabaseConnectionError(`Mongoose database error: ${err}`);
  }
};

// export as default connectAppToMongoose
export default connectAppToMongoose;
