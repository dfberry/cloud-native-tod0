import { getSecretFromKeyVault } from './azure/keyvault';
// api-todo/.env
const DATABASE_URI = process.env.DATABASE_URI;

// ./docker-compose.yml
const DEFAULT_MONGO_DB =
  DATABASE_URI || 'mongodb://mongo:MongoPass@localhost:27017/';

function getEnvVarAsString(name: string, defaultValue: string): string {
  return process.env[name] || defaultValue;
}
function getEnvVarAsBoolean(name: string, defaultValue: boolean): boolean {
  const value = process.env[name];
  if (value === 'true' || value === '1') {
    return true;
  } else if (value === 'false' || value === '0') {
    return false;
  } else {
    return defaultValue;
  }
}

export const getConfig = async (logger) => {
  const isMongoDB =
    getEnvVarAsString('DATABASE_USE_MONGODB', 'false') === 'true' ||
    getEnvVarAsString('DATABASE_USE_MONGODB', 'false') === '1';

  logger.debug(`CONFIG: Using ${isMongoDB ? 'MongoDB' : 'in-memory'} database`);
  console.log(`CONFIG: Using ${isMongoDB ? 'MongoDB' : 'in-memory'} database`);

  const dbUri = isMongoDB ? await getConnectionString(logger) : null;

  logger.debug(`CONFIG: dbUri: ${dbUri}`);
  console.log(`CONFIG: dbUri: ${dbUri}`);

  const appConfig = {
    database: {
      isMongoDB,
      uri: dbUri,
      options: {
        dbName: 'todo', // this must match the infra/app/db.bicep
      },
    },
  };

  console.log('CONFIG: appConfig: ', appConfig);

  return appConfig;
};

const getConnectionString = async (logger): Promise<string> => {
  logger.debug(`CONFIG: getConnectionString:`);

  const isCloudDb: boolean = getEnvVarAsBoolean('DATABASE_IN_CLOUD', false);

  const keyVaultSecretName = getEnvVarAsString(
    'AZURE_KEY_VAULT_COSMOSDB_CONNECTION_STRING_KEY_NAME',
    ''
  );
  const keyVaultEndpoint = getEnvVarAsString('AZURE_KEY_VAULT_ENDPOINT', '');

  const connectionString =
    isCloudDb && keyVaultEndpoint && keyVaultSecretName
      ? await getSecretFromKeyVault(
          keyVaultEndpoint,
          keyVaultSecretName,
          logger
        )
      : DEFAULT_MONGO_DB;
  logger.debug(`CONFIG: getConnectionString: ${connectionString}`);

  return connectionString || '';
};
