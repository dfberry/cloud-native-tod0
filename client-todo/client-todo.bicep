param name string
param location string = resourceGroup().location
param tags object = {}

param identityName string
param containerAppsEnvironmentName string
param containerRegistryName string
param serviceName string = 'client-todo'
param exists bool

param fullBuild bool = false



// if fullBuild is false, set utcNow() as the build number
param currentDeploymentDateTimeUtc string = utcNow()

resource webIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: identityName
  location: location
}

// build up tags 
var updatedTags = fullBuild ? union(tags, { 'azd-service-name': 'client-todo' }) : union(tags, { 'azd-service-name': 'client-todo', 'azd-deployment-id': deployment().name, 'azd-deployment-utc': currentDeploymentDateTimeUtc })

module app '../infra/shared/host/container-app-upsert.bicep' = {
  name: '${serviceName}-container-app'
  params: {
    name: name
    location: location
    tags: updatedTags
    identityType: 'UserAssigned'
    identityName: identityName
    exists: exists
    containerAppsEnvironmentName: containerAppsEnvironmentName
    containerRegistryName: containerRegistryName
    targetPort: 80
  }
}

output CLIENT_WEB_IDENTITY_PRINCIPAL_ID string = webIdentity.properties.principalId
output CLIENT_WEB_NAME string = app.outputs.name
output CLIENT_WEB_URI string = app.outputs.uri
output CLIENT_WEB_IMAGE_NAME string = app.outputs.imageName
