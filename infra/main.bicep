targetScope = 'subscription'

param infraAppVersion string = '3.0.0' // Infrastructure app version
param portClient string = '3005'
param portApi string = '3000'

@minLength(1)
@maxLength(64)
@description('Name of the environment that can be used as part of naming resource convention')
param environmentName string

@minLength(1)
@description('Primary location for all resources')
param location string

// API
@description('The base URL used by the web service for sending API requests')
param webApiBaseUrl string = ''
param deploymentSpecificGuid string = newGuid()
var apiStatusPassword = uniqueString(deploymentSpecificGuid)

// CLIENT WEB APP
param apiTodoExists bool = false
param webAppExists bool = false
param webContainerAppName string = ''
var apiContainerAppNameOrDefault = '${abbrs.appContainerApps}web-${resourceToken}'
var corsAcaUrl = 'https://${apiContainerAppNameOrDefault}.${appsEnv.outputs.domain}'

// MONGOD DB
param cosmosAccountName string = ''
param cosmosDatabaseName string = ''

@description('Id of the user or app to assign application roles')
param principalId string

param deploymentDateTimeUtc string = utcNow()
param deploymentName string = deployment().name

// Tags that should be applied to all resources.
// 
// Note that 'azd-service-name' tags should be applied separately to service host resources.
// Example usage:
//   tags: union(tags, { 'azd-service-name': <service name in azure.yaml> })
var tags = {
  'azd-env-name': environmentName
  'azd-deployment-id': deploymentName
  'azd-deployment-utc': deploymentDateTimeUtc
  'azd-app-version': infraAppVersion
}

var abbrs = loadJsonContent('./abbreviations.json')
var resourceToken = toLower(uniqueString(subscription().id, environmentName, location))

resource rg 'Microsoft.Resources/resourceGroups@2022-09-01' = {
  name: 'rg-${environmentName}'
  location: location
  tags: tags
}

module monitoring './shared/monitoring.bicep' = {
  name: 'monitoring'
  params: {
    location: location
    tags: tags
    logAnalyticsName: '${abbrs.operationalInsightsWorkspaces}${resourceToken}'
    applicationInsightsName: '${abbrs.insightsComponents}${resourceToken}'
  }
  scope: rg
}

module dashboard './shared/dashboard-web.bicep' = {
  name: 'dashboard'
  params: {
    name: '${abbrs.portalDashboards}${resourceToken}'
    applicationInsightsName: monitoring.outputs.applicationInsightsName
    location: location
    tags: tags
  }
  scope: rg
}

module registry './shared/registry.bicep' = {
  name: 'registry'
  params: {
    location: location
    tags: tags
    name: '${abbrs.containerRegistryRegistries}${resourceToken}'
  }
  scope: rg
}

module keyVault './shared/keyvault.bicep' = {
  name: 'keyvault'
  params: {
    location: location
    tags: tags
    name: '${abbrs.keyVaultVaults}${resourceToken}'
    principalId: principalId
  }
  scope: rg
}

module appsEnv './shared/apps-env.bicep' = {
  name: 'apps-env'
  params: {
    name: '${abbrs.appManagedEnvironments}${resourceToken}'
    location: location
    tags: tags
    applicationInsightsName: monitoring.outputs.applicationInsightsName
    logAnalyticsWorkspaceName: monitoring.outputs.logAnalyticsWorkspaceName
  }
  scope: rg
}

// ****** Add Database module here ******
// Use todo-nodejs-mongo-aca as template
// Change collection shape
// Connection Id stored in Key vault and returned in output
// Key vault key is 'AZURE-COSMOS-CONNECTION-STRING'
module cosmos './app/db.bicep' = {
  name: 'cosmos'
  scope: rg
  params: {
    accountName: !empty(cosmosAccountName) ? cosmosAccountName : '${abbrs.documentDBDatabaseAccounts}${resourceToken}'
    databaseName: cosmosDatabaseName
    location: location
    tags: tags
    keyVaultName: keyVault.outputs.name
  }
}

// var secretsBackend = [
//   {
//     AZURE_KEY_VAULT_COSMOSDB_CONNECTION_STRING_KEY_NAME: cosmos.outputs.connectionStringKey
//     AZURE_KEY_VAULT_ENDPOINT: keyVault.outputs.endpoint
//   }
// ]

module apiTodo './app/api.bicep' = {
  name: 'api'
  params: {
    name: 'api-${abbrs.appContainerApps}${resourceToken}'
    location: location
    tags: tags
    identityName: 'api-${abbrs.managedIdentityUserAssignedIdentities}-${resourceToken}'
    applicationInsightsName: monitoring.outputs.applicationInsightsName
    containerAppsEnvironmentName: appsEnv.outputs.name
    containerRegistryName: registry.outputs.name
    exists: apiTodoExists
    corsAcaUrl: corsAcaUrl
    keyVaultName: keyVault.outputs.name
    apiStatusPassword: apiStatusPassword
    port: portApi
    }
  scope: rg
}

// Web frontend
module clientTodo './app/client.bicep' = {
  name: 'client'
  scope: rg
  params: {
    name: !empty(webContainerAppName) ? webContainerAppName : 'client-${abbrs.appContainerApps}${resourceToken}'
    location: location
    tags: tags
    identityName: 'client-${abbrs.managedIdentityUserAssignedIdentities}-${resourceToken}'
    applicationInsightsName: monitoring.outputs.applicationInsightsName
    containerAppsEnvironmentName: appsEnv.outputs.name
    containerRegistryName: registry.outputs.name
    exists: webAppExists
    apiBaseUrl: !empty(webApiBaseUrl) ? webApiBaseUrl : apiTodo.outputs.SERVICE_WEB_URI
    port: portClient
  }
}

// RESOURCE GROUP
output RESOURCE_GROUP_NAME string = rg.name
output INFRA_APP_VERSION string = infraAppVersion

// CLIENT FRONTEND
output CLIENT_TODO_NAME string = clientTodo.outputs.SERVICE_WEB_NAME
output CLIENT_TODO_ENDPOINT string = clientTodo.outputs.SERVICE_WEB_URI
output VITE_API_URL string = apiTodo.outputs.SERVICE_WEB_URI
output CLIENT_IMAGE_NAME string = clientTodo.outputs.SERVICE_WEB_IMAGE_NAME

// API BACKEND
output API_TODO_ENDPOINT string = apiTodo.outputs.SERVICE_WEB_URI
output API_IMAGE_NAME string = apiTodo.outputs.SERVICE_WEB_IMAGE_NAME

// APPS ENVIRONMENT
output APPS_DEFAULT_DOMAIN string = appsEnv.outputs.domain
output AZURE_CONTAINER_REGISTRY_ENDPOINT string = registry.outputs.loginServer

// KEY VAULT
output AZURE_KEY_VAULT_NAME string = keyVault.outputs.name
output AZURE_KEY_VAULT_ENDPOINT string = keyVault.outputs.endpoint
output AZURE_KEY_VAULT_COSMOSDB_CONNECTION_STRING_KEY_NAME string = cosmos.outputs.connectionStringKey

// MONITORING
output AZURE_MONITORING_APPLICATION_INSIGHTS_INSTRUMENTATION_KEY string = monitoring.outputs.instrumentationKey
output AZURE_MONITORING_APPLICATION_INSIGHTS_CONNECTION_STRING string = monitoring.outputs.applicationInsightsConnectionString
output DEPLOYMENT_NAME string = deploymentName
output DEPLOYMENT_DATETIME_UTC string = deploymentDateTimeUtc

// DATABASE
output AZURE_COSMOSDB_DATABASE_NAME string = cosmos.outputs.databaseName
output AZURE_COSMOSDB_ENDPOINT string = cosmos.outputs.endpoint
