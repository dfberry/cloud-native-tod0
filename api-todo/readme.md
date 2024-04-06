# Environment variables declared in this file are automatically made available to Prisma.
# See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings

```
DATABASE_URI="mongodb://dfberry-cosmos-mongo-serverless.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@dfberry-cosmos-mongo-serverless@"
DATABASE_NAME="todo"
DATABASE_RESET="true"
DATABASE_USE_MONGODB=false
DATABASE_IN_CLOUD=false
```

## Build and run locally

Root level:

```
npm run clean 
azd provision
bash scripts/create-env-docker.sh
```

Api level:

```
npm run build
npm run docker:build:mongodb
npm run docker:run
```