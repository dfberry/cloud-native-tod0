param accountName string
param location string = resourceGroup().location
param tags object = {}

// https://learn.microsoft.com/en-us/azure/cosmos-db/mongodb/manage-with-bicep
param collections array = [
  {
    name: 'todo'
    id: 'todo'
    shardKey: 'Hash'
    indexKey: '_id'
  }
]
param databaseName string = 'todo'
param keyVaultName string

// Because databaseName is optional in main.bicep, we make sure the database name is set here.
var defaultDatabaseName = 'todo'
var actualDatabaseName = !empty(databaseName) ? databaseName : defaultDatabaseName

module cosmos '../shared/database/cosmos/mongo/cosmos-mongo-db.bicep' = {
  name: 'cosmos-mongo'
  params: {
    accountName: accountName
    databaseName: actualDatabaseName
    location: location
    collections: collections
    keyVaultName: keyVaultName
    tags: tags
  }
}

output connectionStringKey string = cosmos.outputs.connectionStringKey
output databaseName string = cosmos.outputs.databaseName
output endpoint string = cosmos.outputs.endpoint
