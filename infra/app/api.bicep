param name string
param location string = resourceGroup().location
param tags object = {}

@secure()
param apiStatusPassword string
param port string

param identityName string
param applicationInsightsName string
param containerAppsEnvironmentName string
param containerRegistryName string
param keyVaultName string
param serviceName string = 'api'
param corsAcaUrl string
param exists bool


resource webIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: identityName
  location: location
}

// Give the API access to KeyVault
module apiKeyVaultAccess '../shared/security/keyvault-access.bicep' = {
  name: 'api-keyvault-access'
  params: {
    keyVaultName: keyVaultName
    principalId: webIdentity.properties.principalId
  }
}

module app '../shared/host/container-app-upsert.bicep' = {
  name: '${serviceName}-container-app'
  params: {
    name: name
    location: location
    identityName: identityName
    tags: union(tags, { 'azd-service-name': serviceName })
    containerAppsEnvironmentName: containerAppsEnvironmentName
    containerRegistryName: containerRegistryName
    exists: exists
    env: [
      {
        name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
        value: applicationInsights.properties.ConnectionString
      }
      {
        name: 'PORT'
        value: port
      }
      {
        name: 'API_ALLOW_ORIGINS'
        value: corsAcaUrl
      }
      {
        name: 'AZURE_CLIENT_ID'
        value: webIdentity.properties.clientId
      }
      {
        name: 'AZURE_KEY_VAULT_ENDPOINT'
        value: keyVault.properties.vaultUri
      }
      {
        name: 'AZURE_KEY_VAULT_COSMOSDB_CONNECTION_STRING_KEY_NAME' 
        value: 'AZURE-COSMOS-CONNECTION-STRING'
      }
      {
        name: 'DATABASE_USE_MONGODB'
        value: 'true'
      }
      {
        name: 'DATABASE_IN_CLOUD'
        value: 'true'
      }
      {
        name: 'API_STATUS_PASSWORD'
        value: apiStatusPassword
      }
    ]
    targetPort: int(port)
  }
}

resource applicationInsights 'Microsoft.Insights/components@2020-02-02' existing = {
  name: applicationInsightsName
}

resource keyVault 'Microsoft.KeyVault/vaults@2022-07-01' existing = {
  name: keyVaultName
}

output SERVICE_WEB_IDENTITY_PRINCIPAL_ID string = webIdentity.properties.principalId
output SERVICE_WEB_NAME string = app.outputs.name
output SERVICE_WEB_URI string = app.outputs.uri
output SERVICE_WEB_IMAGE_NAME string = app.outputs.imageName
